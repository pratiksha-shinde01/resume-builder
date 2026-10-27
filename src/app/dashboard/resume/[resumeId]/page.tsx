
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

import PersonalInfoSection, {
  type PersonalInfo,
} from "@/components/resume/PersonalInfoSection";
import EducationSection, {
  type Education,
} from "@/components/resume/EducationSection";
import WorkExperienceSection, {
  type WorkExperience,
} from "@/components/resume/WorkExperienceSection";
import ProjectsSection, {
  type Project,
} from "@/components/resume/ProjectsSection";
import SkillsSection from "@/components/resume/SkillsSection";
import CertificationsSection from "@/components/resume/CertificationsSection";
import ResumePreview from "@/components/resume/ResumePreview";

import GenerateSummary from "@/components/ai/GenerateSummary";
import ImproveContent from "@/components/ai/ImproveContent";
import GenerateSkills from "@/components/ai/GenerateSkills";
import GenerateProjectDescription from "@/components/ai/GenerateProjectDescription";
import GenerateExperienceDescription from "@/components/ai/GenerateExperienceDescription";
import GenerateATSScore from "@/components/ai/GenerateATSScore";

import type { ICertification } from "@/types/resume.types";

type Resume = {
  _id: string;
  title?: string;
  summary?: string;
  personalInfo?: Partial<PersonalInfo>;
  education?: Education[];
  workExperience?: WorkExperience[];
  skills?: string[];
  projects?: Project[];
  certifications?: ICertification[];
};

const emptyPersonalInfo: PersonalInfo = {
  fullname: "",
  email: "",
  mobile: "",
  location: "",
  linkedIn: "",
  github: "",
  portfolio: "",
};

const inputClass =
  "w-full rounded-xl border border-[#353047] bg-[#0D0C14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#777286] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm font-medium text-[#D8D4E5]";

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#9994AC]">{description}</p>
    </div>
  );
}

export default function ResumeEditorPage() {
  const params = useParams<{ resumeId: string }>();
  const router = useRouter();
  const resumeId = params.resumeId;

  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(emptyPersonalInfo);
  const [education, setEducation] = useState<Education[]>([]);
  const [workExperience, setWorkExperience] =
    useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<ICertification[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingPersonalInfo, setSavingPersonalInfo] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/resume/${resumeId}`);

      if (!response.data.success) {
        setError(response.data.message || "Could not load your resume.");
        return;
      }

      const data: Resume =
        response.data.data?.resume ?? response.data.data;

      if (!data?._id) {
        setError("Resume data was not returned by the server.");
        return;
      }

      setResume(data);
      setResumeTitle(data.title ?? "");
      setSummary(data.summary ?? "");
      setPersonalInfo({
        ...emptyPersonalInfo,
        ...(data.personalInfo ?? {}),
      });
      setEducation(data.education ?? []);
      setWorkExperience(data.workExperience ?? []);
      setProjects(data.projects ?? []);
      setSkills(data.skills ?? []);

      // Support both older string certifications and the new object format.
      setCertifications(
        (data.certifications ?? []).map((cert) =>
          typeof cert === "string"
            ? { name: cert, organization: "", issueDate: "" }
            : {
                name: cert.name ?? "",
                organization: cert.organization ?? "",
                issueDate: cert.issueDate ?? "",
              }
        )
      );
    } catch (err) {
      console.error("Fetch resume error:", err);
      setError("Unable to load resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    if (resumeId) void fetchResume();
  }, [resumeId, fetchResume]);

  function clearFeedback() {
    setError("");
    setMessage("");
  }

  const resumeText = [
    `Resume Title: ${resumeTitle}`,
    `Name: ${personalInfo.fullname}`,
    `Email: ${personalInfo.email}`,
    `Mobile: ${personalInfo.mobile}`,
    `Location: ${personalInfo.location}`,
    `LinkedIn: ${personalInfo.linkedIn}`,
    `GitHub: ${personalInfo.github}`,
    `Portfolio: ${personalInfo.portfolio}`,
    `Professional Summary:\n${summary}`,
    `Education:\n${education
      .map(
        (item) =>
          `${item.degree} at ${item.institution}, ${item.startDate} - ${item.endDate ?? ""}`
      )
      .join("\n")}`,
    `Work Experience:\n${workExperience
      .map(
        (item) =>
          `${item.position} at ${item.company}, ${item.startDate} - ${item.endDate ?? ""}\n${item.description}`
      )
      .join("\n")}`,
    `Projects:\n${projects
      .map(
        (item) =>
          `${item.title}\n${item.description}\nTech Stack: ${item.techstack?.join(", ")}\nGitHub: ${item.githubUrl ?? ""}\nLive URL: ${item.LiveUrl ?? ""}`
      )
      .join("\n")}`,
    `Skills: ${skills.join(", ")}`,
    `Certifications:\n${certifications
      .map(
        (cert) =>
          `${cert.name} - ${cert.organization ?? ""} - ${cert.issueDate ?? ""}`
      )
      .join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  function handleSummaryChange(updatedSummary: string) {
    setSummary(updatedSummary);
    setResume((previous) =>
      previous ? { ...previous, summary: updatedSummary } : previous
    );
    clearFeedback();
  }

  function updatePersonalInfo(
    field: keyof PersonalInfo,
    value: string
  ) {
    setPersonalInfo((previous) => ({
      ...previous,
      [field]: value,
    }));
    clearFeedback();
  }

  async function handleSaveTitle() {
    try {
      setSavingTitle(true);
      clearFeedback();

      const updatedTitle = resumeTitle.trim();
      const response = await api.patch(`/resume/${resumeId}`, {
        title: updatedTitle,
      });

      if (!response.data.success) {
        setError(response.data.message || "Could not save resume title.");
        return;
      }

      setResume((previous) =>
        previous ? { ...previous, title: updatedTitle } : previous
      );
      setMessage("Resume title saved successfully!");
    } catch (err) {
      console.error("Save title error:", err);
      setError("Unable to save resume title. Please try again.");
    } finally {
      setSavingTitle(false);
    }
  }

  async function handleSavePersonalInfo() {
    try {
      setSavingPersonalInfo(true);
      clearFeedback();

      const response = await api.patch(`/resume/${resumeId}`, {
        title: resumeTitle.trim(),
        personalInfo,
      });

      if (!response.data.success) {
        setError(
          response.data.message || "Could not save personal information."
        );
        return;
      }

      setResume((previous) =>
        previous
          ? {
              ...previous,
              title: resumeTitle.trim(),
              personalInfo: { ...personalInfo },
            }
          : previous
      );
      setMessage("Personal information saved successfully!");
    } catch (err) {
      console.error("Save personal information error:", err);
      setError("Unable to save personal information. Please try again.");
    } finally {
      setSavingPersonalInfo(false);
    }
  }

  function handleEducationSaved(savedEducation: Education[]) {
    setEducation(savedEducation);
    setResume((previous) =>
      previous ? { ...previous, education: savedEducation } : previous
    );
  }

  function handleWorkExperienceSaved(saved: WorkExperience[]) {
    setWorkExperience(saved);
    setResume((previous) =>
      previous ? { ...previous, workExperience: saved } : previous
    );
  }

  function handleProjectsSaved(saved: Project[]) {
    setProjects(saved);
    setResume((previous) =>
      previous ? { ...previous, projects: saved } : previous
    );
  }

  function handleSkillsSaved(saved: string[]) {
    setSkills(saved);
    setResume((previous) =>
      previous ? { ...previous, skills: saved } : previous
    );
  }

  function handleCertificationsSaved(saved: ICertification[]) {
    setCertifications(saved);
    setResume((previous) =>
      previous ? { ...previous, certifications: saved } : previous
    );
  }

  async function handleGeneratedSkills(generatedSkills: string[]) {
    const mergedSkills = [
      ...new Map(
        [...skills, ...generatedSkills]
          .map((skill) => skill.trim())
          .filter(Boolean)
          .map((skill) => [skill.toLowerCase(), skill] as const)
      ).values(),
    ];

    try {
      clearFeedback();

      const response = await api.patch(`/resume/${resumeId}`, {
        skills: mergedSkills,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save generated skills."
        );
      }

      const savedSkills: string[] =
        response.data.data?.skills ?? mergedSkills;

      handleSkillsSaved(savedSkills);
      setMessage("AI-generated skills saved successfully!");
    } catch (err) {
      console.error("Save generated skills error:", err);
      setError("Skills could not be saved. Please try again.");
    }
  }

async function handleGeneratedProjectDescription(data: {
  title: string;
  description: string;
}) {
  const title = data.title.trim();
  const description = data.description.trim();

  if (!title || !description) {
    setError("Project title and description are required.");
    return;
  }

  try {
    clearFeedback();

    const resumeResponse = await api.get(`/resume/${resumeId}`);

    if (!resumeResponse.data?.success) {
      throw new Error("Could not fetch the latest resume.");
    }

    const resumeData =
      resumeResponse.data.data?.resume ?? resumeResponse.data.data;

    const existingProjects: Project[] = resumeData.projects ?? [];

    let updatedProjects: Project[];

    if (existingProjects.length === 0) {
      updatedProjects = [
        {
          title,
          description,
          techstack: [],
          githubUrl: "",
          LiveUrl: "",
        } as Project,
      ];
    } else {
      updatedProjects = existingProjects.map((project, index) =>
        index === existingProjects.length - 1
          ? { ...project, title, description }
          : project
      );
    }

    const response = await api.patch(`/resume/${resumeId}`, {
      projects: updatedProjects,
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Could not save the generated project."
      );
    }

    const savedProjects: Project[] =
      response.data.data?.projects ?? updatedProjects;

    handleProjectsSaved(savedProjects);
    setMessage("Project title and description saved successfully!");
  } catch (err) {
    console.error("Save generated project error:", err);
    setError(
      err instanceof Error
        ? err.message
        : "Project could not be saved. Please try again."
    );
  }
}


  async function handleGeneratedExperienceDescription(
    description: string
  ) {
    if (workExperience.length === 0) {
      setError(
        "Add a work experience entry in Manual Editor before generating its description."
      );
      return;
    }

    const updatedExperiences = [...workExperience];
    const lastIndex = updatedExperiences.length - 1;

    updatedExperiences[lastIndex] = {
      ...updatedExperiences[lastIndex],
      description,
    };

    try {
      clearFeedback();

      const response = await api.patch(`/resume/${resumeId}`, {
        workExperience: updatedExperiences,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Could not save work experience description."
        );
      }

      const savedExperiences: WorkExperience[] =
        response.data.data?.workExperience ?? updatedExperiences;

      handleWorkExperienceSaved(savedExperiences);
      setMessage("Work experience description saved successfully!");
    } catch (err) {
      console.error("Save experience description error:", err);
      setError("Work experience description could not be saved.");
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#09090F] px-4 py-12 text-white sm:px-6">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.08] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-8 h-5 w-36 animate-pulse rounded bg-violet-500/20" />
          <div className="h-10 w-72 max-w-full animate-pulse rounded-lg bg-white/[0.07]" />
          <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/[0.05]" />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="h-[420px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#12111B]" />
            <div className="h-[420px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#12111B]" />
          </div>

          <p className="mt-6 text-center text-sm text-[#A5A1B5]">
            Preparing your resume workspace...
          </p>
        </div>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090F] px-4 py-12 text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.08] blur-[120px]" />

        <section className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#12111B] p-6 shadow-2xl shadow-black/30 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-xl text-red-300">
            !
          </div>
          <h1 className="mt-5 text-2xl font-semibold">
            Unable to open resume
          </h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-red-300">
            {error || "Resume not found."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchResume()}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border border-[#353047] px-5 py-3 text-sm font-medium text-[#D8D4E5] transition hover:bg-white/[0.04]"
            >
              Back to dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0B0D19] px-4 py-5 text-white selection:bg-violet-500/30 sm:px-6 lg:px-8 lg:py-7">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[440px] w-[440px] rounded-full bg-violet-600/[0.07] blur-[140px]" />
        <div className="absolute -right-40 top-[30%] h-[420px] w-[420px] rounded-full bg-indigo-500/[0.05] blur-[140px]" />
        <div className="absolute -bottom-48 left-[28%] h-[350px] w-[350px] rounded-full bg-purple-500/[0.04] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-[#A5A1B5] transition hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-lg transition group-hover:border-violet-400/30 group-hover:bg-violet-500/10">
                ←
              </span>
              Back to dashboard
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-extrabold shadow-lg shadow-violet-950/30">
                R
              </div>
              <span className="text-sm font-bold tracking-tight">
                Resumi<span className="text-violet-400">FY</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 pt-7 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Resume workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Build a resume that
                <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  opens new doors.
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A5A1B5] sm:text-base">
                Craft your story, refine your experience and create a
                professional resume with AI assistance.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#12111B]/90 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
                📄
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#8D879F]">CURRENT DOCUMENT</p>
                <p className="mt-1 max-w-[220px] truncate text-sm font-semibold text-white">
                  {resumeTitle.trim() || "Untitled Resume"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-7 rounded-2xl border border-white/[0.08] bg-[#111019]/90 p-2 shadow-lg shadow-black/10">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={!isEditing}
              onClick={() => {
                setIsEditing(false);
                clearFeedback();
              }}
              className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition duration-200 sm:p-5 ${
                !isEditing
                  ? "border-violet-400/30 bg-gradient-to-br from-violet-500/[0.13] to-indigo-500/[0.05]"
                  : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.025]"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                  !isEditing
                    ? "bg-violet-500/15 text-violet-200"
                    : "bg-white/[0.05] text-[#A5A1B5]"
                }`}
              >
                ✨
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                  AI writing studio
                  {!isEditing && (
                    <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                      SELECTED
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block text-xs leading-5 text-[#9994AC] sm:text-sm">
                  Generate content, improve wording and check ATS compatibility.
                </span>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={isEditing}
              onClick={() => {
                setIsEditing(true);
                clearFeedback();
              }}
              className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition duration-200 sm:p-5 ${
                isEditing
                  ? "border-violet-400/30 bg-gradient-to-br from-violet-500/[0.13] to-indigo-500/[0.05]"
                  : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.025]"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                  isEditing
                    ? "bg-violet-500/15 text-violet-200"
                    : "bg-white/[0.05] text-[#A5A1B5]"
                }`}
              >
                ✍️
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                  Manual editor
                  {isEditing && (
                    <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                      SELECTED
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block text-xs leading-5 text-[#9994AC] sm:text-sm">
                  Manage your details, education, experience, projects and skills.
                </span>
              </span>
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.07] p-4 text-sm text-red-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-400/20">
              !
            </span>
            <p className="pt-0.5 leading-5">{error}</p>
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/20">
              ✓
            </span>
            <p className="pt-0.5 leading-5">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-8">
          <section className="min-w-0 space-y-5">
            {!isEditing ? (
              <>
                <div className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
                      ✦
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        AI content assistant
                      </h2>
                      <p className="mt-1.5 text-sm leading-6 text-[#9994AC]">
                        Use AI to create polished, job-focused content. Add
                        project or work experience entries in Manual Editor
                        before generating their descriptions.
                      </p>
                    </div>
                  </div>
                </div>

                <GenerateSummary
                  resumeId={resumeId}
                  skills={skills}
                  initialSummary={summary}
                  onSummaryChange={handleSummaryChange}
                />

                <ImproveContent
                  initialContent={summary}
                  onApply={handleSummaryChange}
                />

                <GenerateSkills onApply={handleGeneratedSkills} />

                <GenerateProjectDescription
                  onApply={handleGeneratedProjectDescription}
                />

                <GenerateExperienceDescription
                  onApply={handleGeneratedExperienceDescription}
                />

                <GenerateATSScore resumeText={resumeText} />
              </>
            ) : (
              <>
                <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="01 · Document"
                    title="Resume details"
                    description="Choose a clear title so you can identify this resume easily."
                  />

                  <label htmlFor="resumeTitle" className={labelClass}>
                    Resume title
                  </label>

                  <input
                    id="resumeTitle"
                    value={resumeTitle}
                    onChange={(event) => {
                      setResumeTitle(event.target.value);
                      clearFeedback();
                    }}
                    placeholder="e.g. Frontend Developer Resume"
                    className={inputClass}
                    maxLength={100}
                  />

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#777286]">
                      {resumeTitle.length}/100 characters
                    </span>

                    <button
                      type="button"
                      onClick={() => void handleSaveTitle()}
                      disabled={savingTitle}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingTitle ? "Saving..." : "Save title"}
                      {!savingTitle && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="02 · Contact"
                    title="Personal information"
                    description="Add accurate contact details so recruiters can reach you."
                  />
                  <PersonalInfoSection
                    personalInfo={personalInfo}
                    onChange={updatePersonalInfo}
                    onSave={() => void handleSavePersonalInfo()}
                    saving={savingPersonalInfo}
                  />
                </section>

                
                <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="06 · Expertise"
                    title="Skills"
                    description="List the relevant technical skills for your target role."
                  />
                  <SkillsSection
                    resumeId={resumeId}
                    skills={skills}
                    onSkillsChange={setSkills}
                    onSaved={handleSkillsSaved}
                  />
                </section>
                         <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="05 · Portfolio"
                    title="Projects"
                    description="Present projects that demonstrate your practical skills."
                  />
                  <ProjectsSection
                    resumeId={resumeId}
                    projects={projects}
                    onProjectsChange={setProjects}
                    onSaved={handleProjectsSaved}
                  />
                </section>

                <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="04 · Career"
                    title="Work experience"
                    description="Highlight your responsibilities, contributions and impact."
                  />
                  <WorkExperienceSection
                    resumeId={resumeId}
                    workExperience={workExperience}
                    onWorkExperienceChange={setWorkExperience}
                    onSaved={handleWorkExperienceSaved}
                  />
                </section>
                
                <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="03 · Academics"
                    title="Education"
                    description="Showcase your degree, institution and academic timeline."
                  />
                  <EducationSection
                    resumeId={resumeId}
                    education={education}
                    onEducationChange={setEducation}
                    onSaved={handleEducationSaved}
                  />
                </section>

                <section className="rounded-2xl border border-white/[0.08] bg-[#12111B] p-5 sm:p-7">
                  <SectionHeading
                    eyebrow="07 · Credentials"
                    title="Certifications"
                    description="Include the certificate name, issuing organization and issue date."
                  />
                  <CertificationsSection
                    resumeId={resumeId}
                    certifications={certifications}
                    onCertificationsChange={setCertifications}
                    onSaved={handleCertificationsSaved}
                  />
                </section>
              </>
            )}
          </section>

          <aside className="hidden min-w-0 self-start md:sticky md:top-5 md:block">
            <div className="flex max-h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111019]/95 shadow-2xl shadow-black/20">
              <div className="shrink-0 border-b border-white/[0.07]">
                <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.08] text-lg">
                      ▤
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-white sm:text-base">
                        Resume preview
                      </h2>
                      <p className="mt-1 text-xs text-[#8D879F]">
                        Live document preview
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 sm:text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 [scrollbar-color:#454052_transparent] [scrollbar-width:thin]">
                <div className="overflow-hidden rounded-xl border border-white/[0.10] bg-[#20202A] p-2 sm:p-3">
                  <ResumePreview
                    resume={{
                      title: resumeTitle,
                      summary,
                      personalInfo,
                      skills,
                      projects,
                      workExperience,
                      education,
                      certifications,
                    }}
                  />
                </div>
              </div>

              <div className="shrink-0 border-t border-white/[0.07] bg-white/[0.015] px-4 py-3 sm:px-5">
                <p className="text-xs leading-5 text-[#9994AC]">
                  ✦ Updates with your current editor content. Save each
                  section to persist your changes.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-10 border-t border-white/[0.06] py-5 text-center">
          <p className="text-xs text-[#625E72]">
            Made for your next career move · ResumiFY
          </p>
        </footer>
      </div>
    </main>
  );
}
