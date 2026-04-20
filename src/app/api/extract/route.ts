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

    if (geminiKey) {
      extractedData = await extractWithGemini(base64, file.type, geminiKey);
    } else if (claudeKey) {
      extractedData = await extractWithClaude(base64, file.type, claudeKey);
    } else {
      throw new Error("No API key available");
    }

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract CV data" },
      { status: 500 },
    );
  }
}

async function extractWithGemini(
  base64: string,
  mimeType: string,
  apiKey: string,
) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
    throw new Error(
      `Gemini API error: ${data.error?.message || "Unknown error"}`,
    );
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
