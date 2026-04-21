import { type NextRequest, NextResponse } from "next/server";

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
    const claudeKey =
      process.env.CLAUDE_API_KEY || process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    const claudeModel = process.env.CLAUDE_MODEL || process.env.ANTHROPIC_MODEL;

    if (!claudeKey) {
      return NextResponse.json(
        {
          error:
            "No API key configured. Please set CLAUDE_API_KEY or NEXT_PUBLIC_CLAUDE_API_KEY",
        },
        { status: 500 },
      );
    }

    let extractedData: unknown;

    try {
      console.log("Extracting CV data with Claude API...");
      const rawData = await extractWithClaude(
        base64,
        file.type,
        claudeKey,
        claudeModel,
      );
      console.log("Claude extraction successful");
      extractedData = transformClaudeResponseToTCVContent(rawData);
      console.log("Data transformation successful");
    } catch (error) {
      console.error("Claude extraction failed", error);
      throw error;
    }

    return NextResponse.json(extractedData);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Extraction error:", errorMsg);

    // Return more informative error message
    let userMessage = "Failed to extract CV data. Please try again later.";
    let statusCode = 500;

    if (errorMsg.includes("high demand")) {
      userMessage =
        "AI services are currently busy. Please try again in a moment.";
      statusCode = 429;
    } else if (errorMsg.includes("API key")) {
      userMessage = "API configuration error. Please contact support.";
      statusCode = 500;
    } else if (
      errorMsg.includes("No content") ||
      errorMsg.includes("Could not find JSON")
    ) {
      userMessage =
        "Could not extract data from your CV. Please ensure the file is readable.";
      statusCode = 400;
    }

    return NextResponse.json(
      { error: userMessage, details: errorMsg },
      { status: statusCode },
    );
  }
}

async function extractWithClaude(
  base64: string,
  mimeType: string,
  apiKey: string,
  preferredModel?: string,
) {
  const mediaType =
    mimeType === "application/pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const modelCandidates = [
    preferredModel,
    "claude-sonnet-4-5-20250929", // Claude Sonnet 4.5 (stable snapshot)
    "claude-haiku-4-5-20251001", // Claude Haiku 4.5 (cheaper fallback)
    "claude-sonnet-4-20250514", // Claude Sonnet 4 (older fallback)
  ].filter((model, index, arr): model is string => {
    return Boolean(model) && arr.indexOf(model) === index;
  });

  let lastError = "Unknown error";

  for (const model of modelCandidates) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
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
      const errorMessage = data.error?.message || "Unknown error";
      lastError = `${model}: ${errorMessage}`;

      if (shouldTryNextClaudeModel(errorMessage)) {
        console.warn(
          `Claude model '${model}' unavailable, trying fallback model...`,
        );
        continue;
      }

      throw new Error(`Claude API error (${model}): ${errorMessage}`);
    }

    return parseExtractedJsonFromText(data.content?.[0]?.text, "Claude");
  }

  throw new Error(
    `Claude API error: No compatible model found. Tried: ${modelCandidates.join(
      ", ",
    )}. Last error: ${lastError}`,
  );
}

function shouldTryNextClaudeModel(errorMessage: string): boolean {
  return /(unknown model|invalid model|model\s*:|model.*(not found|not supported|deprecated|does not exist|retired))/i.test(
    errorMessage,
  );
}

function parseExtractedJsonFromText(
  content: string | undefined,
  provider: string,
) {
  if (!content) {
    throw new Error(`No content in ${provider} response`);
  }

  let jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
  if (!jsonMatch) {
    jsonMatch = content.match(/\{[\s\S]*\}/);
  }
  if (!jsonMatch) {
    throw new Error(`Could not find JSON in ${provider} response`);
  }

  const jsonString = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonString);
}

// Transform Claude's raw extraction format to TCVContent format
function transformClaudeResponseToTCVContent(rawData: unknown): unknown {
  const data = rawData as Record<string, unknown>;

  const personalInfo = data.personalInfo as Record<string, unknown>;
  const experience = (data.experience as Array<Record<string, unknown>>) || [];
  const education = (data.education as Array<Record<string, unknown>>) || [];
  const languagesArray = (data.languages as string[]) || [];
  const skillsArray = (data.skills as string[]) || [];

  return {
    personalInfo: {
      fullName: personalInfo?.name || "",
      role: "", // Not provided by Claude, can be left empty
      email: personalInfo?.email || "",
      phoneNumber: personalInfo?.phone || "",
      address: personalInfo?.location || "",
      summary: data.summary || "",
      photoUrl: undefined, // User can upload later
    },
    experiences: experience.map((exp: Record<string, unknown>) => ({
      companyName: exp.company || "",
      position: exp.position || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      isCurrent:
        !exp.endDate || (exp.endDate as string)?.trim() === "" || false,
      description: ((exp.description as string) || "")
        .split("\n")
        .filter((line: string) => line.trim().length > 0),
    })),
    education: education.map((edu: Record<string, unknown>) => ({
      institutionName: edu.school || "",
      degree: edu.degree || "",
      majorSubject: edu.field || "",
      startDate: edu.graduationDate || "",
      endDate: undefined,
      isCurrent: false,
    })),
    skills: skillsArray,
    languages: languagesArray.map((lang: string) => ({
      name: lang,
      proficiency: "Fluent", // Default proficiency if not specified
    })),
    interests: [],
  };
}
