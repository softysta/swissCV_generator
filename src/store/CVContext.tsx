"use client";

import { TCVContent, TTemplateId } from "@/types/cvContent.tye";
import { TLanguageCode } from "@/lib/languageLocalization";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// ─── Context Shape ────────────────────────────────────────────────────────────

type CVContextType = {
  cvData: TCVContent | null;
  selectedTemplate: TTemplateId;
  cvLanguage: TLanguageCode;
  setCVData: (data: TCVContent) => void;
  setSelectedTemplate: (id: TTemplateId) => void;
  setCVLanguage: (language: TLanguageCode) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const CVContext = createContext<CVContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CVProvider({ children }: { children: ReactNode }) {
  const [cvData, setCVData] = useState<TCVContent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TTemplateId>("classic");
  const [cvLanguage, setCVLanguage] = useState<TLanguageCode>("en");

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCVData,
        selectedTemplate,
        setSelectedTemplate,
        cvLanguage,
        setCVLanguage,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCVContext(): CVContextType {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error("useCVContext must be used inside <CVProvider>");
  return ctx;
}