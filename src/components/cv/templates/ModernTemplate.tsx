"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";
import React from "react";

/**
 * EXACT REPLICA TEMPLATE
 * - Sidebar: Solid Navy (#0f1e5c) with white text and dividers.
 * - Sections: Full-width Navy background bars for "EXPÉRIENCES PROFESSIONNELLES", etc.
 * - Content: Bullet points (●) for titles within main sections.
 */

const NAVY = "#0f1e5c";

export default function ModernTemplate({ data }: TCVTemplateProps) {
  const {
    personalInfo,
    experiences,
    education,
    skills = [],
    languages,
    interests = [],
  } = data;

  return (
    <div
      style={{
        display: "flex",
        width: 794,
        minHeight: 1123,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        background: "#ffffff",
      }}
    >
      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside
        style={{
          width: 280,
          background: NAVY,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Profile Image - Square/Slightly Portrait */}
        <div
          style={{
            width: "100%",
            height: 240,
            padding: "25px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#fff",
              border: "4px solid #fff",
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
              <div style={{ background: "#ccc", height: "100%" }} />
            )}
          </div>
        </div>

        <div style={{ padding: "0 25px 40px" }}>
          {/* Informations */}
          <SidebarSection title="INFORMATIONS">
            <SidebarRow>Permis B</SidebarRow>
            <SidebarRow>{personalInfo.phoneNumber}</SidebarRow>
            <SidebarRow>{personalInfo.email}</SidebarRow>
            <SidebarRow>{personalInfo.address}</SidebarRow>
          </SidebarSection>

          {/* Compétences */}
          {skills.length > 0 && (
            <SidebarSection title="COMPÉTENCES">
              {skills.map((skill, i) => (
                <SidebarRow key={i}>{skill}</SidebarRow>
              ))}
            </SidebarSection>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <SidebarSection title="LANGUES">
              {languages.map((lang, i) => (
                <SidebarRow key={i}>
                  {lang.name} ({lang.proficiency})
                </SidebarRow>
              ))}
            </SidebarSection>
          )}

          {/* Intérêts */}
          {interests.length > 0 && (
            <SidebarSection title="INTERÊTS">
              {interests.map((item, i) => (
                <SidebarRow key={i}>{item}</SidebarRow>
              ))}
            </SidebarSection>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px 30px" }}>
        {/* Name and Professional Title */}
        <header style={{ marginBottom: 25 }}>
          <h1 style={nameStyle}>{personalInfo.fullName}</h1>
          <p style={titleStyle}>
            {personalInfo.role || "CHARGÉ DE COMMUNICATION"}
          </p>
          {personalInfo.summary && (
            <p style={summaryStyle}>{personalInfo.summary}</p>
          )}
        </header>

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section style={{ marginBottom: 30 }}>
            <SectionHeader>EXPÉRIENCES PROFESSIONNELLES</SectionHeader>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={entryHeaderStyle}>
                  <span style={bulletStyle}>●</span>
                  <h3 style={entryTitleStyle}>
                    {exp.position} - {exp.companyName}
                  </h3>
                </div>
                <p style={dateStyle}>
                  {exp.startDate.toUpperCase()} -{" "}
                  {exp.isCurrent
                    ? "ACTUEL"
                    : (exp.endDate ?? "PRÉSENT").toUpperCase()}
                </p>
                {exp.description.map((desc, j) => (
                  <p key={j} style={descStyle}>
                    {desc}
                  </p>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section>
            <SectionHeader>FORMATIONS</SectionHeader>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={entryHeaderStyle}>
                  <span style={bulletStyle}>●</span>
                  <h3 style={entryTitleStyle}>{edu.degree}</h3>
                </div>
                <p style={dateStyle}>
                  {edu.startDate} - {edu.endDate}
                </p>
                <p style={descStyle}>
                  {edu.institutionName} -{" "}
                  {personalInfo.address?.split(",").pop()?.trim() || "Any City"}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

// ── COMPONENTS ─────────────────────────────────────────────────────────────

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 25 }}>
      <h2 style={sidebarTitleStyle}>{title}</h2>
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.4)",
          margin: "8px 0 12px",
        }}
      />
      {children}
    </div>
  );
}

function SidebarRow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11.5, margin: "6px 0", opacity: 0.9 }}>{children}</p>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: NAVY, padding: "8px 15px", marginBottom: 18 }}>
      <h2
        style={{
          color: "#fff",
          fontSize: 14,
          fontWeight: "bold",
          letterSpacing: 1.5,
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────────

const nameStyle: React.CSSProperties = {
  fontSize: 42,
  fontWeight: 900,
  color: NAVY,
  margin: "0 0 5px 0",
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  color: NAVY,
  letterSpacing: 1,
  fontWeight: "bold",
  textTransform: "uppercase",
  margin: "0 0 15px 0",
};

const summaryStyle: React.CSSProperties = {
  fontSize: 10.5,
  lineHeight: 1.6,
  color: "#333",
  margin: 0,
};

const sidebarTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: "bold",
  letterSpacing: 2,
  textTransform: "uppercase",
  margin: 0,
};

const entryHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: 4,
};

const bulletStyle: React.CSSProperties = {
  color: NAVY,
  fontSize: 16,
  marginRight: 10,
};

const entryTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: "bold",
  color: "#000",
  margin: 0,
};

const dateStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: "bold",
  color: "#666",
  paddingLeft: 22,
  marginBottom: 6,
};

const descStyle: React.CSSProperties = {
  fontSize: 11,
  lineHeight: 1.5,
  color: "#444",
  paddingLeft: 22,
  marginBottom: 3,
};
