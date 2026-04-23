import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportCVAsPDF(
  element: HTMLElement,
  fileName: string = "CV.pdf",
): Promise<void> {
  const captureRoot = document.createElement("div");
  const clonedElement = element.cloneNode(true) as HTMLElement;

  captureRoot.style.position = "fixed";
  captureRoot.style.left = "-10000px";
  captureRoot.style.top = "0";
  captureRoot.style.width = "794px";
  captureRoot.style.height = "1123px";
  captureRoot.style.overflow = "hidden";
  captureRoot.style.pointerEvents = "none";

  clonedElement.style.width = "794px";
  clonedElement.style.minHeight = "1123px";

  captureRoot.appendChild(clonedElement);
  document.body.appendChild(captureRoot);

  try {
    await waitForAssets(clonedElement);

    const canvas = await html2canvas(clonedElement, {
      scale: 2, // retina sharpness
      useCORS: true, // allow external photo URLs
      backgroundColor: "#ffffff",
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      scrollX: 0,
      scrollY: 0,
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
    document.body.removeChild(captureRoot);
  }
}

async function waitForAssets(root: HTMLElement): Promise<void> {
  const fontFaceSet = (
    document as Document & { fonts?: { ready: Promise<unknown> } }
  ).fonts;

  if (fontFaceSet?.ready) {
    await fontFaceSet.ready;
  }

  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return;

      await new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    }),
  );

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
