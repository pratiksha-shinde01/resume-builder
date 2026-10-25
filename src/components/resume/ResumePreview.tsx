
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

type PersonalInfo = {
  fullname?: string;
  email?: string;
  mobile?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
};

type Education = {
  institution?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
};

type WorkExperience = {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

type Project = {
  title?: string;
  description?: string;
  techstack?: string[];
  githubUrl?: string;
  LiveUrl?: string;
};

export type ResumePreviewData = {
  title?: string;
  summary?: string;
  personalInfo?: PersonalInfo;
  education?: Education[];
  workExperience?: WorkExperience[];
  projects?: Project[];
  skills?: string[];
  certifications?: string[];
};

type ResumePreviewProps = {
  resume: ResumePreviewData;
};

const sectionTitle: CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  borderBottom: "1px solid #D1D5DB",
  paddingBottom: "5px",
  marginBottom: "10px",
  color: "#18181B",
};

const itemTitle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#18181B",
};

const mutedText: CSSProperties = {
  fontSize: "10px",
  color: "#52525B",
};

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

function formatDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (!Number.isNaN(date.getTime()) && value.length > 7) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return value;
}

function hasContent(value?: string) {
  return Boolean(value?.trim());
}

function ResumeDocument({ resume }: ResumePreviewProps) {
  const info = resume.personalInfo ?? {};

  const education = (resume.education ?? []).filter(
    (item) => item.institution || item.degree
  );

  const experience = (resume.workExperience ?? []).filter(
    (item) =>
      item.company || item.position || item.description
  );

  const projects = (resume.projects ?? []).filter(
    (item) => item.title || item.description
  );

  const skills = resume.skills ?? [];
  const certifications = resume.certifications ?? [];
  const fullName = info.fullname?.trim() || "Your Name";

  const dateRange = (start?: string, end?: string) =>
    [formatDate(start), formatDate(end)]
      .filter(Boolean)
      .join(" – ");

  return (
    <article
      className="resume-paper mx-auto min-h-[1123px] w-[794px] bg-white p-[54px] text-zinc-900"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        overflowWrap: "anywhere",
        boxSizing: "border-box",
      }}
    >
      <header className="border-b-2 border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {fullName}
        </h1>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-600">
          {info.email && <span>{info.email}</span>}
          {info.mobile && <span>{info.mobile}</span>}
          {info.location && <span>{info.location}</span>}
        </div>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
          {info.linkedIn && (
            <a href={info.linkedIn} className="text-blue-700">
              LinkedIn
            </a>
          )}
          {info.github && (
            <a href={info.github} className="text-blue-700">
              GitHub
            </a>
          )}
          {info.portfolio && (
            <a href={info.portfolio} className="text-blue-700">
              Portfolio
            </a>
          )}
        </div>
      </header>

      {hasContent(resume.summary) && (
        <section className="mt-5">
          <h2 style={sectionTitle}>
            Professional Summary
          </h2>
          <p className="whitespace-pre-wrap text-[11px] leading-[1.6] text-zinc-700">
            {resume.summary}
          </p>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-5">
          <h2 style={sectionTitle}>Education</h2>
          <div className="space-y-3">
            {education.map((item, index) => (
              <div key={`${item.institution}-${index}`}>
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 style={itemTitle}>
                    {item.degree || "Degree"}
                  </h3>
                  <span style={mutedText}>
                    {dateRange(item.startDate, item.endDate)}
                  </span>
                </div>

                {item.institution && (
                  <p style={mutedText}>{item.institution}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-5">
          <h2 style={sectionTitle}>Work Experience</h2>
          <div className="space-y-3">
            {experience.map((item, index) => (
              <div key={`${item.company}-${index}`}>
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 style={itemTitle}>
                    {item.position || item.company}
                  </h3>
                  <span style={mutedText}>
                    {dateRange(item.startDate, item.endDate)}
                  </span>
                </div>

                {item.company && item.position && (
                  <p style={mutedText}>{item.company}</p>
                )}

                {hasContent(item.description) && (
                  <p className="mt-1 whitespace-pre-wrap text-[11px] leading-[1.6] text-zinc-700">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-5">
          <h2 style={sectionTitle}>Projects</h2>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={`${project.title}-${index}`}>
                <h3 style={itemTitle}>
                  {project.title || "Project"}
                </h3>

                {hasContent(project.description) && (
                  <p className="mt-1 whitespace-pre-wrap text-[11px] leading-[1.6] text-zinc-700">
                    {project.description}
                  </p>
                )}

                {project.techstack &&
                  project.techstack.length > 0 && (
                    <p className="mt-1 text-[10px] text-zinc-600">
                      <strong>Tech Stack:</strong>{" "}
                      {project.techstack.join(", ")}
                    </p>
                  )}

                <div className="mt-1 flex flex-wrap gap-3 text-[10px]">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className="text-blue-700"
                    >
                      GitHub
                    </a>
                  )}

                  {project.LiveUrl && (
                    <a
                      href={project.LiveUrl}
                      className="text-blue-700"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-5">
          <h2 style={sectionTitle}>Technical Skills</h2>
          <p className="text-[11px] leading-[1.8] text-zinc-700">
            {skills.join("  •  ")}
          </p>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-5">
          <h2 style={sectionTitle}>Certifications</h2>
          <ul className="list-disc space-y-1 pl-4 text-[11px] leading-[1.6] text-zinc-700">
            {certifications.map((certification, index) => (
              <li key={`${certification}-${index}`}>
                {certification}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export default function ResumePreview({
  resume,
}: ResumePreviewProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [fitZoom, setFitZoom] = useState(50);
  const [isDownloading, setIsDownloading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const focusViewportRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const updateFitZoom = useCallback(() => {
    const viewport = focusMode
      ? focusViewportRef.current
      : previewRef.current;

    if (!viewport || !documentRef.current) return;

    const availableWidth = Math.max(
      viewport.clientWidth - 24,
      100
    );

    const availableHeight = Math.max(
      viewport.clientHeight - 24,
      200
    );

    const pageHeight = Math.max(
      documentRef.current.scrollHeight,
      PAGE_HEIGHT
    );

    const scale = Math.min(
      availableWidth / PAGE_WIDTH,
      availableHeight / pageHeight,
      1
    );

    const percentage = Math.max(
      10,
      Math.min(100, Math.floor(scale * 100))
    );

    setFitZoom(percentage);
    setZoom(percentage);
  }, [focusMode]);

  useEffect(() => {
    const timer = window.setTimeout(updateFitZoom, 100);

    window.addEventListener("resize", updateFitZoom);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateFitZoom);
    };
  }, [updateFitZoom, resume]);

  useEffect(() => {
    if (!focusMode) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFocusMode(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusMode]);

  const openFocusMode = () => {
    setFocusMode(true);
    setZoom(fitZoom);
  };

  const closeFocusMode = () => {
    setFocusMode(false);
  };

  const zoomIn = () =>
    setZoom((current) => Math.min(current + 10, 150));

  const zoomOut = () =>
    setZoom((current) => Math.max(current - 10, 10));

const handleDownloadPDF = async () => {
  const element = downloadRef.current;

  if (!element || isDownloading) return;

  setIsDownloading(true);

  try {
    const [{ default: html2canvas }, { default: jsPDF }] =
      await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

    // Wait until fonts and layout are ready.
    await document.fonts.ready;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      logging: false,
      width: 794,
      height: element.scrollHeight,
      onclone: (clonedDocument) => {
        const clonedElement =
          clonedDocument.querySelector(
            "[data-resume-pdf-source]"
          ) as HTMLElement | null;

        if (clonedElement) {
          clonedElement.style.position = "static";
          clonedElement.style.left = "0";
          clonedElement.style.top = "0";
          clonedElement.style.width = "794px";
          clonedElement.style.background = "#ffffff";
        }
      },
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("Resume canvas is empty.");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imageData = canvas.toDataURL("image/jpeg", 0.98);

    // Split a long resume into A4 pages.
    const renderedPageHeight =
      (canvas.height * pageWidth) / canvas.width;

    let remainingHeight = renderedPageHeight;
    let position = 0;

    pdf.addImage(
      imageData,
      "JPEG",
      0,
      position,
      pageWidth,
      renderedPageHeight
    );

    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      position = remainingHeight - renderedPageHeight;
      pdf.addPage();

      pdf.addImage(
        imageData,
        "JPEG",
        0,
        position,
        pageWidth,
        renderedPageHeight
      );

      remainingHeight -= pageHeight;
    }

    const filename = `${
      (resume.personalInfo?.fullname || "my-resume")
        .trim()
        .replace(/[^a-z0-9-_]/gi, "-")
    }.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error("PDF download failed:", error);
    window.alert("PDF download nahi ho paya. Please try again.");
  } finally {
    setIsDownloading(false);
  }
};


  const zoomControls = (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#151515] px-3 py-2 print:hidden">
      <span className="text-xs font-medium text-gray-300">
        Zoom
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= 10}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-lg text-white transition hover:bg-white/10 disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-[42px] text-center text-xs tabular-nums text-gray-200">
          {zoom}%
        </span>

        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= 150}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-lg text-white transition hover:bg-white/10 disabled:opacity-40"
        >
          +
        </button>

        <button
          type="button"
          onClick={updateFitZoom}
          className="rounded-lg border border-violet-500/40 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/10"
        >
          Fit
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-w-0">
      {/* Preview toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-base font-semibold text-white">
            Live Preview
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Click the resume to focus
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
        >
          {isDownloading
            ? "Generating PDF..."
            : "Download PDF"}
        </button>
      </div>

      {zoomControls}

      {/* Normal preview */}
      <div
        ref={previewRef}
        className="mt-3 flex cursor-zoom-in justify-center overflow-hidden rounded-xl bg-[#292735] p-3 print:hidden"
        style={{
          height: "calc(100dvh - 250px)",
          minHeight: "320px",
          maxHeight: "850px",
        }}
      >
        <div
          onClick={openFocusMode}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openFocusMode();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open resume focus mode"
          className="h-fit origin-top"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <div
            ref={documentRef}
            className="resume-print-area bg-white shadow-2xl"
          >
            <ResumeDocument resume={resume} />
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-gray-500 print:hidden">
        Click the page to open Focus Mode · Press Esc to close
      </p>

      {/* Dedicated PDF source, separate from zoom and focus mode */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: `${PAGE_WIDTH}px`,
          background: "#ffffff",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
       <div
  ref={downloadRef}
  data-resume-pdf-source
  style={{
    width: `${PAGE_WIDTH}px`,
    background: "#ffffff",
  }}
>
  <ResumeDocument resume={resume} />
</div>
      </div>

      {/* Focus mode */}
      {focusMode && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/75 p-3 backdrop-blur-md sm:p-5 print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Resume focus mode"
        >
          <div className="mx-auto mb-3 flex w-full max-w-6xl items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Resume Focus
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Inspect your resume without distractions
              </p>
            </div>

            <button
              type="button"
              onClick={closeFocusMode}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20 sm:px-4"
            >
              ✕ <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          <div className="mx-auto mb-3 w-full max-w-6xl">
            {zoomControls}
          </div>

          <div
            ref={focusViewportRef}
            className="flex min-h-0 flex-1 justify-center overflow-auto rounded-xl border border-white/10 bg-[#24232D] p-3 sm:p-5"
          >
            <div
              className="h-fit origin-top"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                marginBottom: `${Math.max(0, zoom - 100) * 8}px`,
              }}
            >
              <div className="bg-white shadow-2xl">
                <ResumeDocument resume={resume} />
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            Press Esc or select Close to return to the editor
          </p>
        </div>
      )}

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden !important;
          }

          .resume-print-area,
          .resume-print-area * {
            visibility: visible !important;
          }

          .resume-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            overflow: visible !important;
            box-shadow: none !important;
            background: white !important;
          }

          .resume-paper {
            width: 210mm !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 14mm !important;
            box-sizing: border-box !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          a {
            color: #18181b !important;
            text-decoration: none !important;
          }

          section,
          article > header,
          article > section > div > div {
            break-inside: avoid;
          }

          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
