"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";

const NAVY = "#0f1e5c";

export default function ModernTemplate({ data }: TCVTemplateProps) {
  const {
    personalInfo,
    experiences,
    education,
    skills = [],
    expertise = [],
    languages,
    interests,
  } = data;

  return (
    <div
      style={{
        display: "flex",
        width: 794,
        minHeight: 1123,
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        background: "#ffffff",
      }}
    >
      {/* ── Dark Sidebar ──────────────────────────────────────────── */}
      <aside
        style={{
          width: 238,
          background: NAVY,
          flexShrink: 0,
          color: "#ffffff",
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: 238,
            height: 196,
            background: "#1a2e7a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            <PersonPlaceholderLight />
          )}
        </div>

        <div style={{ padding: "18px 18px" }}>
          {/* Informations */}
          <ModernSidebarSection title="Informations">
            <ModernRow>Permis B</ModernRow>
            <ModernRow>{personalInfo.phoneNumber}</ModernRow>
            <ModernRow>{personalInfo.email}</ModernRow>
            <ModernRow>{personalInfo.address}</ModernRow>
          </ModernSidebarSection>

          {/* Compétences */}
          {skills.length > 0 && (
            <ModernSidebarSection title="Compétences">
              {skills.map((c, i) => (
                <ModernRow key={i}>{c}</ModernRow>
              ))}
            </ModernSidebarSection>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <ModernSidebarSection title="Langues">
              {languages.map((l, i) => (
                <ModernRow key={i}>
                  {l.name} ({l.proficiency})
                </ModernRow>
              ))}
            </ModernSidebarSection>
          )}

          {/* Intérêts */}
          {interests.length > 0 && (
            <ModernSidebarSection title="Intérêts">
              {interests.map((item, i) => (
                <ModernRow key={i}>{item}</ModernRow>
              ))}
            </ModernSidebarSection>
          )}
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        {/* Header */}
        <div
          style={{
            padding: "28px 28px 18px",
            borderBottom: `3px solid ${NAVY}`,
          }}
        >
          <h1
            style={{
              color: NAVY,
              fontSize: 34,
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {personalInfo.fullName}
          </h1>
          <p
            style={{
              color: NAVY,
              fontSize: 11.5,
              fontWeight: "bold",
              letterSpacing: 3.5,
              textTransform: "uppercase",
              margin: "5px 0 12px",
            }}
          >
            {personalInfo.summary?.split(" ").slice(0, 3).join(" ")}
          </p>
          {personalInfo.summary && (
            <p
              style={{
                fontSize: 10.5,
                color: "#555",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {personalInfo.summary}
            </p>
          )}
        </div>

        <div style={{ padding: "18px 28px" }}>
          {/* Experience */}
          {experiences.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <ModernSectionBar>Expériences Professionnelles</ModernSectionBar>
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 14,
                    paddingLeft: 10,
                    borderLeft: `3px solid ${NAVY}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: "bold",
                      color: NAVY,
                      margin: 0,
                    }}
                  >
                    ● {exp.position}
                  </p>
                  <p
                    style={{
                      fontSize: 9.5,
                      color: "#aaa",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      margin: "2px 0 4px",
                    }}
                  >
                    {exp.startDate} – {exp.isCurrent ? "Actuel" : exp.endDate}
                  </p>
                  {exp.description.map((d, j) => (
                    <p
                      key={j}
                      style={{
                        fontSize: 9.5,
                        color: "#555",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {d}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* Expertise */}
          {expertise.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <ModernSectionBar>Expertise</ModernSectionBar>
              {expertise.map((item, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 8,
                    paddingLeft: 10,
                    borderLeft: `3px solid ${NAVY}`,
                    fontSize: 9.5,
                    color: "#555",
                    lineHeight: 1.65,
                  }}
                >
                  {item}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <ModernSectionBar>Formations</ModernSectionBar>
              {education.map((edu, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 12,
                    paddingLeft: 10,
                    borderLeft: `3px solid ${NAVY}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: "bold",
                      color: NAVY,
                      margin: 0,
                    }}
                  >
                    ● {edu.degree}
                  </p>
                  <p style={{ fontSize: 9.5, color: "#aaa", margin: "2px 0" }}>
                    {edu.startDate} – {edu.isCurrent ? "Present" : edu.endDate}
                  </p>
                  <p style={{ fontSize: 9.5, color: "#555", margin: 0 }}>
                    {edu.institutionName}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ModernSidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: "bold",
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: "#ffffff",
          marginBottom: 8,
        }}
      >
        {title}
      </p>
      <div
        style={{
          width: "100%",
          height: 0.5,
          background: "rgba(255,255,255,0.2)",
          marginBottom: 10,
        }}
      />
      {children}
    </div>
  );
}

function ModernRow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 9.5,
        color: "rgba(255,255,255,0.82)",
        lineHeight: 1.95,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

function ModernSectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0f1e5c",
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 2,
        textTransform: "uppercase",
        padding: "6px 12px",
        marginBottom: 13,
      }}
    >
      {children}
    </div>
  );
}

function PersonPlaceholderLight() {
  return (
    <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
      <circle cx="40" cy="30" r="20" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="40" cy="82" rx="32" ry="22" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}
