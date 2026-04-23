"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Montserrat, Open_Sans } from "next/font/google";
import React from "react";

/**
 * PIXEL-PERFECT RECREATION
 * - Photo: Full sidebar width (272px) with fixed height [cite: 1]
 * - Header Color: Navy (#1e2d5e) for names and titles [cite: 7, 8]
 * - Sidebar: Lavender-grey background (#eaebf5) [cite: 1]
 */

const NAVY = "#1e2d5e";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "400", "700", "800"],
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function ClassicTemplate({ data }: TCVTemplateProps) {
  const {
    personalInfo,
    experiences,
    education,
    skills = [],
    expertise = [],
    languages,
  } = data;

  // Split name for stacked layout
  const nameParts = personalInfo.fullName.split(" ");
  const firstName = nameParts[0] || "CAMILLA";
  const lastName = nameParts.slice(1).join(" ") || "MARTINE";

  return (
    <div
      className={openSans.className}
      style={{
        display: "flex",
        position: "relative",
        gap: 0,
        width: 794,
        minHeight: 1123,
        background:
          "linear-gradient(to bottom, #DCE1F5 0, #DCE1F5 180px, #ffffff 180px, #ffffff 100%)",
      }}
    >
      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside style={{ width: 300, padding: "30px 10px 30px 30px", zIndex: 20 }}>
        {/* Full-width Photo Layout [cite: 1] */}
        <div className="p-5 bg-[#F5F7FF] mb-3">
          <div
            style={{
              width: "100%",
              height: 200,
              padding: "8px 28px 8px 10px",
              overflow: "hidden",
            }}
          >
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 80,
                }}
              >
                <PersonPlaceholder />
              </div>
            )}
          </div>

          <div className="space-y-5 mt-3">
            <section>
                <h2
                  className={`${montserrat.className} text-[16px] font-bold tracking-[1px] text-[#1e2d5e] bg-white inline-block`}
                >
                  CONTACT
                </h2>
              <div className="mt-4 space-y-2.5 text-[11px] font-semibold leading-tight">
                <div className="grid grid-cols-[16px_1fr] items-start gap-x-2">
                  <span className="flex h-4 w-4 items-center justify-center mt-1.25">
                    <Mail size={16} className="text-[#3D509F]" />
                  </span>
                  <span className="wrap-break-word">{personalInfo.email}</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] items-start gap-x-2">
                  <span className="flex h-4 w-4 items-center justify-center mt-1.25">
                    <Phone size={16} className="text-[#3D509F]" />
                  </span>
                  <span className="wrap-break-word">
                    {personalInfo.phoneNumber}
                  </span>
                </div>
                {personalInfo.website && (
                  <div className="grid grid-cols-[16px_1fr] items-start gap-x-2">
                    <span className="flex h-4 w-4 items-center justify-center mt-1.25">
                      <Globe size={16} className="text-[#3D509F]" />
                    </span>
                    <span className="wrap-break-word">
                      {personalInfo.website}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-[16px_1fr] items-start gap-x-2">
                  <span className="flex h-4 w-4 items-center justify-center mt-1.25">
                    <MapPin size={16} className="text-[#3D509F]" />
                  </span>
                  <span className="wrap-break-word">
                    {personalInfo.address}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="p-5 bg-[#F5F7FF] mb-3">
          <h2
            className={`${montserrat.className} text-[16px] font-bold tracking-[1px] text-[#1e2d5e] bg-white inline-block mb-3`}
          >
            COMPÉTENCES
          </h2>
          {skills.length > 0 && (
            <div>
              <h2
                className={`${montserrat.className} text-[10px] font-black text-[#000000] inline-block mb-2`}
              >
                LOGICIELS MAÎTRISÉS
              </h2>
              <div className="space-y-1.5 text-[11px] font-semibold">
                {skills.map((skill, i) => (
                  <p key={i}>{skill}</p>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="mt-4">
              <h2
                className={`${montserrat.className} text-[10px] font-black text-[#000000] inline-block mb-2`}
              >
                LANGUES MAÎTRISÉES
              </h2>
              <div className="space-y-1.5 text-[12px] font-semibold">
                {languages.map((language, i) => (
                  <p key={i}>
                    {language.name}: {language.proficiency}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="p-5 bg-[#F5F7FF] mb-3">
          <h2
            className={`${montserrat.className} text-[16px] font-bold tracking-[1px] text-[#1e2d5e] bg-white inline-block mb-4`}
          >
            FORMATION
          </h2>

          {education.length > 0 && (
            <div>
              {education.map((edu, i) => (
                <div key={i} className="mb-[3.75]">
                  <p className="text-[12px] font-bold mb-1">{edu.degree}</p>
                  <p className="text-[11px] italic mb-1">
                    {edu.institutionName}
                  </p>
                  <p className="text-[10px] font-semibold">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "30px 50px 30px 20px", zIndex: 20 }}>
        {/* Navy Header Section [cite: 7, 8] */}
        <h1 className={montserrat.className} style={nameStyle}>
          {firstName}
          <br />
          {lastName}
        </h1>
        <p style={jobTitleStyle}>{personalInfo.role || "EXPERTE COMPTABLE"}</p>

        <div style={navyDividerStyle} />

        {/* Summary [cite: 9, 10] */}
        {personalInfo.summary && (
          <p style={summaryStyle}>{personalInfo.summary}</p>
        )}

        {/* Experience [cite: 11] */}
        {experiences.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionTitle>EXPÉRIENCE</SectionTitle>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3 style={expPosStyle}>{exp.position}</h3>
                  <span style={expDateStyle}>
                    {exp.startDate}-{exp.endDate}
                  </span>
                </div>
                <p style={expCompanyStyle}>{exp.companyName}</p>
                {exp.description.map((d, j) => (
                  <p key={j} style={expDescStyle}>
                    {d}
                  </p>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Expertise [cite: 47] */}
        {expertise.length > 0 && (
          <section>
            <SectionTitle>EXPERTISE</SectionTitle>
            {expertise.map((item, i) => (
              <p key={i} style={expertiseStyle}>
                • {item}
              </p>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <h2 className={montserrat.className} style={mainHeaderStyle}>
        {children}
      </h2>
    </div>
  );
}

const nameStyle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 400,
  lineHeight: 0.9,
  marginBottom: 16,
  textTransform: "uppercase",
};

const jobTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: "bold",
  letterSpacing: 1,
  marginTop: 12,
  marginLeft: 5,
  textTransform: "uppercase",
};

const navyDividerStyle: React.CSSProperties = {
  width: 55,
  height: 4,
  margin: "22px 0",
};

const mainHeaderStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: "bold",
  color: NAVY,
  padding: "0 3px",
  backgroundColor: "#F5F7FF",
  display: "inline-block",
};

const summaryStyle: React.CSSProperties = {
  fontSize: 13,
  marginBottom: 28,
  fontWeight: 500,
};

const expPosStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: "bold",
  margin: 0,
  textTransform: "uppercase",
};

const expDateStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: "bold",
};

const expCompanyStyle: React.CSSProperties = {
  fontSize: 12,
  fontStyle: "italic",
  margin: "2px 0 6px 0",
};

const expDescStyle: React.CSSProperties = {
  fontSize: 11,
  lineHeight: 1.5,
  fontWeight: "bold",
};

const expertiseStyle: React.CSSProperties = {
  fontSize: 12,
  margin: "4px 0",
  fontWeight: "bold",
};

const eduTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: "bold",
  color: NAVY,
  margin: 0,
};

const eduSubStyle: React.CSSProperties = {
  fontSize: 11,
  fontStyle: "italic",
  margin: "2px 0",
};

const eduDateStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#999",
};

function PersonPlaceholder() {
  return (
    <svg width="100" height="100" viewBox="0 0 80 90">
      <circle cx="40" cy="30" r="20" fill="#9fa3d0" />
      <ellipse cx="40" cy="82" rx="32" ry="22" fill="#9fa3d0" />
    </svg>
  );
}
