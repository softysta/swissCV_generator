/**
 * Expertise extraction helpers
 * Analyzes CV content to identify expertise areas from work descriptions
 * Supports multilingual expertise labels to preserve original CV language
 */

import { TLanguageCode } from "@/lib/languageLocalization";

interface ExperienceData {
  position?: string;
  description?: string | string[];
  company?: string;
}

// Keywords that indicate expertise/mastery in a domain
const EXPERTISE_PATTERNS = {
  management: /\b(led|managed|directed|oversaw|supervised|headed|managed team|team lead|leadership|managed group)\b/gi,
  architecture: /\b(architected|designed system|system design|architecture|architectural|solution architect)\b/gi,
  financial: /\b(financial|accounting|audit|compliance|tax|budget|fiscal|investment|portfolio|revenue|p&l|profit)\b/gi,
  marketing: /\b(marketing|campaign|brand|branding|market|promotion|advertising|seo|content marketing|digital marketing)\b/gi,
  technical: /\b(developed|built|engineered|implemented|programmed|coding|technical|infrastructure|backend|frontend|full-stack)\b/gi,
  sales: /\b(sales|selling|revenue|quota|pipeline|negotiation|client|account|territory|closing)\b/gi,
  analysis: /\b(analysis|analyzed|analytical|data analysis|business intelligence|analytics|metrics|reporting|forecasting)\b/gi,
  operations: /\b(operations|operational|process|efficiency|workflow|logistics|supply chain|distribution)\b/gi,
  consulting: /\b(consulting|consultant|advisory|strategic|strategy|improvement|optimization)\b/gi,
  documentation: /\b(documentation|documented|technical writing|documentation system|knowledge base)\b/gi,
  training: /\b(training|trainer|mentored|mentoring|coaching|taught|education|onboarding)\b/gi,
  compliance: /\b(compliance|regulations|regulatory|requirements|standards|governance|policy)\b/gi,
  security: /\b(security|cybersecurity|secure|encryption|authentication|privacy|data protection)\b/gi,
  database: /\b(database|sql|nosql|oracle|mysql|postgresql|mongodb|data storage|query|optimization)\b/gi,
};

// Multilingual expertise labels - preserve original CV language
const EXPERTISE_LABELS_BY_LANGUAGE: Record<TLanguageCode, Record<string, string>> = {
  en: {
    management: "Team & Project Management",
    architecture: "System Architecture & Design",
    financial: "Financial Management & Accounting",
    marketing: "Marketing & Brand Strategy",
    technical: "Software Development & Engineering",
    sales: "Sales & Business Development",
    analysis: "Data Analysis & Business Intelligence",
    operations: "Operations Management",
    consulting: "Strategic Consulting",
    documentation: "Technical Documentation",
    training: "Training & Mentorship",
    compliance: "Compliance & Governance",
    security: "Cybersecurity & Data Protection",
    database: "Database Management & Optimization",
  },
  fr: {
    management: "Gestion d'équipe et de projet",
    architecture: "Architecture et conception de systèmes",
    financial: "Gestion financière et comptabilité",
    marketing: "Stratégie marketing et marque",
    technical: "Développement et ingénierie logicielle",
    sales: "Ventes et développement commercial",
    analysis: "Analyse de données et intelligence d'affaires",
    operations: "Gestion opérationnelle",
    consulting: "Conseil stratégique",
    documentation: "Documentation technique",
    training: "Formation et mentorat",
    compliance: "Conformité et gouvernance",
    security: "Cybersécurité et protection des données",
    database: "Gestion et optimisation des bases de données",
  },
  de: {
    management: "Team- und Projektmanagement",
    architecture: "Systemarchitektur und Design",
    financial: "Finanzmanagement und Buchhaltung",
    marketing: "Marketing und Markenstrategie",
    technical: "Softwareentwicklung und Engineering",
    sales: "Vertrieb und Geschäftsentwicklung",
    analysis: "Datenanalyse und Business Intelligence",
    operations: "Betriebsmanagement",
    consulting: "Strategische Beratung",
    documentation: "Technische Dokumentation",
    training: "Schulung und Mentoring",
    compliance: "Compliance und Governance",
    security: "Cybersicherheit und Datenschutz",
    database: "Datenbankmanagement und Optimierung",
  },
  it: {
    management: "Gestione del team e dei progetti",
    architecture: "Architettura e design di sistemi",
    financial: "Gestione finanziaria e contabilità",
    marketing: "Strategia di marketing e branding",
    technical: "Sviluppo software e ingegneria",
    sales: "Vendite e sviluppo commerciale",
    analysis: "Analisi dei dati e business intelligence",
    operations: "Gestione operativa",
    consulting: "Consulenza strategica",
    documentation: "Documentazione tecnica",
    training: "Formazione e mentoring",
    compliance: "Compliance e governance",
    security: "Cybersecurity e protezione dei dati",
    database: "Gestione e ottimizzazione dei database",
  },
  es: {
    management: "Gestión de equipos y proyectos",
    architecture: "Arquitectura y diseño de sistemas",
    financial: "Gestión financiera y contabilidad",
    marketing: "Estrategia de marketing y marca",
    technical: "Desarrollo de software e ingeniería",
    sales: "Ventas y desarrollo comercial",
    analysis: "Análisis de datos e inteligencia empresarial",
    operations: "Gestión operativa",
    consulting: "Consultoría estratégica",
    documentation: "Documentación técnica",
    training: "Capacitación y mentoría",
    compliance: "Cumplimiento y gobernanza",
    security: "Ciberseguridad y protección de datos",
    database: "Gestión y optimización de bases de datos",
  },
  pt: {
    management: "Gestão de equipes e projetos",
    architecture: "Arquitetura e design de sistemas",
    financial: "Gestão financeira e contabilidade",
    marketing: "Estratégia de marketing e marca",
    technical: "Desenvolvimento de software e engenharia",
    sales: "Vendas e desenvolvimento comercial",
    analysis: "Análise de dados e inteligência de negócios",
    operations: "Gestão operacional",
    consulting: "Consultoria estratégica",
    documentation: "Documentação técnica",
    training: "Treinamento e mentoría",
    compliance: "Conformidade e governança",
    security: "Cibersegurança e proteção de dados",
    database: "Gestão e otimização de banco de dados",
  },
};

/**
 * Get expertise labels for a specific language
 */
function getExpertiseLabels(language: TLanguageCode): Record<string, string> {
  return EXPERTISE_LABELS_BY_LANGUAGE[language] || EXPERTISE_LABELS_BY_LANGUAGE.en;
}

/**
 * Extract expertise areas from experience descriptions in specified language
 * Returns array of identified expertise domains translated to target language
 */
export function extractExpertiseFromExperiences(
  experiences: ExperienceData[],
  language: TLanguageCode = "en"
): string[] {
  const foundExpertise = new Set<string>();
  const labels = getExpertiseLabels(language);

  for (const exp of experiences) {
    const textToAnalyze = [
      exp.position || "",
      typeof exp.description === "string"
        ? exp.description
        : (exp.description || []).join(" "),
    ].join(" ");

    if (!textToAnalyze.trim()) continue;

    // Check each expertise pattern
    for (const [domain, pattern] of Object.entries(EXPERTISE_PATTERNS)) {
      const matches = textToAnalyze.match(pattern);
      if (matches && matches.length > 0) {
        foundExpertise.add(labels[domain]);
      }
    }
  }

  return Array.from(foundExpertise);
}

/**
 * Extract individual specialized skills/keywords from descriptions
 * For more granular expertise areas (e.g., specific technologies, methodologies)
 */
export function extractSpecializedKeywords(
  experiences: ExperienceData[]
): string[] {
  const keywords = new Set<string>();

  // Technical keywords
  const techKeywords = /\b(react|nodejs|python|java|typescript|javascript|aws|gcp|azure|docker|kubernetes|agile|scrum|git|rest api|microservices|ci\/cd|machine learning|ai|sql|nosql)\b/gi;

  // Industry-specific keywords
  const industryKeywords = /\b(fintech|blockchain|e-commerce|saas|b2b|b2c|mobile-first|responsive|accessibility|performance optimization|scalability)\b/gi;

  for (const exp of experiences) {
    const textToAnalyze = [
      exp.position || "",
      typeof exp.description === "string"
        ? exp.description
        : (exp.description || []).join(" "),
    ].join(" ");

    // Extract tech keywords
    const techMatches = textToAnalyze.match(techKeywords);
    if (techMatches) {
      techMatches.forEach((match) => {
        const normalized = match.toLowerCase().trim();
        if (normalized.length > 0) keywords.add(normalized);
      });
    }

    // Extract industry keywords
    const industryMatches = textToAnalyze.match(industryKeywords);
    if (industryMatches) {
      industryMatches.forEach((match) => {
        const normalized = match.toLowerCase().trim();
        if (normalized.length > 0) keywords.add(normalized);
      });
    }
  }

  return Array.from(keywords);
}

/**
 * Merge expertise from multiple sources with deduplication
 */
export function mergeExpertise(
  extractedExpertise: string[] = [],
  certifications: string[] = [],
  inferredExpertise: string[] = [],
  specializedKeywords: string[] = []
): string[] {
  const merged = new Set<string>([
    ...extractedExpertise,
    ...certifications,
    ...inferredExpertise,
    ...specializedKeywords,
  ]);

  // Remove empty strings and duplicates (case-insensitive)
  const normalized = Array.from(merged)
    .filter((item) => item && item.trim().length > 0)
    .map((item) => item.trim());

  // Deduplicate with case-insensitive matching
  const unique = new Map<string, string>();
  for (const item of normalized) {
    const key = item.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  return Array.from(unique.values());
}
