"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCV } from "@/lib/CVContext";
import { useCVContext } from "@/store/CVContext";
import { ExtractionStep } from "@/lib/CVContext";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ExtractionPage() {
  const router = useRouter();
  const {
    file,
    setFile,
    extractionSteps,
    setExtractionSteps,
    isExtracting,
    setIsExtracting,
  } = useCV();
  const { setCVData: setStoreCVData } = useCVContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      router.push("/");
      return;
    }

    const extractCV = async () => {
      try {
        setIsExtracting(true);
        setError(null);

        // Step 1: Reading CV content
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 0 ? { ...step, status: "processing" as const } : step,
          ),
        );

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to extract CV");
        }

        const data = await response.json();

        // Step 1: Complete
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 0 ? { ...step, status: "done" as const } : step,
          ),
        );

        // Step 2: Extracting personal information
        await new Promise((resolve) => setTimeout(resolve, 500));
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 1 ? { ...step, status: "processing" as const } : step,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 1 ? { ...step, status: "done" as const } : step,
          ),
        );

        // Step 3: Rewriting in Swiss professional format
        await new Promise((resolve) => setTimeout(resolve, 500));
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 2 ? { ...step, status: "processing" as const } : step,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 2 ? { ...step, status: "done" as const } : step,
          ),
        );

        // Step 4: Smart-trimming content
        await new Promise((resolve) => setTimeout(resolve, 500));
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 3 ? { ...step, status: "processing" as const } : step,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setExtractionSteps((prev: ExtractionStep[]) =>
          prev.map((step, i) =>
            i === 3 ? { ...step, status: "done" as const } : step,
          ),
        );

        // Save extracted data to store context for review page
        setStoreCVData(data);
        setIsExtracting(false);

        // Redirect to review page after completion
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/review");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsExtracting(false);
      }
    };

    extractCV();
  }, [file, router, setStoreCVData, setExtractionSteps, setIsExtracting]);

  return (
    <main className="min-h-svh bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center w-full max-w-2xl">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-lg blur-md opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.5 1.5H5.25a2.25 2.25 0 0 0-2.25 2.25v13.5a2.25 2.25 0 0 0 2.25 2.25h9.5a2.25 2.25 0 0 0 2.25-2.25V8l-6.5-6.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-2">
          Analysing your CV...
        </h1>
        <p className="text-zinc-600 text-center mb-12 text-sm sm:text-base">
          Our AI architect is meticulously deconstructing your professional
          history to align with Swiss industry standards.
        </p>

        {/* Steps */}
        <div className="w-full space-y-3 mb-8">
          {extractionSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                step.status === "done"
                  ? "bg-green-50 border border-green-200"
                  : step.status === "processing"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-zinc-100 border border-zinc-200"
              }`}
            >
              <div className="shrink-0">
                {step.status === "done" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : step.status === "processing" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-blue-200 animate-spin"></div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-300"></div>
                )}
              </div>
              <p
                className={`flex-1 font-medium ${
                  step.status === "done"
                    ? "text-green-700"
                    : step.status === "processing"
                      ? "text-blue-700"
                      : "text-zinc-500"
                }`}
              >
                {step.name}
              </p>
              {step.status === "done" && (
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                  DONE
                </span>
              )}
              {step.status === "processing" && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  PROCESSING
                </span>
              )}
              {step.status === "waiting" && (
                <span className="text-xs font-semibold text-zinc-400 bg-zinc-200 px-2 py-1 rounded">
                  WAITING
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Security note */}
        <div className="w-full flex items-center gap-2 text-xs text-zinc-600 bg-blue-50 border border-blue-100 rounded-lg p-3 mb-8">
          <svg
            className="w-4 h-4 text-blue-600 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Your data is encrypted and processed according to Swiss GDPR
            standards.
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-medium text-red-900">Extraction Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                router.push("/");
              }}
              className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Info boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="font-semibold text-zinc-900 mb-1">Did you know?</p>
            <p className="text-xs text-zinc-600">
              The Swiss Standard CV focuses on precision and quantifiable
              results. Our AI is currently prioritizing bullet points to match
              high-tier recruiters' expectations.
            </p>
            <span className="text-xs font-bold text-blue-600 mt-3 inline-block">
              PRO TIP
            </span>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-8 h-8 text-green-600 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <p className="font-semibold text-green-900">High Speed</p>
              <p className="text-xs text-green-700">
                94% of resumes are processed in under 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
