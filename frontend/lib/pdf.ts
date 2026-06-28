export async function downloadResumeAsPDF(elementId: string, filename: string = "resume") {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Resume preview not found");

  // Dynamic imports avoid SSR issues
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  // html2canvas breaks with transform + overflow-hidden — temporarily neutralize them
  const prevTransform = element.style.transform;
  const prevOverflow = element.style.overflow;
  const prevBorderRadius = element.style.borderRadius;
  element.style.transform = "none";
  element.style.overflow = "visible";
  element.style.borderRadius = "0";

  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
    });
  } finally {
    element.style.transform = prevTransform;
    element.style.overflow = prevOverflow;
    element.style.borderRadius = prevBorderRadius;
  }

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename || "resume"}.pdf`);
}
