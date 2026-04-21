"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudDownload, ExternalLink } from "lucide-react";
import { useCV } from "@/lib/CVContext";

export default function UploadPage() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setFile } = useCV();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF and DOCX are allowed.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setFileName(file.name);
    setFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleExtraction = () => {
    if (!fileName) {
      setError("Please upload a file first");
      return;
    }
    router.push("/extraction");
  };

  return (
    <main className="min-h-svh bg-zinc-50 flex flex-col items-center justify-start px-4 pt-6 pb-6 sm:pt-12 sm:pb-10">
      <div className="flex flex-col items-center w-full max-w-2xl md:pt-4 lg:pt-8">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 text-center">
          Upload your CV
        </h1>
        <p className="text-zinc-600 mb-8 sm:mb-10 md:mb-12 text-center max-w-xl">
          Upload the raw documents to begin the precision architectural process.
        </p>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-10 md:p-12 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${
            isDragActive
              ? "border-blue-600 bg-blue-50"
              : "border-zinc-300 bg-white hover:border-zinc-400"
          }`}
        >
          <CloudDownload className="w-12 h-12 text-zinc-400 mb-4" />
          {fileName ? (
            <>
              <p className="text-lg font-semibold text-zinc-900 mb-1">
                ✓ {fileName}
              </p>
              <p className="text-sm text-zinc-500">Ready for extraction</p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-zinc-900 mb-1">
                Drop your CV here
              </p>
              <p className="text-sm text-zinc-500">PDF or DOCX (Max 10MB)</p>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Primary Action Button */}
        <button
          onClick={handleExtraction}
          disabled={!fileName}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors text-center mb-4 ${
            fileName
              ? "bg-[#003FB1] hover:bg-[#003FB1]/90 text-white"
              : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
          }`}
        >
          Start AI Extraction →
        </button>

        {/* Footer Note */}
        <p className="text-xs text-zinc-500 text-center mb-6">
          {fileName
            ? "Click the button above to start the extraction process"
            : "Please upload a CV to activate the precision engine."}
        </p>

        {/* Or divider */}
        <div className="flex items-center gap-4 w-full my-6">
          <div className="flex-1 h-px bg-zinc-300" />
          <span className="text-sm text-zinc-500">or</span>
          <div className="flex-1 h-px bg-zinc-300" />
        </div>

        {/* Sketch Mode */}
        <Link
          href="/review"
          className="w-full bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 flex items-center justify-between hover:border-zinc-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-6 h-6 text-zinc-600" />
            <div>
              <p className="font-semibold text-zinc-900">Create from Sketch</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                Create manually
              </p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
