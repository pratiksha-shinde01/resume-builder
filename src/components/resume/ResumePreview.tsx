
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

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

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 54;
const PAGE_CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING * 2;

const sectionHeading =
  "mb-3 border-b border-slate-200 pb-2 text-[11px] font-bold uppercase tracking-[1.8px] text-black";

const itemHeading = "text-[12px] font-bold leading-5 text-slate-900";

const bodyText =
  "whitespace-pre-wrap break-words text-[11px] leading-[1.7] text-slate-700";

const mutedText = "text-[10px] leading-relaxed text-slate-500";

function hasContent(value?: string) {
  return Boolean(value?.trim());
}

function formatDate(value?: string) {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);

  if (match) {
    const month = Number(match[2]) - 1;

    if (month >= 0 && month < 12) {
      return `${new Date(2000, month, 1).toLocaleString("en-US", {
        month: "short",
      })} ${match[1]}`;
    }
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
}

function dateRange(start?: string, end?: string) {
  return [formatDate(start), formatDate(end)].filter(Boolean).join(" – ");
}

function cleanUrl(value?: string) {
  if (!value?.trim()) return undefined;

  const url = value.trim();

  if (/^https?:\/\//i.test(url)) return url;

  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(url)) {
    return `https://${url}`;
  }

  return undefined;
}

function ResumeDocument({ resume }: ResumePreviewProps) {
  const info = resume.personalInfo ?? {};

  const education = (resume.education ?? []).filter(
    (item) => item.institution || item.degree
  );

  const experience = (resume.workExperience ?? []).filter(
    (item) => item.company || item.position || item.description
  );

  const projects = (resume.projects ?? []).filter(
    (item) => item.title || item.description
  );

  const skills = (resume.skills ?? []).filter(hasContent);
  const certifications = (resume.certifications ?? []).filter(hasContent);

  const fullName = info.fullname?.trim() || "Your Name";

  const [pages, setPages] = useState<string[][]>([]);
  const [layoutReady, setLayoutReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: "LinkedIn", url: cleanUrl(info.linkedIn) },
    { label: "GitHub", url: cleanUrl(info.github) },
    { label: "Portfolio", url: cleanUrl(info.portfolio) },
  ].filter((item) => item.url);

  const header = (
    <header className="mb-6 border-b-2 border-indigo-700 pb-5">
      <h1 className="break-words text-[28px] font-extrabold leading-tight tracking-tight text-slate-950">
        {fullName}
      </h1>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] leading-relaxed text-slate-600">
        {info.email && <span>{info.email}</span>}
        {info.mobile && <span>{info.mobile}</span>}
        {info.location && <span>{info.location}</span>}
      </div>

      {links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium text-indigo-700">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );

  const sections: ReactNode[] = [];

  if (hasContent(resume.summary)) {
    sections.push(
      <section
        key="summary"
        data-resume-section
        className="resume-section mt-5"
      >
        <h2 className={sectionHeading}>Professional Summary</h2>
        <p className={bodyText}>{resume.summary}</p>
      </section>
    );
  }

  if (experience.length) {
    sections.push(
      <section
        key="experience"
        data-resume-section
        className="resume-section mt-5"
      >
        <h2 className={sectionHeading}>Work Experience</h2>

        <div className="space-y-4">
          {experience.map((item, index) => (
            <div key={`${item.company}-${index}`} className="resume-entry">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className={itemHeading}>
                  {item.position || item.company || "Experience"}
                </h3>

                {dateRange(item.startDate, item.endDate) && (
                  <span className={mutedText}>
                    {dateRange(item.startDate, item.endDate)}
                  </span>
                )}
              </div>

              {item.company &&
                item.position &&
                item.company.trim().toLowerCase() !==
                  item.position.trim().toLowerCase() && (
                  <p className={mutedText}>{item.company}</p>
                )}

              {hasContent(item.description) && (
                <p className={`${bodyText} mt-1.5`}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (education.length) {
    sections.push(
      <section
        key="education"
        data-resume-section
        className="resume-section mt-5"
      >
        <h2 className={sectionHeading}>Education</h2>

        <div className="space-y-3">
          {education.map((item, index) => (
            <div
              key={`${item.institution}-${index}`}
              className="resume-entry"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className={itemHeading}>
                  {item.degree || "Degree"}
                </h3>

                {dateRange(item.startDate, item.endDate) && (
                  <span className={mutedText}>
                    {dateRange(item.startDate, item.endDate)}
                  </span>
                )}
              </div>

              {item.institution && (
                <p className={`${mutedText} mt-0.5`}>
                  {item.institution}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (projects.length) {
    sections.push(
      <section
        key="projects"
        data-resume-section
        className="resume-section mt-5"
      >
        <h2 className={sectionHeading}>Projects</h2>

        <div className="space-y-4">
          {projects.map((project, index) => {
            const github = cleanUrl(project.githubUrl);
            const live = cleanUrl(project.LiveUrl);

            return (
              <div
                key={`${project.title}-${index}`}
                className="resume-entry"
              >
                <h3 className={itemHeading}>
                  {project.title || "Project"}
                </h3>

                {hasContent(project.description) && (
                  <p className={`${bodyText} mt-1`}>
                    {project.description}
                  </p>
                )}

                {project.techstack?.length ? (
                  <p className={`${mutedText} mt-1.5 break-words`}>
                    <span className="font-bold text-slate-700">
                      Technologies:
                    </span>{" "}
                    {project.techstack.join(", ")}
                  </p>
                ) : null}

                {(github || live) && (
                  <div className="mt-1.5 flex flex-wrap gap-4 text-[10px] font-medium text-indigo-700">
                    {github && (
                      <a href={github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}

                    {live && (
                      <a href={live} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (skills.length) {
    sections.push(
      <section
        key="skills"
        data-resume-section
        className="resume-section mt-5"
      >
        <h2 className={sectionHeading}>Technical Skills</h2>
        <p className="break-words text-[11px] leading-[1.9] text-slate-700">
          {skills.join("  •  ")}
        </p>
      </section>
    );
  }

  if (certifications.length) {
    sections.push(
      <section
        key="certifications"
        data-resume-section
        className="resume-section mt-5"
      >
        <h2 className={sectionHeading}>Certifications</h2>

        <ul className="list-disc space-y-1.5 pl-4 text-[11px] leading-relaxed text-slate-700">
          {certifications.map((certification, index) => (
            <li key={`${certification}-${index}`}>{certification}</li>
          ))}
        </ul>
      </section>
    );
  }

  const buildPages = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const measuredHeader =
      root.querySelector<HTMLElement>("[data-measure-header]");

    const source =
      root.querySelector<HTMLElement>("[data-measure-sections]");

    if (!measuredHeader || !source) return;

    const headerHeight = measuredHeader.getBoundingClientRect().height;
    const availableHeight = PAGE_HEIGHT - PAGE_PADDING * 2 - 38;

    const sectionElements = Array.from(
      source.querySelectorAll<HTMLElement>(
        ":scope > [data-resume-section]"
      )
    );

    const newPages: string[][] = [];
    let currentPage: string[] = [];
    let usedHeight = headerHeight + 24;

    for (const section of sectionElements) {
      const style = window.getComputedStyle(section);

      const sectionHeight =
        section.getBoundingClientRect().height +
        (parseFloat(style.marginTop) || 0) +
        (parseFloat(style.marginBottom) || 0);

      if (
        currentPage.length > 0 &&
        usedHeight + sectionHeight > availableHeight
      ) {
        newPages.push(currentPage);
        currentPage = [];
        usedHeight = 0;
      }

      currentPage.push(section.outerHTML);
      usedHeight += sectionHeight;
    }

    if (currentPage.length) newPages.push(currentPage);

    setPages(newPages.length ? newPages : [[]]);
    setLayoutReady(true);
  }, []);

  useEffect(() => {
    setLayoutReady(false);

    let frameOne = 0;
    let frameTwo = 0;

    frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(buildPages);
    });

    const root = rootRef.current;
    const observer = new ResizeObserver(() => buildPages());

    if (root) observer.observe(root);

    document.fonts.ready.then(() => buildPages());

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
      observer.disconnect();
    };
  }, [buildPages, resume]);

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0"
        style={{ width: PAGE_CONTENT_WIDTH }}
      >
        <div data-measure-header>{header}</div>
        <div data-measure-sections>{sections}</div>
      </div>

      {!layoutReady ? (
        <article
          className="resume-paper relative mx-auto bg-white text-slate-900 shadow-xl"
          style={{
            width: PAGE_WIDTH,
            minHeight: PAGE_HEIGHT,
            padding: PAGE_PADDING,
            boxSizing: "border-box",
          }}
        >
          {header}
          <div>{sections}</div>
        </article>
      ) : (
        <div className="flex w-full min-w-0 flex-col items-center gap-6">
          {pages.map((page, index) => (
            <article
              key={index}
              className="resume-paper relative mx-auto flex flex-col bg-white text-slate-900 shadow-xl"
              style={{
                width: PAGE_WIDTH,
                minHeight: PAGE_HEIGHT,
                padding: PAGE_PADDING,
                boxSizing: "border-box",
              }}
            >
              {index === 0 && header}

              <div
                className="resume-page-content flex-1"
                dangerouslySetInnerHTML={{ __html: page.join("") }}
              />

              <footer className="mt-6 flex justify-between border-t border-slate-200 pt-3 text-[9px] font-medium tracking-wider text-slate-400">
                <span>RESUME</span>
                <span>
                  PAGE {index + 1} OF {pages.length}
                </span>
              </footer>
            </article>
          ))}
        </div>
      )}

      <style jsx global>{`
        .resume-paper {
          font-family: Arial, Helvetica, sans-serif;
          overflow-wrap: anywhere;
        }

        .resume-entry {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          .resume-paper {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            break-after: page;
            page-break-after: always;
          }

          .resume-paper:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const [zoom, setZoom] = useState(85);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const scale = zoom / 100;
  const scaledPageWidth = PAGE_WIDTH * scale;
  const scaledPageHeight = PAGE_HEIGHT * scale;

  const zoomIn = () => {
    setZoom((current) => Math.min(150, current + 10));
  };

  const zoomOut = () => {
    setZoom((current) => Math.max(30, current - 10));
  };

  const updateFitZoom = useCallback(() => {
    const container = previewRef.current;
    if (!container) return;

    const availableWidth = Math.max(container.clientWidth - 40, 100);
    const fit = Math.floor((availableWidth / PAGE_WIDTH) * 100);

    setZoom(Math.min(100, Math.max(30, fit)));
  }, []);

  useEffect(() => {
    updateFitZoom();

    const container = previewRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => updateFitZoom());
    observer.observe(container);

    return () => observer.disconnect();
  }, [updateFitZoom]);

  useEffect(() => {
    if (!isFocusMode) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFocusMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocusMode]);

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

      await document.fonts.ready;

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const pages = Array.from(
        element.querySelectorAll<HTMLElement>(".resume-paper")
      );

      if (!pages.length) {
        throw new Error("Resume pages are not ready.");
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let index = 0; index < pages.length; index++) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          windowWidth: PAGE_WIDTH,
          logging: false,
        });

        if (index > 0) pdf.addPage();

        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.98),
          "JPEG",
          0,
          0,
          210,
          297
        );
      }

      const filename = (resume.personalInfo?.fullname || "my-resume")
        .trim()
        .replace(/[^a-z0-9-_]/gi, "-");

      pdf.save(`${filename || "my-resume"}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
      window.alert("PDF download nahi ho paya. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Preview heading and download */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            Live Preview
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Clean, professional A4 resume
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Normal preview zoom controls */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#151515] px-3 py-2.5">
        <span className="text-xs font-medium text-gray-300">
          Preview zoom
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 30}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-lg text-white transition hover:bg-white/10 disabled:opacity-40"
          >
            −
          </button>

          <span className="min-w-[42px] text-center text-xs tabular-nums text-white">
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

      {/* Normal preview */}
      <div
        ref={previewRef}
        className="w-full min-w-0 overflow-auto rounded-2xl border border-white/10 bg-[#24232d] p-3 sm:p-5"
      >
        <div
          className="relative mx-auto"
          style={{
            width: scaledPageWidth,
            height: scaledPageHeight,
          }}
        >
          <div
            className="absolute left-0 top-0 cursor-zoom-in"
            style={{
              width: PAGE_WIDTH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            onClick={() => setIsFocusMode(true)}
            role="button"
            tabIndex={0}
            aria-label="Open resume focus preview"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsFocusMode(true);
              }
            }}
          >
            <ResumeDocument resume={resume} />
          </div>
        </div>
      </div>

      {/* Focus mode backdrop */}
      {isFocusMode && (
        <div
          className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
          onClick={() => setIsFocusMode(false)}
          aria-hidden="true"
        />
      )}

      {/* Focus mode */}
      {isFocusMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resume focus preview"
          className="fixed inset-0 z-[9999] flex flex-col overflow-y-auto bg-[#111111]/95 px-3 py-4 sm:px-6 sm:py-6"
        >
          <div className="sticky top-0 z-10 mx-auto mb-5 flex w-full max-w-5xl shrink-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#191919]/95 px-4 py-3 shadow-lg backdrop-blur">
            <div>
              <p className="text-sm font-semibold text-white">
                Resume Preview
              </p>
              <p className="text-xs text-gray-400">
                Press Esc to close
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 30}
                aria-label="Zoom out"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-40"
              >
                −
              </button>

              <span className="min-w-[42px] text-center text-xs text-white">
                {zoom}%
              </span>

              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= 150}
                aria-label="Zoom in"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-40"
              >
                +
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-50 sm:px-4 sm:text-sm"
              >
                {isDownloading ? "Generating..." : "Download PDF"}
              </button>

              <button
                type="button"
                onClick={() => setIsFocusMode(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/10"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-6 overflow-x-auto pb-8">
            <div
              className="relative shrink-0"
              style={{
                width: scaledPageWidth,
                height: scaledPageHeight,
              }}
            >
              <div
                style={{
                  width: PAGE_WIDTH,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <ResumeDocument resume={resume} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Separate hidden source for PDF generation */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 -z-10"
        style={{ width: PAGE_WIDTH, opacity: 0 }}
      >
        <div ref={downloadRef} style={{ width: PAGE_WIDTH }}>
          <ResumeDocument resume={resume} />
        </div>
      </div>
    </div>
  );
}
