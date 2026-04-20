"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";

const NAVY = "#1e2d5e";
const SIDEBAR = "#eaebf5";

export default function ClassicTemplate({ data }: TCVTemplateProps) {
  const {
    personalInfo,
    experiences,
    education,
    skills = [],
    expertise = [],
    languages,
  } = data;
  const nameParts = personalInfo.fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div
      style={{
        display: "flex",
        width: 794,
        minHeight: 1123,
        fontFamily: "Georgia, 'Times New Roman', serif",
        background: "#ffffff",
      }}
    >
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside style={{ width: 272, background: SIDEBAR, flexShrink: 0 }}>
        {/* Photo */}
        <div
          style={{
            width: 272,
            height: 216,
            background: "#c9cbe5",
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
            <PersonPlaceholder />
          )}
        </div>

        <div style={{ padding: "22px 22px" }}>
          {/* Contact */}
          <ClassicSidebarSection title="Contact">
            <ClassicSidebarRow>✉ {personalInfo.email}</ClassicSidebarRow>
            <ClassicSidebarRow>☎ {personalInfo.phoneNumber}</ClassicSidebarRow>
            {personalInfo.website && (
              <ClassicSidebarRow>🌐 {personalInfo.website}</ClassicSidebarRow>
            )}
            <ClassicSidebarRow>📍 {personalInfo.address}</ClassicSidebarRow>
          </ClassicSidebarSection>

          {/* Skills */}
          {(skills.length > 0 || languages.length > 0) && (
            <ClassicSidebarSection title="Compétences">
              {skills.length > 0 && (
                <>
                  <p style={subLabelStyle}>Compétences clés</p>
                  {skills.map((s, i) => (
                    <ClassicSidebarRow key={i}>{s}</ClassicSidebarRow>
                  ))}
                </>
              )}
              {languages.length > 0 && (
                <>
                  <p style={{ ...subLabelStyle, marginTop: 8 }}>
                    Langues Parlées
                  </p>
                  {languages.map((l, i) => (
                    <ClassicSidebarRow key={i}>
                      {l.name} : {l.proficiency}
                    </ClassicSidebarRow>
                  ))}
                </>
              )}
            </ClassicSidebarSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <ClassicSidebarSection title="Formation">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: 10.5,
                      fontWeight: "bold",
                      color: NAVY,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {edu.degree}
                  </p>
                  <p
                    style={{
                      fontSize: 10.5,
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    {edu.institutionName}
                  </p>
                  <p style={{ fontSize: 10, color: "#999" }}>
                    {edu.startDate} – {edu.isCurrent ? "Present" : edu.endDate}
                  </p>
                </div>
              ))}
            </ClassicSidebarSection>
          )}
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "38px 34px" }}>
        {/* Name */}
        <h1
          style={{
            color: NAVY,
            fontSize: 34,
            fontWeight: "bold",
            lineHeight: 1.08,
            textTransform: "uppercase",
            letterSpacing: 2,
            margin: 0,
          }}
        >
          {firstName}
          <br />
          {lastName}
        </h1>

        {/* Job Title */}
        <p
          style={{
            color: NAVY,
            fontSize: 12.5,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            fontStyle: "italic",
            marginTop: 7,
          }}
        >
          {personalInfo.summary?.split(" ").slice(0, 3).join(" ")}
        </p>

        {/* Divider */}
        <div
          style={{
            width: 55,
            height: 2,
            background: NAVY,
            marginTop: 12,
            marginBottom: 18,
          }}
        />

        {/* Summary */}
        {personalInfo.summary && (
          <p
            style={{
              fontSize: 11.5,
              color: "#444",
              lineHeight: 1.75,
              marginBottom: 26,
            }}
          >
            {personalInfo.summary}
          </p>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <ClassicMainSectionTitle>Expérience</ClassicMainSectionTitle>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: "bold",
                      color: NAVY,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      margin: 0,
                    }}
                  >
                    {exp.position}
                  </p>
                  <p
                    style={{
                      fontSize: 10.5,
                      color: "#888",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {exp.startDate} – {exp.isCurrent ? "Actuel" : exp.endDate}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#666",
                    fontStyle: "italic",
                    margin: "3px 0 5px",
                  }}
                >
                  {exp.companyName}
                </p>
                {exp.description.map((d, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 11,
                      color: "#444",
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
          <section>
            <ClassicMainSectionTitle>Expertise</ClassicMainSectionTitle>
            {expertise.map((s, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11.5,
                  color: "#444",
                  position: "relative",
                  paddingLeft: 14,
                  marginBottom: 6,
                }}
              >
                <span style={{ position: "absolute", left: 2 }}>•</span>
                {s}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ClassicSidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p
        style={{
          color: "#1e2d5e",
          fontSize: 12,
          fontWeight: "bold",
          letterSpacing: 2.5,
          textTransform: "uppercase",
          borderBottom: "1px solid #1e2d5e",
          paddingBottom: 5,
          marginBottom: 10,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function ClassicSidebarRow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10.5, color: "#333", lineHeight: 1.95, margin: 0 }}>
      {children}
    </p>
  );
}

function ClassicMainSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: "#1e2d5e",
        fontSize: 13,
        fontWeight: "bold",
        letterSpacing: 3,
        textTransform: "uppercase",
        borderBottom: "2px solid #1e2d5e",
        paddingBottom: 6,
        marginBottom: 14,
      }}
    >
      {children}
    </p>
  );
}

function PersonPlaceholder() {
  return (
    <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
      <circle cx="40" cy="30" r="20" fill="#9fa3d0" />
      <ellipse cx="40" cy="82" rx="32" ry="22" fill="#9fa3d0" />
    </svg>
  );
}

const subLabelStyle: React.CSSProperties = {
  fontSize: 9.5,
  fontWeight: "bold",
  color: "#1e2d5e",
  textTransform: "uppercase",
  letterSpacing: 1.2,
  marginBottom: 4,
};
