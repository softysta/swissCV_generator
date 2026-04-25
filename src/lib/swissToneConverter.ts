/**
 * Swiss Tone Converter
 * Converts extracted CV content to Swiss professional standards:
 * - Concise, direct language
 * - Results-oriented descriptions
 * - Professional but not flowery
 * - Emphasis on competence and reliability
 */

export interface SwissToneConfig {
  maxSummaryLength?: number;
  maxDescriptionPoints?: number;
  condenseFutureContent?: boolean;
}

const DEFAULT_CONFIG: SwissToneConfig = {
  maxSummaryLength: 150,
  maxDescriptionPoints: 3,
  condenseFutureContent: true,
};

/**
 * Convert summary/professional statement to Swiss tone
 */
export function convertSummaryToSwissTone(
  summary: string,
  config: SwissToneConfig = DEFAULT_CONFIG
): string {
  if (!summary || summary.trim().length === 0) {
    return "";
  }

  // Remove redundant phrases and fluff
  let converted = summary
    .replace(/passionate about/gi, "specialized in")
    .replace(/looking to/gi, "aiming to")
    .replace(/i am|i'm/gi, "")
    .replace(/seeking a|seeking an/gi, "")
    .replace(/my goal is to/gi, "")
    .replace(/my passion is/gi, "")
    .replace(/extremely|very|really|quite/gi, "")
    .replace(/\\s{2,}/g, " ") // Remove multiple spaces
    .trim();

  // Ensure professional structure
  if (converted && !converted.match(/[.!?]$/)) {
    converted += ".";
  }

  // Truncate if needed
  const maxLength = config.maxSummaryLength || 150;
  if (converted.length > maxLength) {
    converted = converted.substring(0, maxLength).trim();
    if (!converted.endsWith(".")) {
      converted += ".";
    }
  }

  return converted;
}

/**
 * Convert experience descriptions to Swiss tone (bullet points)
 */
export function convertExperienceDescriptionToSwissTone(
  descriptions: string[],
  config: SwissToneConfig = DEFAULT_CONFIG
): string[] {
  if (!descriptions || descriptions.length === 0) {
    return [];
  }

  const maxPoints = config.maxDescriptionPoints || 3;
  const converted: string[] = [];

  for (const desc of descriptions.slice(0, maxPoints)) {
    if (!desc || desc.trim().length === 0) continue;

    let point = desc.trim();

    // Remove redundant phrases
    point = point
      .replace(/responsible for/gi, "managed")
      .replace(/was responsible for/gi, "managed")
      .replace(/worked on/gi, "developed")
      .replace(/helped with/gi, "supported")
      .replace(/contributed to/gi, "contributed to")
      .replace(/i |i'/gi, "")
      .replace(/\\s{2,}/g, " ")
      .trim();

    // Capitalize first letter and ensure period
    point = point.charAt(0).toUpperCase() + point.slice(1);
    if (!point.match(/[.!?]$/)) {
      point += ".";
    }

    if (point.length > 0) {
      converted.push(point);
    }
  }

  return converted;
}

/**
 * Convert job title/role to Swiss professional standards
 */
export function convertRoleToSwissTone(role: string): string {
  if (!role) return "";

  // Standardize common role patterns
  const roleMap: Record<string, string> = {
    "senior engineer": "Senior Engineer",
    "junior engineer": "Engineer",
    "lead engineer": "Lead Engineer",
    manager: "Manager",
    director: "Director",
    coordinator: "Coordinator",
    specialist: "Specialist",
    analyst: "Analyst",
    developer: "Developer",
    architect: "Architect",
    consultant: "Consultant",
  };

  const normalized = role.toLowerCase().trim();

  for (const [key, value] of Object.entries(roleMap)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  // Default: proper case
  return role
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Convert skills to Swiss professional standards
 * - Remove duplicates
 * - Normalize naming
 * - Limit to most relevant
 */
export function convertSkillsToSwissTone(
  skills: string[],
  maxSkills: number = 15
): string[] {
  if (!skills || skills.length === 0) {
    return [];
  }

  // Normalize and deduplicate
  const normalized = new Set(
    skills.map((skill) =>
      skill
        .trim()
        .replace(/\\s+/g, " ")
        .split(",")[0] // Take first if comma-separated
    )
  );

  // Sort by relevance (technical first, then others)
  const technicalKeywords = [
    "python",
    "javascript",
    "java",
    "typescript",
    "react",
    "vue",
    "angular",
    "node",
    "sql",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "agile",
    "scrum",
  ];

  const sorted = Array.from(normalized).sort((a, b) => {
    const aIsTech = technicalKeywords.some((kw) =>
      a.toLowerCase().includes(kw)
    );
    const bIsTech = technicalKeywords.some((kw) =>
      b.toLowerCase().includes(kw)
    );
    return aIsTech === bIsTech ? 0 : aIsTech ? -1 : 1;
  });

  return sorted.slice(0, maxSkills);
}

/**
 * Convert expertise to Swiss professional standards
 * - Ensures consistency with skills
 * - Removes duplicates across skills and expertise
 * - Limit to most relevant specialized areas
 */
export function convertExpertiseToSwissTone(
  expertise: string[],
  maxExpertise: number = 10
): string[] {
  if (!expertise || expertise.length === 0) {
    return [];
  }

  // Normalize and deduplicate
  const normalized = new Set(
    expertise.map((exp) =>
      exp
        .trim()
        .replace(/\s+/g, " ")
        .split(",")[0]
    )
  );

  return Array.from(normalized)
    .map((exp) => {
      // Capitalize properly
      return exp
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    })
    .slice(0, maxExpertise);
}

/**
 * Convert interests/hobbies to Swiss professional standards
 */
export function convertInterestsToSwissTone(
  interests: string[],
  maxInterests: number = 5
): string[] {
  if (!interests || interests.length === 0) {
    return [];
  }

  const professional = interests
    .map((interest) => {
      const normalized = interest
        .trim()
        .replace(/\\s+/g, " ")
        .split(",")[0];

      // Map casual interests to professional terms
      const interestMap: Record<string, string> = {
        coding: "Software Development",
        programming: "Programming",
        sports: "Sports",
        travel: "International Travel",
        reading: "Technical Reading",
        music: "Music",
        art: "Art",
        photography: "Photography",
        volunteering: "Volunteering",
        mentoring: "Mentoring",
        teaching: "Education",
        "open source": "Open Source",
      };

      for (const [key, value] of Object.entries(interestMap)) {
        if (normalized.toLowerCase().includes(key)) {
          return value;
        }
      }

      return normalized;
    })
    .filter((interest) => interest.length > 0);

  return professional.slice(0, maxInterests);
}

/**
 * Format text for template display with character limit
 * Used to ensure content fits template layout
 */
export function formatForTemplateDisplay(
  text: string,
  maxChars: number,
  breakAt: "word" | "sentence" = "word"
): string {
  if (!text || text.length <= maxChars) {
    return text;
  }

  if (breakAt === "sentence") {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let result = "";

    for (const sentence of sentences) {
      if ((result + sentence).length > maxChars) {
        return result.trim();
      }
      result += sentence;
    }

    return result.trim();
  }

  // Break at word
  const words = text.substring(0, maxChars).split(" ");
  words.pop(); // Remove potentially incomplete word
  return words.join(" ");
}

/**
 * Main converter function - applies all Swiss tone conversions
 */
export function applySwissToneToCV(cvData: any, config: SwissToneConfig = DEFAULT_CONFIG): any {
  return {
    ...cvData,
    personalInfo: {
      ...cvData.personalInfo,
      role: convertRoleToSwissTone(cvData.personalInfo?.role || ""),
      summary: convertSummaryToSwissTone(
        cvData.personalInfo?.summary || "",
        config
      ),
    },
    experiences: (cvData.experiences || []).map((exp: any) => ({
      ...exp,
      position: convertRoleToSwissTone(exp.position || ""),
      description: convertExperienceDescriptionToSwissTone(
        exp.description || [],
        config
      ),
    })),
    skills: convertSkillsToSwissTone(cvData.skills || []),
    expertise: convertExpertiseToSwissTone(cvData.expertise || []),
    interests: convertInterestsToSwissTone(cvData.interests || []),
  };
}
