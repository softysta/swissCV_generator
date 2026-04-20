"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ExtractionStep {
  name: string;
  status: "done" | "processing" | "waiting";
}

interface CVData {
  profileImage?: string | null;
  personalInfo?: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills?: string[];
  languages?: Array<{
    name: string;
    proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

interface CVContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  cvData: CVData | null;
  setCVData: (data: CVData | null) => void;
  extractionSteps: ExtractionStep[];
  setExtractionSteps: (
    steps: ExtractionStep[] | ((prev: ExtractionStep[]) => ExtractionStep[]),
  ) => void;
  isExtracting: boolean;
  setIsExtracting: (extracting: boolean) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSteps, setExtractionSteps] = useState<ExtractionStep[]>([
    { name: "Reading CV content", status: "waiting" },
    { name: "Extracting personal information", status: "waiting" },
    { name: "Rewriting in Swiss professional format", status: "waiting" },
    { name: "Smart-trimming content", status: "waiting" },
  ]);

  return (
    <CVContext.Provider
      value={{
        file,
        setFile,
        cvData,
        setCVData,
        extractionSteps,
        setExtractionSteps,
        isExtracting,
        setIsExtracting,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCV must be used within CVProvider");
  }
  return context;
}
