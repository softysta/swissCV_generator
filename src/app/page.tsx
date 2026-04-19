"use client";

import { useState } from "react";
import Link from "next/link";
import { CloudDownload, ExternalLink } from "lucide-react";

export default function UploadPage() {
  const [isDragActive, setIsDragActive] = useState(false);

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
    // Handle file upload logic here
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-6">
      <div className="flex flex-col items-center w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">
          Upload your CV
        </h1>
        <p className="text-zinc-600 mb-12 text-center">
          Upload the raw documents to begin the precision architectural process.
        </p>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${
            isDragActive
              ? "border-blue-600 bg-blue-50"
              : "border-zinc-300 bg-white hover:border-zinc-400"
          }`}
        >
          <CloudDownload className="w-12 h-12 text-zinc-400 mb-4" />
          <p className="text-lg font-semibold text-zinc-900 mb-1">
            Drop your CV here
          </p>
          <p className="text-sm text-zinc-500">PDF or DOCX (Max 10MB)</p>
        </div>

        {/* Primary Action Button */}
        <Link
          href="/extraction"
          className="w-full bg-[#003FB1] hover:bg-[#003FB1]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center mb-4"
        >
          Start AI Extraction →
        </Link>

        {/* Footer Note */}
        <p className="text-xs text-zinc-500 text-center mb-6">
          Please upload a CV to activate the precision engine.
        </p>

        {/* Or divider */}
        <div className="flex items-center gap-4 w-full my-6">
          <div className="flex-1 h-px bg-zinc-300" />
          <span className="text-sm text-zinc-500">or</span>
          <div className="flex-1 h-px bg-zinc-300" />
        </div>

        {/* Sketch Mode */}
        <div className="w-full bg-white border border-zinc-200 rounded-lg p-6 flex items-center justify-between hover:border-zinc-300 transition-colors">
          <div className="flex items-center gap-3">
            <ExternalLink className="w-6 h-6 text-zinc-600" />
            <div>
              <p className="font-semibold text-zinc-900">Create from Sketch</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                Create manually
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
