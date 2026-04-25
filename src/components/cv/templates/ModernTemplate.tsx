"use client";

import { TCVTemplateProps } from "@/types/cvContent.tye";

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
      className="flex w-[794px] min-h-[1123px] bg-[#0f1e5c] font-sans"
      style={{ fontFamily: "Open Sans, sans-serif" }}
    >
      {/* ── SIDEBAR ── full navy top-to-bottom */}
      <aside className="w-[280px]  text-white flex flex-col shrink-0">
        {/* Profile photo box */}
        <div className="w-full h-[280px] px-[28px] py-[24px] mt-[3px] box-border">
          <div className="w-full h-full border-8 border-white overflow-hidden">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-300 h-full w-full" />
            )}
          </div>
        </div>

        <div className="pl-[50px] mt-2">
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

        <div className="w-full h-[2px] bg-white mb-6"></div>

        {skills.length > 0 && (
          <div className="mb-[25px] pl-[50px]">
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

        <div className="w-full h-[2px] bg-white mb-6"></div>

        {languages.length > 0 && (
          <div className="mb-[25px] pl-[50px]">
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

        <div className="w-full h-[2px] bg-white mb-6"></div>

        {interests.length > 0 && (
          <div className="mb-[25px] px-[50px]">
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
        <header className="bg-white px-[26px] py-[36px] mt-4 mr-3">
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

        <section className="py-[2px]">
          <h2 className="pl-[26px] text-2xl text-white tracking-[2px] font-bold leading-7">
            EXPÉRIENCES PROFESSIONNELLES
          </h2>
        </section>

        {/* EXPÉRIENCES PROFESSIONNELLES */}
        {experiences.length > 0 && (
          <section className="bg-white px-[26px] py-[30px] mr-3">
            {experiences.map((exp, i) => (
              <div key={i} className="mb-[20px]">
                <div className="flex items-center mb-[4px] gap-3">
                  <div className="bg-blue-950 size-4 mt-2 rounded-full"></div>
                  <h3
                    className="text-[15px] font-bold text-black m-0"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {exp.position} - {exp.companyName}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-gray-600 px-[30px]">
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

        <section className="py-[2px]">
          <h2 className="pl-[26px] text-2xl text-white tracking-[2px] font-bold leading-7">
            FORMATIONS
          </h2>
        </section>

        {/* FORMATIONS */}
        {education.length > 0 && (
          <section className="bg-white px-[26px] py-[2px] mr-3">
            {education.map((edu, i) => (
              <div key={i} className="mb-[20px] mt-[24px]">
                <div className="flex items-center mb-[4px]">
                  <div className="bg-blue-950 size-4 mt-2 rounded-full"></div>
                  <h3
                    className="text-[14px] font-bold text-black ml-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
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
