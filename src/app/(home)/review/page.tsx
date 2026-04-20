"use client";

import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCV } from "@/lib/CVContext";
import { FormInput } from "./_components/FormInput";
import { FormTextarea } from "./_components/FormTextarea";
import { FormImageUpload } from "./_components/FormImageUpload";
import { FormSelectLanguage } from "./_components/FormSelectLanguage";
import { SkillsField } from "./_components/SkillsField";
import { ExperienceField } from "./_components/ExperienceField";
import { EducationField } from "./_components/EducationField";

interface ReviewFormData {
  profileImage: string | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  languages: Array<{ name: string; proficiency: "Native" | "Fluent" | "Intermediate" | "Basic" }>;
  skills: string[];
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  educations: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
}

export default function ReviewPage() {
  const { cvData, setCVData } = useCV();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  // Initialize form with static defaults first
  const methods = useForm<ReviewFormData>({
    mode: "onChange",
    defaultValues: {
      profileImage: null,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      summary: "",
      languages: [],
      skills: [],
      experiences: [],
      educations: [],
    },
  });

  const { watch, reset } = methods;
  const formData = watch();

  // Update form with extracted data when cvData is available
  useEffect(() => {
    if (!cvData) return;

    // Convert languages to proper format with proficiency
    const languages = Array.isArray(cvData.languages)
      ? cvData.languages.map((lang: any) =>
          typeof lang === "string"
            ? { name: lang, proficiency: "Fluent" as const }
            : { name: lang.name || "", proficiency: lang.proficiency || "Fluent" }
        )
      : [];

    const formValues: ReviewFormData = {
      profileImage: cvData.profileImage ?? null,
      fullName: cvData.personalInfo?.name ?? "",
      email: cvData.personalInfo?.email ?? "",
      phone: cvData.personalInfo?.phone ?? "",
      address: cvData.personalInfo?.location ?? "",
      summary: cvData.summary ?? "",
      languages,
      skills: Array.isArray(cvData.skills) ? cvData.skills : [],
      experiences: Array.isArray(cvData.experience)
        ? cvData.experience.map((exp, idx) => ({
            id: `exp-${idx}`,
            title: exp.position ?? "",
            company: exp.company ?? "",
            startDate: exp.startDate ?? "",
            endDate: exp.endDate ?? "",
            description: exp.description ?? "",
          }))
        : [],
      educations: Array.isArray(cvData.education)
        ? cvData.education.map((edu, idx) => ({
            id: `edu-${idx}`,
            school: edu.school ?? "",
            degree: edu.degree ?? "",
            field: edu.field ?? "",
            graduationDate: edu.graduationDate ?? "",
          }))
        : [],
    };

    reset(formValues);
    hasInitializedRef.current = true;
  }, [cvData, reset]);

  // Debounced sync - sync to context only after 500ms of inactivity
  useEffect(() => {
    if (!hasInitializedRef.current) {
      return;
    }

    // Clear previous timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for syncing
    syncTimeoutRef.current = setTimeout(() => {
      if (cvData && formData) {
        setCVData({
          ...cvData,
          profileImage: formData.profileImage,
          personalInfo: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            location: formData.address,
          },
          summary: formData.summary,
          skills: formData.skills,
          languages: formData.languages,
          experience: formData.experiences.map((exp) => ({
            company: exp.company,
            position: exp.title,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
          })),
          education: formData.educations.map((edu) => ({
            school: edu.school,
            degree: edu.degree,
            field: edu.field,
            graduationDate: edu.graduationDate,
          })),
        });
      }
    }, 500);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [formData, cvData, setCVData]);

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100 py-8 px-4">
      <FormProvider {...methods}>
        <form className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              Review extracted information
            </h1>
            <p className="text-zinc-600 mb-4">
              Your CV has been extracted and formatted to Swiss professional
              standards. Please review and make any edits before proceeding.
            </p>
            {cvData && (
              <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <p className="text-sm text-green-800">
                  ✓ Data successfully extracted and processed in Swiss format
                </p>
              </div>
            )}
          </div>

          {/* Profile Section with Image Uploader */}
          <Card className="mb-8 p-8 bg-white border-0 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Image Upload Section */}
              <FormImageUpload name="profileImage" label="Profile Photo" />

              {/* Personal Information */}
              <div className="md:col-span-3 space-y-4">
                <FormInput
                  name="fullName"
                  label="Full Name"
                  placeholder="Your full name"
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="email@example.com"
                  />
                  <FormInput
                    name="phone"
                    label="Phone Number"
                    placeholder="+41 XX XXX XX XX"
                  />
                </div>

                <FormInput
                  name="address"
                  label="Address"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>
          </Card>

          {/* Resume Summary */}
          <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
            <FormTextarea
              name="summary"
              label="Professional Summary"
              placeholder="Your professional summary (Swiss style)..."
              rows={5}
            />
            <p className="text-xs text-zinc-500 mt-2">
              Formatted in Swiss professional standards
            </p>
          </Card>

          {/* Languages and Skills */}
          <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
            <div className="space-y-6">
              <FormSelectLanguage
                name="languages"
                label="Languages & Proficiency"
              />

              <SkillsField name="skills" label="Skills" />
            </div>
          </Card>

          {/* Professional Experience */}
          <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
            <ExperienceField
              name="experiences"
              label="Professional Experience"
            />
          </Card>

          {/* Education */}
          <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
            <EducationField name="educations" label="Education" />
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 mb-8">
            <Link href="/">
              <Button
                type="button"
                variant="outline"
                className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                ← Back to extraction
              </Button>
            </Link>

            <Link href="/generate">
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Continue to template selection →
              </Button>
            </Link>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
