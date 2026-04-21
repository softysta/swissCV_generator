"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCVContext } from "@/store/CVContext";
import { TCVContent } from "@/types/cvContent.tye";
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
  jobTitle: string;
  website: string;
  summary: string;
  languages: Array<{
    name: string;
    proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
  }>;
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
  const { cvData, setCVData } = useCVContext();
  const router = useRouter();
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
      jobTitle: "",
      website: "",
      summary: "",
      languages: [],
      skills: [],
      experiences: [],
      educations: [],
    },
  });

  const { watch, reset } = methods;
  const formData = watch();

  // Transform and navigate to generate page
  const handleProceedToGenerate = () => {
    const tcvContent: TCVContent = {
      personalInfo: {
        fullName: formData.fullName || "",
        role: formData.jobTitle || "",
        email: formData.email || "",
        phoneNumber: formData.phone || "",
        address: formData.address || "",
        website: formData.website || "",
        summary: formData.summary || "",
        photoUrl: formData.profileImage || undefined,
      },
      experiences: formData.experiences.map((exp) => ({
        companyName: exp.company,
        position: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate || undefined,
        isCurrent: !exp.endDate || exp.endDate.trim() === "",
        description: exp.description
          .split("\n")
          .filter((line) => line.trim().length > 0),
      })),
      education: formData.educations.map((edu) => ({
        institutionName: edu.school,
        degree: edu.degree,
        majorSubject: edu.field || undefined,
        startDate: edu.graduationDate,
        endDate: undefined,
        isCurrent: false,
      })),
      skills: formData.skills,
      languages: formData.languages,
      interests: [],
    };

    setCVData(tcvContent);
    router.push("/generate");
  };

  // Update form with extracted data when cvData is available
  useEffect(() => {
    if (!cvData) return;

    const formValues: ReviewFormData = {
      profileImage: cvData.personalInfo?.photoUrl ?? null,
      fullName: cvData.personalInfo?.fullName ?? "",
      email: cvData.personalInfo?.email ?? "",
      phone: cvData.personalInfo?.phoneNumber ?? "",
      address: cvData.personalInfo?.address ?? "",
      jobTitle: cvData.personalInfo?.role ?? "",
      website: cvData.personalInfo?.website ?? "",
      summary: cvData.personalInfo?.summary ?? "",
      languages: (cvData.languages ?? []).map((lang) => ({
        name: lang.name,
        proficiency: (lang.proficiency as "Native" | "Fluent" | "Intermediate" | "Basic") || "Fluent",
      })),
      skills: cvData.skills ?? [],
      experiences: (cvData.experiences ?? []).map((exp, idx) => ({
        id: `exp-${idx}`,
        title: exp.position ?? "",
        company: exp.companyName ?? "",
        startDate: exp.startDate ?? "",
        endDate: exp.endDate ?? "",
        description: (exp.description ?? []).join("\n"),
      })),
      educations: (cvData.education ?? []).map((edu, idx) => ({
        id: `edu-${idx}`,
        school: edu.institutionName ?? "",
        degree: edu.degree ?? "",
        field: edu.majorSubject ?? "",
        graduationDate: edu.endDate ?? edu.startDate ?? "",
      })),
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
      if (formData) {
        const tcvContent: TCVContent = {
          personalInfo: {
            fullName: formData.fullName || "",
            role: formData.jobTitle || "",
            email: formData.email || "",
            phoneNumber: formData.phone || "",
            address: formData.address || "",
            website: formData.website || "",
            summary: formData.summary || "",
            photoUrl: formData.profileImage || undefined,
          },
          experiences: formData.experiences.map((exp) => ({
            companyName: exp.company,
            position: exp.title,
            startDate: exp.startDate,
            endDate: exp.endDate || undefined,
            isCurrent: !exp.endDate || exp.endDate.trim() === "",
            description: exp.description
              .split("\n")
              .filter((line) => line.trim().length > 0),
          })),
          education: formData.educations.map((edu) => ({
            institutionName: edu.school,
            degree: edu.degree,
            majorSubject: edu.field || undefined,
            startDate: edu.graduationDate,
            endDate: undefined,
            isCurrent: false,
          })),
          skills: formData.skills,
          languages: formData.languages,
          interests: [],
        };
        setCVData(tcvContent);
      }
    }, 500);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [formData, setCVData]);

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

                <FormInput
                  name="jobTitle"
                  label="Job Title"
                  placeholder="Your current job title"
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

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="address"
                    label="Address"
                    placeholder="Street, City, Country"
                  />
                  <FormInput
                    name="website"
                    label="Website / Portfolio"
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
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

            <Button
              type="button"
              onClick={handleProceedToGenerate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Continue to template selection →
            </Button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
