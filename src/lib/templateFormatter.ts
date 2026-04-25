/**
 * Template-specific content formatters
 * Ensures data fits properly in each template layout while maintaining Swiss tone
 */

import { TCVContent } from "@/types/cvContent.tye";
import { formatForTemplateDisplay } from "./swissToneConverter";

export interface TemplateFormattingConfig {
  enableCharacterLimits?: boolean;
  enableTrimming?: boolean;
}

const DEFAULT_CONFIG: TemplateFormattingConfig = {
  enableCharacterLimits: true,
  enableTrimming: true,
};

/**
 * Classic Template Formatter
 * Sidebar constraints: 300px width, limited vertical space
 */
export function formatDataForClassicTemplate(
  data: TCVContent,
  config: TemplateFormattingConfig = DEFAULT_CONFIG
): TCVContent {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      // Summary gets clipped in sidebar - keep it short
      summary: config.enableCharacterLimits
        ? formatForTemplateDisplay(data.personalInfo.summary || "", 200, "sentence")
        : data.personalInfo.summary,
    },
    skills: config.enableTrimming ? data.skills?.slice(0, 12) : data.skills,
    expertise: config.enableTrimming ? data.expertise?.slice(0, 8) : data.expertise,
    experiences: (data.experiences || []).map((exp) => ({
      ...exp,
      // Classic template shows 3-4 bullet points max per experience
      description: config.enableTrimming
        ? exp.description.slice(0, 3)
        : exp.description,
    })),
    languages: config.enableTrimming ? data.languages.slice(0, 8) : data.languages,
    interests: config.enableTrimming ? data.interests?.slice(0, 6) : data.interests,
  };
}

/**
 * Modern Template Formatter
 * Sidebar constraints: 280px width with rigid sections
 * Main content: Single column layout
 */
export function formatDataForModernTemplate(
  data: TCVContent,
  config: TemplateFormattingConfig = DEFAULT_CONFIG
): TCVContent {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      // Modern template has small sidebar - keep summary minimal
      summary: config.enableCharacterLimits
        ? formatForTemplateDisplay(data.personalInfo.summary || "", 150, "sentence")
        : data.personalInfo.summary,
    },
    skills: config.enableTrimming ? data.skills?.slice(0, 10) : data.skills,
    expertise: config.enableTrimming ? data.expertise?.slice(0, 6) : data.expertise,
    experiences: (data.experiences || []).map((exp) => ({
      ...exp,
      // Modern template - compact experience section
      description: config.enableTrimming
        ? exp.description.slice(0, 2)
        : exp.description,
    })),
    languages: config.enableTrimming ? data.languages.slice(0, 6) : data.languages,
    interests: config.enableTrimming ? data.interests?.slice(0, 5) : data.interests,
  };
}

/**
 * Get formatted data for specific template
 */
export function formatDataForTemplate(
  data: TCVContent,
  templateId: "classic" | "modern",
  config: TemplateFormattingConfig = DEFAULT_CONFIG
): TCVContent {
  if (templateId === "classic") {
    return formatDataForClassicTemplate(data, config);
  } else if (templateId === "modern") {
    return formatDataForModernTemplate(data, config);
  }
  return data;
}

/**
 * Calculate content fit score for a template
 * Returns 0-100 score indicating how well data fits
 */
export function calculateTemplateFitScore(
  data: TCVContent,
  templateId: "classic" | "modern"
): number {
  let score = 100;

  // Check if content is too verbose
  const summaryLength = data.personalInfo.summary?.length || 0;
  if (summaryLength > 300) {
    score -= Math.min(20, Math.floor((summaryLength - 300) / 50));
  }

  // Check if too many skills
  const skillsCount = data.skills?.length || 0;
  if (skillsCount > 20) {
    score -= Math.min(15, Math.floor((skillsCount - 20) / 5));
  }

  // Check if too many expertise items
  const expertiseCount = data.expertise?.length || 0;
  if (expertiseCount > 15) {
    score -= Math.min(10, Math.floor((expertiseCount - 15) / 5));
  }

  // Check if too many experiences
  const experiencesCount = data.experiences?.length || 0;
  if (experiencesCount > 5) {
    score -= Math.min(10, Math.floor((experiencesCount - 5) / 2));
  }

  // Check average description length
  const avgDescLength =
    data.experiences.reduce((sum, exp) => {
      return sum + (exp.description || []).join(" ").length;
    }, 0) / Math.max(data.experiences.length, 1);

  if (avgDescLength > 500) {
    score -= Math.min(15, Math.floor((avgDescLength - 500) / 100));
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Get optimization recommendations for template
 */
export function getTemplateOptimizationTips(
  data: TCVContent,
  templateId: "classic" | "modern"
): string[] {
  const tips: string[] = [];

  const summaryLength = data.personalInfo.summary?.length || 0;
  if (summaryLength > 250) {
    tips.push(
      "Summary is too long. Reduce to ~200 characters for better layout fit."
    );
  }

  const skillsCount = data.skills?.length || 0;
  if (skillsCount > 15) {
    tips.push("Too many skills listed. Consider keeping top 12-15 most relevant.");
  }

  const expertiseCount = data.expertise?.length || 0;
  if (expertiseCount > 10) {
    tips.push("Too many expertise areas. Limit to 8-10 most relevant specializations.");
  }

  const experiencesCount = data.experiences?.length || 0;
  if (experiencesCount > 6) {
    tips.push("Too many experiences. Limit to 5-6 most recent/relevant entries.");
  }

  data.experiences.forEach((exp, idx) => {
    const descLength = (exp.description || []).join(" ").length;
    if (descLength > 400) {
      tips.push(
        `Experience #${idx + 1} (${exp.position}): Description too long. Reduce to 2-3 key bullet points.`
      );
    }
  });

  const languagesCount = data.languages?.length || 0;
  if (languagesCount > 8) {
    tips.push("Too many languages. Limit to 6-8 most relevant.");
  }

  return tips;
}
