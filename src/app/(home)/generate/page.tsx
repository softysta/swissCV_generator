"use client";

import { useRef, useState } from "react";
import { useCVContext } from "@/store/CVContext";
import ClassicTemplate from "@/components/cv/templates/ClassicTemplate";
import ModernTemplate from "@/components/cv/templates/ModernTemplate";
import TemplateCard from "@/components/cv/TemplateCard";
import DownloadPanel from "@/components/cv/DownloadPanel";
import { TCVContent, TTemplateId } from "@/types/cvContent.tye";
import { exportCVAsPDF } from "@/utils/exportPDF";

// ─── Template registry ────────────────────────────────────────────────────────

const TEMPLATES: {
  id: TTemplateId;
  label: string;
  badge: string;
  tag: string;
}[] = [
  {
    id: "classic",
    label: "Professional Male",
    badge: "Classic",
    tag: "Most Popular",
  },
  {
    id: "modern",
    label: "Professional Female",
    badge: "Modern",
    tag: "New Arrival",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const { cvData, selectedTemplate, setSelectedTemplate } = useCVContext();
  const [isExporting, setIsExporting] = useState(false);

  const classicRef = useRef<HTMLDivElement>(null);
  const modernRef = useRef<HTMLDivElement>(null);

  // Use real context data or fallback to demo data
  const data: TCVContent = cvData ?? DEMO_DATA;

  const handleExport = async () => {
    const ref = selectedTemplate === "classic" ? classicRef : modernRef;
    if (!ref.current) return;
    setIsExporting(true);
    try {
      await exportCVAsPDF(
        ref.current,
        `CV_${data.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f2f3f8",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          maxWidth: 880,
          margin: "auto",
          padding: "40px 20px",
        }}
      >
        {/* Template Selector Panel */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "38px 40px" }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111",
                marginBottom: 5,
              }}
            >
              Choose a CV template
            </h2>
            <p style={{ color: "#777", fontSize: 13.5, marginBottom: 32 }}>
              Select the architectural layout that best represents your
              professional brand.
            </p>

            {/* Template Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {TEMPLATES.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  id={tpl.id}
                  label={tpl.label}
                  badge={tpl.badge}
                  tag={tpl.tag}
                  selected={selectedTemplate === tpl.id}
                  onSelect={() => setSelectedTemplate(tpl.id)}
                >
                  {tpl.id === "classic" ? (
                    <ClassicTemplate data={data} />
                  ) : (
                    <ModernTemplate data={data} />
                  )}
                </TemplateCard>
              ))}
            </div>
          </div>
        </div>

        {/* Download Panel */}
        <DownloadPanel onExport={handleExport} isExporting={isExporting} />
      </div>

      {/* Footer */}
      <p
        style={{
          textAlign: "center",
          paddingBottom: 40,
          fontSize: 12,
          color: "#ccc",
        }}
      >
        © 2024 SwissCV Generator. Designed for Precision.
      </p>

      {/* ── Hidden full-size refs for html2canvas export ─────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: -9999,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <div
          ref={classicRef}
          style={{ width: 794, height: 1123, overflow: "hidden" }}
        >
          <ClassicTemplate data={data} />
        </div>
        <div
          ref={modernRef}
          style={{ width: 794, height: 1123, overflow: "hidden" }}
        >
          <ModernTemplate data={data} />
        </div>
      </div>
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        background: "#1a2456",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" fill="white" opacity="0.9" />
        <circle cx="8" cy="8" r="2.5" fill="#1a2456" />
      </svg>
    </div>
  );
}

// ── Demo data — replace with real data from your step 3 form ─────────────────

const DEMO_DATA: TCVContent = {
  personalInfo: {
    fullName: "Camilla Martine",
    role: "Experte Comptable",
    email: "hello@reallygreatsite.com",
    phoneNumber: "+123-456-7890",
    address: "Any City",
    website: "www.reallygreatsite.com",
    photoUrl: "/christopher-campbell-rDEOVtE7vOs-unsplash.jpg",
    summary:
      "Comptable avec plus de 15 ans d'expérience, spécialisée dans l'analyse des finances, la gestion des impôts et la planification budgétaire. J'aide les entreprises à mieux gérer leur argent et à améliorer leur rentabilité tout en limitant les risques.",
  },
  experiences: [
    {
      position: "Responsable Comptabilité",
      companyName: "Messagem, Any City",
      startDate: "2018",
      endDate: "2024",
      isCurrent: false,
      description: [
        "Supervisé la gestion des bilans, optimisé les processus pour réduire les coûts de 15 %.",
        "Garantissant la conformité fiscale à tout moment.",
      ],
    },
    {
      position: "Experte-Comptable",
      companyName: "Classique Immo, Any City",
      startDate: "2012",
      endDate: "2018",
      isCurrent: false,
      description: [
        "Audité des comptes, optimisé la fiscalité d'entreprises de 10 %.",
        "Encadré une équipe de 5 collaborateurs juniors.",
      ],
    },
    {
      position: "Contrôleuse de Gestion",
      companyName: "Bancollect, Any City",
      startDate: "2010",
      endDate: "2012",
      isCurrent: false,
      description: [
        "Réduit les écarts budgétaires de 20 %, amélioré la rentabilité des services.",
      ],
    },
    {
      position: "Comptable Fiscaliste",
      companyName: "Narbonne et fils, Any City",
      startDate: "2009",
      endDate: "2010",
      isCurrent: false,
      description: [
        "Géré les déclarations fiscales et élaboré des stratégies pour minimiser les risques.",
      ],
    },
  ],
  education: [
    {
      degree: "Master Comptabilité & Audit",
      institutionName: "MatInfo",
      startDate: "2007",
      endDate: "2009",
      isCurrent: false,
    },
    {
      degree: "Diplôme d'Expertise Comptable",
      institutionName: "Concordia",
      startDate: "2006",
      endDate: "2007",
      isCurrent: false,
    },
    {
      degree: "Certification en Fiscalité",
      institutionName: "Tempo",
      startDate: "2004",
      endDate: "2006",
      isCurrent: false,
    },
  ],
  skills: [
    "Gestion de projet",
    "Stratégie de communication",
    "Relations publiques et médias",
    "Rédaction et édition de contenu",
    "Communication digitale",
    "Logiciel 01",
    "Logiciel 02",
    "Logiciel 03",
    "Logiciel 04",
  ],
  expertise: [
    "Analyse financière approfondie",
    "Maîtrise des normes comptables",
    "Gestion et optimisation budgétaire",
    "Conseil fiscal stratégique",
    "Pilotage d'équipe comptable",
  ],
  languages: [
    { name: "Français", proficiency: "Langue maternelle" },
    { name: "Anglais", proficiency: "Niveau professionnel" },
    { name: "Portugais", proficiency: "Niveau débutant" },
  ],
  interests: ["Lecture", "Cinéma", "Randonnée", "Bénévolat associatif"],
};
