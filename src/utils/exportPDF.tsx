import { TCVContent, TTemplateId } from "@/types/cvContent.tye";

// lib/exportPDF.ts
export async function exportCVAsPDF(
  cvData: TCVContent,
  templateId: TTemplateId,
  fileName: string = "CV.pdf"
): Promise<void> {
  try {
    // Send data in request body (POST) to avoid URL size limits
    const response = await fetch("/api/generate-pdf?template=" + templateId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cvData),
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (_) {}
      throw new Error(`Failed to generate PDF: ${errorMessage}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}