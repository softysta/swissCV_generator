import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are allowed." },
        { status: 400 },
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Determine which API to use
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const claudeKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;

    if (!geminiKey && !claudeKey) {
      return NextResponse.json(
        { error: "No API key configured. Please set NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_CLAUDE_API_KEY" },
        { status: 500 },
      );
    }

    let extractedData;
    let lastError: Error | null = null;

    // Try Gemini first with retry logic for high demand
    if (geminiKey) {
      try {
        extractedData = await extractWithGemini(base64, file.type, geminiKey);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.warn("Gemini extraction failed, trying Claude fallback...", errorMsg);
        lastError = error as Error;
        
        if (claudeKey) {
          try {
            console.log("Attempting extraction with Claude API...");
            extractedData = await extractWithClaude(base64, file.type, claudeKey);
            console.log("Claude extraction successful");
          } catch (claudeError) {
            console.error("Both Gemini and Claude failed:", {
              gemini: errorMsg,
              claude: claudeError instanceof Error ? claudeError.message : String(claudeError),
            });
            // If both fail, throw with more informative error
            throw new Error(
              `Extraction failed. Gemini: ${errorMsg}. Claude: ${
                claudeError instanceof Error ? claudeError.message : String(claudeError)
              }`
            );
          }
        } else {
          throw new Error(
            `Gemini API failed: ${errorMsg}. Claude API not configured as fallback.`
          );
        }
      }
    } else if (claudeKey) {
      try {
        console.log("Using Claude API for extraction...");
        extractedData = await extractWithClaude(base64, file.type, claudeKey);
        console.log("Claude extraction successful");
      } catch (error) {
        console.error("Claude extraction failed", error);
        throw error;
      }
    } else {
      throw new Error("No API key configured. Set NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_CLAUDE_API_KEY");
    }

    return NextResponse.json(extractedData);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Extraction error:", errorMsg);
    
    // Return more informative error message
    let userMessage = "Failed to extract CV data. Please try again later.";
    let statusCode = 500;

    if (errorMsg.includes("high demand")) {
      userMessage = "AI services are currently busy. Please try again in a moment.";
      statusCode = 429;
    } else if (errorMsg.includes("API key")) {
      userMessage = "API configuration error. Please contact support.";
      statusCode = 500;
    } else if (errorMsg.includes("No content") || errorMsg.includes("Could not find JSON")) {
      userMessage = "Could not extract data from your CV. Please ensure the file is readable.";
      statusCode = 400;
    }

    return NextResponse.json(
      { error: userMessage, details: errorMsg },
      { status: statusCode },
    );
  }
}

async function extractWithGemini(
  base64: string,
  mimeType: string,
  apiKey: string,
) {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Extract and structure the CV/Resume into a JSON format with the following fields:
              {
                "personalInfo": {
                  "name": "string",
                  "email": "string",
                  "phone": "string",
                  "location": "string"
                },
                "summary": "string",
                "experience": [
                  {
                    "company": "string",
                    "position": "string",
                    "startDate": "string",
                    "endDate": "string",
                    "description": "string"
                  }
                ],
                "education": [
                  {
                    "school": "string",
                    "degree": "string",
                    "field": "string",
                    "graduationDate": "string"
                  }
                ],
                "skills": ["string"],
                "languages": ["string"],
                "certifications": [
                  {
                    "name": "string",
                    "issuer": "string",
                    "date": "string"
                  }
                ]
              }
              
              Here is the CV content:`,
                  },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64,
                    },
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || "Unknown error";
        
        // Check if it's a high demand error - if so, retry (unless it's the last attempt)
        if (errorMsg.includes("high demand") && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(
            `Gemini high demand error. Retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue; // Retry
        }

        throw new Error(`Gemini API error: ${errorMsg}`);
      }

      // Extract JSON from response
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("No content in Gemini response");
      }

      // Parse JSON from the response - handle markdown code blocks
      let jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      if (!jsonMatch) {
        jsonMatch = content.match(/\{[\s\S]*\}/);
      }
      if (!jsonMatch) {
        throw new Error("Could not find JSON in Gemini response");
      }

      const jsonString = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonString);
    } catch (error) {
      lastError = error as Error;
      
      // If it's the last attempt or not a retryable error, throw
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }
    }
  }

  // Should not reach here, but if we do, throw the last error
  throw lastError || new Error("Gemini extraction failed after retries");
}

function shouldRetry(error: unknown): boolean {
  const errorMsg = error instanceof Error ? error.message : String(error);
  return errorMsg.includes("high demand") || errorMsg.includes("temporarily");
}

async function extractWithClaude(
  base64: string,
  mimeType: string,
  apiKey: string,
) {
  const mediaType =
    mimeType === "application/pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract and structure the CV/Resume into a JSON format with the following fields:
              {
                "personalInfo": {
                  "name": "string",
                  "email": "string",
                  "phone": "string",
                  "location": "string"
                },
                "summary": "string",
                "experience": [
                  {
                    "company": "string",
                    "position": "string",
                    "startDate": "string",
                    "endDate": "string",
                    "description": "string"
                  }
                ],
                "education": [
                  {
                    "school": "string",
                    "degree": "string",
                    "field": "string",
                    "graduationDate": "string"
                  }
                ],
                "skills": ["string"],
                "languages": ["string"],
                "certifications": [
                  {
                    "name": "string",
                    "issuer": "string",
                    "date": "string"
                  }
                ]
              }
              
              Please return ONLY the JSON object, no additional text.`,
            },
            {
              type: "document",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Claude API error: ${data.error?.message || "Unknown error"}`,
    );
  }

  // Extract JSON from response
  const content = data.content?.[0]?.text;
  if (!content) {
    throw new Error("No content in Claude response");
  }

  // Parse JSON from the response - handle markdown code blocks
  let jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
  if (!jsonMatch) {
    jsonMatch = content.match(/\{[\s\S]*\}/);
  }
  if (!jsonMatch) {
    throw new Error("Could not find JSON in Claude response");
  }

  const jsonString = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonString);
}
