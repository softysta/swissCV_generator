import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportCVAsPDF(
  element: HTMLElement,
  fileName: string = "CV.pdf"
): Promise<void> {
  // Save original styles
  const original = {
    position: element.style.position,
    left:     element.style.left,
    top:      element.style.top,
    zIndex:   element.style.zIndex,
  };

  // Temporarily bring into viewport — html2canvas requires this
  element.style.position = "fixed";
  element.style.left     = "0px";
  element.style.top      = "0px";
  element.style.zIndex   = "-1";

  try {
    const canvas = await html2canvas(element, {
      scale:           2,       // retina sharpness
      useCORS:         true,    // allow external photo URLs
      backgroundColor: "#ffffff",
      width:           794,
      height:          1123,
      logging:         false,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit:        "px",
      format:      [794, 1123],
    });

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      0, 0, 794, 1123
    );

    pdf.save(fileName);
  } finally {
    // Always restore original position
    element.style.position = original.position;
    element.style.left     = original.left;
    element.style.top      = original.top;
    element.style.zIndex   = original.zIndex;
  }
}