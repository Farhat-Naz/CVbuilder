export function downloadResumeAsPDF(elementId: string, filename: string = "resume") {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Resume preview not found");

  const styleId = "print-resume-style";
  const existing = document.getElementById(styleId);
  if (existing) existing.remove();

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    @media print {
      body * { visibility: hidden !important; }
      #${elementId}, #${elementId} * { visibility: visible !important; }
      #${elementId} {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: auto !important;
        transform: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: visible !important;
      }
      @page { margin: 0; size: A4 portrait; }
    }
  `;
  document.head.appendChild(style);

  const prevTitle = document.title;
  document.title = filename;

  window.print();

  document.title = prevTitle;
  style.remove();
}
