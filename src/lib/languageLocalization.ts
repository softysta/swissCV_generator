/**
 * Language Localization for CV Proficiency Levels
 * Provides language-specific proficiency labels matching CV language
 */

export type TProficiencyLevel = "Native" | "Fluent" | "Intermediate" | "Basic";
export type TLanguageCode = "en" | "fr" | "de" | "it" | "es" | "pt";

interface ProficiencyTranslations {
  [key: string]: {
    Native: string;
    Fluent: string;
    Intermediate: string;
    Basic: string;
  };
}

const PROFICIENCY_TRANSLATIONS: ProficiencyTranslations = {
  en: {
    Native: "Native",
    Fluent: "Fluent",
    Intermediate: "Intermediate",
    Basic: "Basic",
  },
  fr: {
    Native: "Langue maternelle",
    Fluent: "Niveau professionnel",
    Intermediate: "Intermédiaire",
    Basic: "Niveau débutant",
  },
  de: {
    Native: "Muttersprache",
    Fluent: "Fließend",
    Intermediate: "Mittelstufe",
    Basic: "Grundlagen",
  },
  it: {
    Native: "Madrelingua",
    Fluent: "Fluente",
    Intermediate: "Intermedio",
    Basic: "Base",
  },
  es: {
    Native: "Nativo",
    Fluent: "Fluido",
    Intermediate: "Intermedio",
    Basic: "Básico",
  },
  pt: {
    Native: "Nativo",
    Fluent: "Fluente",
    Intermediate: "Intermediário",
    Basic: "Básico",
  },
};

/**
 * Detect language from CV content (checks summary, experiences, education)
 * Returns the detected language code
 */
export function detectCVLanguage(content: {
  personalInfo?: { summary?: string; fullName?: string; role?: string };
  experiences?: Array<{ position?: string; description?: string[] }>;
  education?: Array<{ degree?: string }>;
}): TLanguageCode {
  const textToAnalyze = [
    content.personalInfo?.summary || "",
    content.personalInfo?.role || "",
    content.experiences?.[0]?.position || "",
    content.experiences?.[0]?.description?.join(" ") || "",
    content.education?.[0]?.degree || "",
  ].join(" ");

  return detectLanguageFromText(textToAnalyze);
}

/**
 * Detect language from raw text using keyword matching
 */
export function detectLanguageFromText(text: string): TLanguageCode {
  const lowercaseText = text.toLowerCase();

  // French indicators
  const frenchPatterns = /\b(le|la|de|des|et|est|pour|plus|ans|expérience|expertise|compétences|langues)\b/gi;
  const frenchMatches = (lowercaseText.match(frenchPatterns) || []).length;

  // German indicators
  const germanPatterns = /\b(der|die|das|ein|und|zu|mit|für|jahren|erfahrung|fähigkeiten)\b/gi;
  const germanMatches = (lowercaseText.match(germanPatterns) || []).length;

  // Italian indicators
  const italianPatterns = /\b(il|la|di|da|e|per|anni|esperienza|competenze|lingue)\b/gi;
  const italianMatches = (lowercaseText.match(italianPatterns) || []).length;

  // Spanish indicators
  const spanishPatterns = /\b(el|la|de|y|para|años|experiencia|competencias|idiomas)\b/gi;
  const spanishMatches = (lowercaseText.match(spanishPatterns) || []).length;

  // Portuguese indicators
  const portuguesePatterns = /\b(o|a|de|e|para|anos|experiência|competências|idiomas)\b/gi;
  const portugueseMatches = (lowercaseText.match(portuguesePatterns) || []).length;

  const scores: Record<TLanguageCode, number> = {
    en: 0,
    fr: frenchMatches,
    de: germanMatches,
    it: italianMatches,
    es: spanishMatches,
    pt: portugueseMatches,
  };

  // Find language with highest score
  const detected = (
    Object.entries(scores).sort(([, a], [, b]) => b - a)[0] || ["en", 0]
  )[0] as TLanguageCode;

  // Default to English if no strong match
  return detected && scores[detected] > 5 ? detected : "en";
}

/**
 * Get proficiency levels in specific language
 */
export function getProficiencyLevels(
  language: TLanguageCode
): TProficiencyLevel[] {
  return ["Native", "Fluent", "Intermediate", "Basic"] as TProficiencyLevel[];
}

/**
 * Get localized proficiency label
 */
export function getLocalizedProficiency(
  level: TProficiencyLevel,
  language: TLanguageCode
): string {
  return (
    PROFICIENCY_TRANSLATIONS[language]?.[level] ||
    PROFICIENCY_TRANSLATIONS.en[level]
  );
}

/**
 * Convert English proficiency to localized version
 * Used when data comes in English but needs to be displayed in another language
 */
export function convertProficiencyToLanguage(
  proficiency: string,
  targetLanguage: TLanguageCode
): string {
  // Try to find the English version first
  const englishLevel = Object.entries(
    PROFICIENCY_TRANSLATIONS.en
  ).find(([, value]) => value.toLowerCase() === proficiency.toLowerCase())?.[0];

  if (englishLevel) {
    return getLocalizedProficiency(
      englishLevel as TProficiencyLevel,
      targetLanguage
    );
  }

  // If not found in English translations, search across all languages
  for (const [lang, translations] of Object.entries(
    PROFICIENCY_TRANSLATIONS
  )) {
    const found = Object.entries(translations).find(
      ([, value]) => value.toLowerCase() === proficiency.toLowerCase()
    )?.[0];
    if (found) {
      return getLocalizedProficiency(found as TProficiencyLevel, targetLanguage);
    }
  }

  // Fallback: return as-is
  return proficiency;
}

/**
 * Get all proficiency levels in a specific language
 */
export function getAllProficienciesInLanguage(
  language: TLanguageCode
): string[] {
  const translations = PROFICIENCY_TRANSLATIONS[language];
  return translations
    ? Object.values(translations)
    : Object.values(PROFICIENCY_TRANSLATIONS.en);
}
