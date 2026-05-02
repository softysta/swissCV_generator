import { type NextRequest, NextResponse } from "next/server";
import { applySwissToneToCV } from "@/lib/swissToneConverter";
import {
  extractExpertiseFromExperiences,
  extractSpecializedKeywords,
  mergeExpertise,
} from "@/lib/expertiseExtraction";
import {
  type TLanguageCode,
} from "@/lib/languageLocalization";

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
      
      // Try to extract image from PDF if available
      let extractedImage: string | undefined;
      if (file.type === "application/pdf") {
        try {
          extractedImage = await extractImageFromPDF(buffer);
          console.log("Image extraction attempted");
        } catch (imgError) {
          console.warn("Could not extract image from PDF:", imgError);
        }
      }
      
      // Detect CV language from raw Claude data
      const detectedLanguage = detectLanguageFromClaudeData(rawData as any);
      console.log("🌍 Detected CV language:", detectedLanguage);
      
      extractedData = transformClaudeResponseToTCVContent(
        rawData,
        extractedImage,
        detectedLanguage
      );
      console.log("Data transformation successful");
      
      // Apply Swiss professional tone to all content
      extractedData = applySwissToneToCV(extractedData);
      console.log("Swiss tone conversion applied");
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
                  "jobTitle": "string (current job title if available)",
                  "email": "string",
                  "phone": "string",
                  "location": "string",
                  "website": "string (portfolio or website URL if available)"
                },
                "summary": "string",
                "experience": [
                  {
                    "company": "string",
                    "position": "string",
                    "startDate": "string",
                    "endDate": "string",
                    "description": "string (detailed description of responsibilities and accomplishments)"
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
                ],
                "expertise": ["string - specialized areas of knowledge, technical domains, methodologies, or areas of specialization. IMPORTANT: Extract from job descriptions, titles, accomplishments, and certifications. Look for evidence of mastery, specialization, or deep knowledge in specific domains (e.g., Financial Analysis, System Architecture, Project Leadership, etc.)"],
                "interests": ["string - personal or professional interests, hobbies"]
              }
              
              EXPERTISE EXTRACTION GUIDELINES:
              - If a CV has 'Financial Analyst' role with 5+ years and descriptions mention budgeting, forecasting, compliance - include 'Financial Analysis' as expertise
              - If job descriptions mention 'managed team of 10+', 'led project', 'supervised department' - include 'Team Leadership' or 'Project Management'
              - If technical roles mention building systems, architecting solutions, designing infrastructure - include relevant technical expertise
              - Extract expertise from job titles, descriptions, achievements, and certifications - DO NOT leave this empty if the CV shows clear specialization
              - Combine related certifications with job experience to identify expertise areas
              
              If interests are not listed, you may extract them from the CV if mentioned, otherwise return empty array.
              
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

// Extract first image from PDF buffer
async function extractImageFromPDF(buffer: ArrayBuffer): Promise<string | undefined> {
  try {
    // Look for common image signatures in PDF
    // JPEG: FFD8FF, PNG: 89504E47, GIF: 474946
    const uint8Array = new Uint8Array(buffer);
    
    // Search for JPEG signature (FFD8FF)
    for (let i = 0; i < uint8Array.length - 10; i++) {
      if (uint8Array[i] === 0xFF && uint8Array[i + 1] === 0xD8 && uint8Array[i + 2] === 0xFF) {
        // Found JPEG start, now find end (FFD9)
        for (let j = i + 3; j < uint8Array.length - 1; j++) {
          if (uint8Array[j] === 0xFF && uint8Array[j + 1] === 0xD9) {
            // Found JPEG end
            const jpegData = uint8Array.slice(i, j + 2);
            const base64 = 'data:image/jpeg;base64,' + Buffer.from(jpegData).toString('base64');
            console.log('Extracted JPEG image from PDF');
            return base64;
          }
        }
      }
    }
    
    // Search for PNG signature (89504E47)
    for (let i = 0; i < uint8Array.length - 8; i++) {
      if (uint8Array[i] === 0x89 && uint8Array[i + 1] === 0x50 && 
          uint8Array[i + 2] === 0x4E && uint8Array[i + 3] === 0x47) {
        // Found PNG start, look for IEND chunk (49454E44)
        for (let j = i + 8; j < uint8Array.length - 4; j++) {
          if (uint8Array[j] === 0x49 && uint8Array[j + 1] === 0x45 && 
              uint8Array[j + 2] === 0x4E && uint8Array[j + 3] === 0x44) {
            // Found PNG end, including IEND
            const pngData = uint8Array.slice(i, j + 8);
            const base64 = 'data:image/png;base64,' + Buffer.from(pngData).toString('base64');
            console.log('Extracted PNG image from PDF');
            return base64;
          }
        }
      }
    }
    
    console.log('No recognizable images found in PDF');
    return undefined;
  } catch (error) {
    console.error('Error extracting image from PDF:', error);
    return undefined;
  }
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
function transformClaudeResponseToTCVContent(
  rawData: unknown,
  extractedImage?: string,
  language: TLanguageCode = "en"
): unknown {
  const data = rawData as Record<string, unknown>;

  const personalInfo = data.personalInfo as Record<string, unknown>;
  const experience = (data.experience as Array<Record<string, unknown>>) || [];
  const education = (data.education as Array<Record<string, unknown>>) || [];
  const languagesArray = (data.languages as string[]) || [];
  const skillsArray = (data.skills as string[]) || [];
  const certificationsArray = (data.certifications as Array<Record<string, unknown>>) || [];
  const expertiseArray = (data.expertise as string[]) || [];
  const interestsArray = (data.interests as string[]) || [];

  // Transform experiences
  const transformedExperiences = experience.map((exp: Record<string, unknown>) => ({
    companyName: exp.company || "",
    position: exp.position || "",
    startDate: exp.startDate || "",
    endDate: exp.endDate || "",
    isCurrent:
      !exp.endDate || (exp.endDate as string)?.trim() === "" || false,
    description: ((exp.description as string) || "")
      .split("\n")
      .filter((line: string) => line.trim().length > 0),
  }));

  // Extract certifications as expertise
  const certificationExpertise = certificationsArray
    .map((cert: Record<string, unknown>) => cert.name as string)
    .filter((name) => name && name.length > 0);

  // Extract expertise from job descriptions in detected language
  // Use raw experience data to ensure description field matches what patterns expect
  const experiencesForExpertiseExtraction = experience.map((exp: Record<string, unknown>) => ({
    position: (exp.position as string) || "",
    description: ((exp.description as string) || "").split("\n").filter((line: string) => line.trim().length > 0),
    company: (exp.company as string) || "",
  }));

  const inferredExpertise = extractExpertiseFromExperiences(
    experiencesForExpertiseExtraction,
    language
  );
  console.log("🎯 Calling extractExpertiseFromExperiences with language:", language);
  console.log("🎯 Inferred expertise:", inferredExpertise);
  const specializedKeywords = extractSpecializedKeywords(experience);

  // Merge all expertise sources with intelligent deduplication
  const finalExpertise = mergeExpertise(
    expertiseArray,
    certificationExpertise,
    inferredExpertise,
    specializedKeywords
  );

  console.log("🌍 CV Language:", language);
  console.log("📊 Expertise extracted in", language, ":", finalExpertise);

  return {
    personalInfo: {
      fullName: personalInfo?.name || "",
      role: personalInfo?.jobTitle || "",
      email: personalInfo?.email || "",
      phoneNumber: personalInfo?.phone || "",
      address: personalInfo?.location || "",
      website: personalInfo?.website || "",
      summary: data.summary || "",
      photoUrl: extractedImage || undefined,
    },
    experiences: transformedExperiences,
    education: education.map((edu: Record<string, unknown>) => ({
      institutionName: edu.school || "",
      degree: edu.degree || "",
      majorSubject: edu.field || "",
      startDate: edu.graduationDate || "",
      endDate: undefined,
      isCurrent: false,
    })),
    skills: skillsArray,
    expertise: finalExpertise,
    languages: languagesArray.map((lang: string) => ({
      name: lang,
      proficiency: "Fluent", // Default proficiency if not specified
    })),
    interests: interestsArray,
  };
}

/**
 * Detect language from Claude's raw extraction data format
 * Works with the structure Claude returns, not the transformed TCVContent
 */
function detectLanguageFromClaudeData(rawData: Record<string, unknown>): TLanguageCode {
  const personalInfo = rawData.personalInfo as Record<string, unknown> || {};
  const experience = (rawData.experience as Array<Record<string, unknown>>) || [];
  
  // Collect all text content
  const textContent = [
    personalInfo?.name || "",
    personalInfo?.jobTitle || "",
    rawData.summary || "",
    experience
      .map((exp) => [exp.position || "", exp.description || ""].join(" "))
      .join(" "),
  ].join(" ");

  const detectedLanguage = detectLanguageFromText(textContent);
  console.log("📝 Text for language detection (first 200 chars):", textContent.substring(0, 200));
  console.log("🌍 Detected language:", detectedLanguage);
  return detectedLanguage;
}

/**
 * Detect language from raw text using keyword matching
 * Returns language code or defaults to "en"
 */
function detectLanguageFromText(text: string): TLanguageCode {
  if (!text || text.trim().length === 0) {
    console.log("⚠️ No text to analyze for language detection, defaulting to English");
    return "en";
  }

  const lowercaseText = text.toLowerCase();
  console.log("🔍 Analyzing text length:", lowercaseText.length, "characters");

  // French indicators - common French words and domain-specific terms
  const frenchPatterns = /\b(le|la|de|des|et|est|pour|plus|ans|expérience|expertise|compétences|langues|gestion|équipe|projet|responsable|directeur|analyste|ingénieur|développeur|consultant|manager|coordinateur|spécialiste|professionnel)\b/gi;
  const frenchMatches = (lowercaseText.match(frenchPatterns) || []).length;

  // German indicators
  const germanPatterns = /\b(der|die|das|ein|und|zu|mit|für|jahren|erfahrung|fähigkeiten|management|team|projekt|leiter|manager|direktor|ingenieur|entwickler|berater|spezialist|fachmann)\b/gi;
  const germanMatches = (lowercaseText.match(germanPatterns) || []).length;

  // Italian indicators
  const italianPatterns = /\b(il|la|di|da|e|per|anni|esperienza|competenze|lingue|gestione|team|progetto|direttore|responsabile|ingegnere|analista|consulente|specialista|manager|coordinatore)\b/gi;
  const italianMatches = (lowercaseText.match(italianPatterns) || []).length;

  // Spanish indicators
  const spanishPatterns = /\b(el|la|de|y|para|años|experiencia|competencias|idiomas|gestión|equipo|proyecto|director|responsable|ingeniero|analista|consultor|especialista|gerente|coordinador)\b/gi;
  const spanishMatches = (lowercaseText.match(spanishPatterns) || []).length;

  // Portuguese indicators
  const portuguesePatterns = /\b(o|a|de|e|para|anos|experiência|competências|idiomas|gestão|equipe|projeto|diretor|responsável|engenheiro|analista|consultor|especialista|gerente|coordenador)\b/gi;
  const portugueseMatches = (lowercaseText.match(portuguesePatterns) || []).length;

  const scores: Record<TLanguageCode, number> = {
    en: 0,
    fr: frenchMatches,
    de: germanMatches,
    it: italianMatches,
    es: spanishMatches,
    pt: portugueseMatches,
  };

  console.log("📊 Language scores:", scores);

  // Find language with highest score
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const detected = sorted[0][0] as TLanguageCode;
  const score = sorted[0][1];

  console.log("🏆 Highest score:", detected, "with", score, "matches");

  // Default to English only if no matches or very low score
  return score > 0 ? detected : "en";
}
