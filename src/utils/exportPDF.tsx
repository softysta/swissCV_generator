import html2canvas from "html2canvas";
import jsPDF from "jspdf";

async function waitForFonts(): Promise<void> {
  const fontFaceSet = (
    document as Document & {
      fonts?: { ready: Promise<unknown> };
    }
  ).fonts;

  if (fontFaceSet?.ready) {
    await fontFaceSet.ready;
  }

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export async function exportCVAsPDF(
  element: HTMLElement,
  fileName: string = "CV.pdf",
): Promise<void> {
  // Save original styles
  const original = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    zIndex: element.style.zIndex,
  };

  // Temporarily bring into viewport — html2canvas requires this
  element.style.position = "fixed";
  element.style.left = "0px";
  element.style.top = "0px";
  element.style.zIndex = "-1";

  try {
    await waitForFonts();

    const captureWidth = 794;
    const captureHeight = 1123;

    const canvas = await html2canvas(element, {
      scale: 2, // retina sharpness
      useCORS: true, // allow external photo URLs
      backgroundColor: "#ffffff",
      width: captureWidth,
      height: captureHeight,
      logging: false,
    } as any);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      0,
      0,
      pageWidth,
      pageHeight,
    );

    pdf.save(fileName);
  } finally {
    // Always restore original position
    element.style.position = original.position;
    element.style.left = original.left;
    element.style.top = original.top;
    element.style.zIndex = original.zIndex;
  }
}
