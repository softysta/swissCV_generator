// ─── Primitives ──────────────────────────────────────────────

export type TLanguage = {
  name: string;
  proficiency: string;
};

export type TExperience = {
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
};

export type TEducation = {
  institutionName: string;
  degree: string;
  majorSubject?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
};

// ─── CV Sections ─────────────────────────────────────────────

export type TPersonalInfo = {
  fullName: string;
  role: string;
  email: string;
  phoneNumber: string;
  address: string;
  website?: string;
  photoUrl?: string;
  summary?: string;
};

// ─── Root Type ───────────────────────────────────────────────

export type TCVContent = {
  personalInfo: TPersonalInfo;
  experiences: TExperience[];
  education: TEducation[];
  skills?: string[];
  expertise?: string[];
  languages: TLanguage[];
  interests: string[];
};

// ─── Template ────────────────────────────────────────────────

export type TTemplateId = "classic" | "modern";

export type TCVTemplateProps = {
  data: TCVContent;
};
