"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";
import React from "react";

/**
 * PIXEL-PERFECT RECREATION
 * - Photo: Full sidebar width (272px) with fixed height [cite: 1]
 * - Header Color: Navy (#1e2d5e) for names and titles [cite: 7, 8]
 * - Sidebar: Lavender-grey background (#eaebf5) [cite: 1]
 */

const NAVY = "#1e2d5e";
const SIDEBAR_BG = "#eaebf5";
const PHOTO_BG = "#c9cbe5";

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
      style={{
        display: "flex",
        width: 794,
        minHeight: 1123,
        fontFamily: "Georgia, serif",
        background: "#ffffff",
      }}
    >
      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside style={{ width: 272, background: SIDEBAR_BG, flexShrink: 0 }}>
        {/* Full-width Photo Layout [cite: 1] */}
        <div
          style={{
            width: 272,
            height: 280,
            background: PHOTO_BG,
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

        <div style={{ padding: "40px 30px" }}>
          {/* Contact Section [cite: 1] */}
          <SidebarSection title="CONTACT">
            <SidebarRow>{personalInfo.email}</SidebarRow>
            <SidebarRow>{personalInfo.phoneNumber}</SidebarRow>
            {personalInfo.website && (
              <SidebarRow>{personalInfo.website}</SidebarRow>
            )}
            <SidebarRow>{personalInfo.address}</SidebarRow>
          </SidebarSection>

          {/* Software Section [cite: 19] */}
          {skills.length > 0 && (
            <SidebarSection title="LOGICIELS MAÎTRISÉS">
              {skills.map((s, i) => (
                <SidebarRow key={i}>{s}</SidebarRow>
              ))}
            </SidebarSection>
          )}

          {/* Languages Section [cite: 24] */}
          {languages.length > 0 && (
            <SidebarSection title="LANGUES PARLÉES">
              {languages.map((l, i) => (
                <SidebarRow key={i}>
                  {l.name}: {l.proficiency}
                </SidebarRow>
              ))}
            </SidebarSection>
          )}

          {/* Education Section [cite: 27] */}
          {education.length > 0 && (
            <SidebarSection title="FORMATION">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 15 }}>
                  <p style={eduTitleStyle}>{edu.degree}</p>
                  <p style={eduSubStyle}>{edu.institutionName}</p>
                  <p style={eduDateStyle}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </SidebarSection>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "50px 45px" }}>
        {/* Navy Header Section [cite: 7, 8] */}
        <h1 style={nameStyle}>
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

// ── STYLES ──────────────────────────────────────────────────

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h2 style={sidebarHeaderStyle}>{title}</h2>
      {children}
    </div>
  );
}

function SidebarRow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, margin: "4px 0", color: "#333" }}>{children}</p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <h2 style={mainHeaderStyle}>{children}</h2>
      <div style={{ height: 2, background: NAVY, width: "100%" }} />
    </div>
  );
}

const nameStyle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 900,
  color: NAVY,
  lineHeight: 0.9,
  margin: 0,
  textTransform: "uppercase",
};

const jobTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: "bold",
  color: NAVY,
  letterSpacing: 3,
  marginTop: 12,
  textTransform: "uppercase",
};

const navyDividerStyle: React.CSSProperties = {
  width: 55,
  height: 4,
  background: NAVY,
  margin: "25px 0",
};

const sidebarHeaderStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: "bold",
  color: NAVY,
  borderBottom: `1px solid ${NAVY}`,
  paddingBottom: 5,
  marginBottom: 10,
  letterSpacing: 1,
};

const mainHeaderStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: "bold",
  color: NAVY,
  letterSpacing: 2,
  marginBottom: 4,
};

const summaryStyle: React.CSSProperties = {
  fontSize: 11.5,
  lineHeight: 1.6,
  color: "#444",
  marginBottom: 35,
};

const expPosStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: "bold",
  color: NAVY,
  margin: 0,
};

const expDateStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#777",
};

const expCompanyStyle: React.CSSProperties = {
  fontSize: 11,
  fontStyle: "italic",
  margin: "2px 0 6px 0",
};

const expDescStyle: React.CSSProperties = {
  fontSize: 11,
  lineHeight: 1.5,
  color: "#444",
};

const expertiseStyle: React.CSSProperties = {
  fontSize: 11.5,
  margin: "4px 0",
  color: "#444",
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
