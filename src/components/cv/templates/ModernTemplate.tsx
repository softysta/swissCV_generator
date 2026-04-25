"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";
import { useCVFormatting } from "@/hooks/useCVFormatting";

export default function ModernTemplate({ data }: TCVTemplateProps) {
  // Apply Swiss tone and template-specific formatting
  const { data: optimizedData } = useCVFormatting(data, {
    templateId: 'modern',
  });

  const {
    personalInfo,
    experiences,
    education,
    skills = [],
    languages,
    interests = [],
  } = optimizedData;

  return (
    <div
      className="flex w-[794px] min-h-[1123px] bg-[#0f1e5c] font-sans"
      style={{
        fontFamily: "Open Sans, sans-serif",
        backgroundColor: "#0f1e5c",
      }}
    >
      {/* ── SIDEBAR ── full navy top-to-bottom */}
      <aside
        className="w-[280px] flex flex-col shrink-0"
        style={{ color: "#ffffff" }}
      >
        {/* Profile photo box */}
        <div className="w-full h-[280px] px-[28px] py-[24px] mt-[3px] box-border">
          <div className="w-full h-full border-8 border-white overflow-hidden">
            {personalInfo.photoUrl ? (
              <div
                aria-label={personalInfo.fullName}
                role="img"
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${personalInfo.photoUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ backgroundColor: "#d1d5db" }}
              />
            )}
          </div>
        </div>

        <div className="pl-[45px] mt-2">
          <div className="mb-[25px]">
            <h2
              className="text-[18px] font-bold tracking-[2px] uppercase mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              INFORMATIONS
            </h2>
            <p className="text-[11.5px] my-[6px] opacity-90">Permis B</p>
            <p className="text-[11.5px] my-[6px] opacity-90">
              {personalInfo.phoneNumber}
            </p>
            <p className="text-[11.5px] my-[6px] opacity-90">
              {personalInfo.email}
            </p>
            <p className="text-[11.5px] my-[6px] opacity-90">
              {personalInfo.address}
            </p>
          </div>
        </div>

        <div
          className="w-full h-[2px] mb-6"
          style={{ backgroundColor: "#ffffff" }}
        ></div>

        {skills.length > 0 && (
          <div className="mb-[25px] pl-[45px]">
            <h2
              className="text-[18px] font-bold tracking-[2px] uppercase mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              COMPÉTENCES
            </h2>
            {skills.map((skill, i) => (
              <p key={i} className="text-[13px] my-[6px] opacity-90">
                {skill}
              </p>
            ))}
          </div>
        )}

        <div
          className="w-full h-[2px] mb-6"
          style={{ backgroundColor: "#ffffff" }}
        ></div>

        {languages.length > 0 && (
          <div className="mb-[25px] pl-[45px]">
            <h2
              className="text-[18px] font-bold tracking-[2px] uppercase mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              LANGUES
            </h2>
            {languages.map((lang, i) => (
              <p key={i} className="text-[11.5px] my-[4px] opacity-90">
                {lang.name} ({lang.proficiency})
              </p>
            ))}
          </div>
        )}

        <div
          className="w-full h-[2px] mb-6"
          style={{ backgroundColor: "#ffffff" }}
        ></div>

        {interests.length > 0 && (
          <div className="mb-[25px] pl-[45px]">
            <h2
              className="text-[18px] font-bold tracking-[2px] uppercase mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              INTERÊTS
            </h2>
            {interests.map((item, i) => (
              <p key={i} className="text-[11.5px] my-[6px] opacity-90">
                {item}
              </p>
            ))}
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── white background */}
      <main className="flex-1">
        {/* Name + Title + Summary */}
        <header
          className="px-[26px] pb-[36px] pt-[20px] mt-4 mr-3"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h1
            className="text-[42px] font-bold text-[#0f1e5c] m-0 mb-[5px] leading-none"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {personalInfo.fullName}
          </h1>
          <p
            className="text-[22px] mt-[12px] text-[#0f1e5c] font-semibold tracking-[2px] uppercase mb-[11px]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
          >
            {personalInfo.role || "CHARGÉ DE COMMUNICATION"}
          </p>
          {personalInfo.summary && (
            <p className="text-[12px] font-semibold leading-[1.6] m-0">
              {personalInfo.summary}
            </p>
          )}
        </header>

        <section className="py-[2px] relative w-[100%] h-[30px]">
          <h2
            className="pl-[26px] text-2xl tracking-[2px] font-bold leading-7 absolute -top-[10px] left-0"
            style={{ color: "#ffffff" }}
          >
            EXPÉRIENCES PROFESSIONNELLES
          </h2>
        </section>

        {/* EXPÉRIENCES PROFESSIONNELLES */}
        {experiences.length > 0 && (
          <section
            className="px-[26px] py-[16px] mr-3"
            style={{ backgroundColor: "#ffffff" }}
          >
            {experiences.map((exp, i) => (
              <div key={i} className="mb-[10px]">
                <div className="flex items-center mb-[4px] gap-3">
                  <div
                    className="size-4 mt-6 rounded-full"
                    style={{ backgroundColor: "#172554" }}
                  ></div>
                  <h3
                    className="text-[15px] font-bold m-0"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "#000000",
                    }}
                  >
                    {exp.position} - {exp.companyName}
                  </h3>
                </div>
                <p
                  className="text-xs font-semibold px-[30px]"
                  style={{ color: "#4b5563" }}
                >
                  {formatDateRange(exp.startDate, exp.endDate, "en")}
                </p>
                {exp.description.map((desc, j) => (
                  <p
                    key={j}
                    className="text-[12px] leading-[1.5] text-[#000000] pl-[30px] mb-[3px] mt-1"
                  >
                    {desc}
                  </p>
                ))}
              </div>
            ))}
          </section>
        )}

        <section className="py-[2px] relative w-[100%] h-[30px]">
          <h2
            className="pl-[26px] text-2xl tracking-[2px] font-bold leading-7 absolute -top-[10px] left-0"
            style={{ color: "#ffffff" }}
          >
            FORMATIONS
          </h2>
        </section>

        {/* FORMATIONS */}
        {education.length > 0 && (
          <section
            className="px-[16px] py-[2px] mr-3"
            style={{ backgroundColor: "#ffffff" }}
          >
            {education.map((edu, i) => (
              <div key={i} className="mb-[10px] mt-[24px]">
                <div className="flex items-center">
                  <div
                    className="size-4 mt-6 rounded-full"
                    style={{ backgroundColor: "#172554" }}
                  ></div>
                  <h3
                    className="text-[14px] font-bold ml-2"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "#000000",
                    }}
                  >
                    {edu.degree}
                  </h3>
                </div>
                <p className="text-[11px] font-bold  pl-[24px] mb-[6px] mt-0">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-[11px] leading-[1.5] font-semibold pl-[22px] mb-[3px] mt-0">
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

function formatDateRange(
  start: string | undefined,
  end: string | undefined,
  lang: "en" | "fr" = "en",
) {
  const months = {
    en: [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ],
    fr: [
      "JANVIER",
      "FÉVRIER",
      "MARS",
      "AVRIL",
      "MAI",
      "JUIN",
      "JUILLET",
      "AOÛT",
      "SEPTEMBRE",
      "OCTOBRE",
      "NOVEMBRE",
      "DÉCEMBRE",
    ],
  };

  const startDate = new Date(start || "");
  const endDate = !end || end === "present" ? null : new Date(end);

  const startText = `${months[lang][startDate.getMonth()]} ${startDate.getFullYear()}`;
  const endText = endDate
    ? `${months[lang][endDate.getMonth()]} ${endDate.getFullYear()}`
    : lang === "fr"
      ? "ACTUEL"
      : "PRESENT";

  return `${startText} - ${endText}`;
}
