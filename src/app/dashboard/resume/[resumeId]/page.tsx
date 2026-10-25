
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

type Resume = {
  _id: string;
  title?: string;
  summary?: string;
  personalInfo?: Partial<PersonalInfo>;
  education?: Education[];
  workExperience?: WorkExperience[];
  skills?: string[];
  projects?: Project[];
  certifications?: string[];
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
  "w-full rounded-xl border border-[#353047] bg-[#100F19] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#777286] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm text-[#D8D4E5]";

export default function ResumeEditorPage() {
  const params = useParams<{ resumeId: string }>();
  const router = useRouter();
  const resumeId = params.resumeId;

  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(emptyPersonalInfo);
  const [education, setEducation] = useState<Education[]>([]);
  const [workExperience, setWorkExperience] =
    useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

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

      if (!data || !data._id) {
        setError("Resume data was not returned by the server.");
        return;
      }

      setResume(data);
      setResumeTitle(data.title ?? "");

      setPersonalInfo({
        ...emptyPersonalInfo,
        ...(data.personalInfo ?? {}),
      });

      setEducation(data.education ?? []);
      setWorkExperience(data.workExperience ?? []);
      setProjects(data.projects ?? []);
      setSkills(data.skills ?? []);
      setCertifications(data.certifications ?? []);
    } catch (err) {
      console.error("Fetch resume error:", err);
      setError("Unable to load resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    if (resumeId) {
      void fetchResume();
    }
  }, [resumeId, fetchResume]);

  function updatePersonalInfo(
    field: keyof PersonalInfo,
    value: string
  ) {
    setPersonalInfo((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setMessage("");
  }

  async function handleSaveTitle() {
    try {
      setSavingTitle(true);
      setError("");
      setMessage("");

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
      setError("");
      setMessage("");

      const response = await api.patch(`/resume/${resumeId}`, {
        title: resumeTitle.trim(),
        personalInfo,
      });

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Could not save personal information."
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

  function handleWorkExperienceSaved(
    savedExperiences: WorkExperience[]
  ) {
    setWorkExperience(savedExperiences);

    setResume((previous) =>
      previous
        ? { ...previous, workExperience: savedExperiences }
        : previous
    );
  }

  function handleProjectsSaved(savedProjects: Project[]) {
    setProjects(savedProjects);

    setResume((previous) =>
      previous ? { ...previous, projects: savedProjects } : previous
    );
  }

  function handleSkillsSaved(savedSkills: string[]) {
    setSkills(savedSkills);

    setResume((previous) =>
      previous ? { ...previous, skills: savedSkills } : previous
    );
  }

  function handleCertificationsSaved(saved: string[]) {
    setCertifications(saved);

    setResume((previous) =>
      previous ? { ...previous, certifications: saved } : previous
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090F] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse rounded-2xl border border-[#292536] bg-[#12111B] p-8">
            <div className="h-6 w-48 rounded bg-white/10" />
            <div className="mt-4 h-4 w-72 max-w-full rounded bg-white/10" />
            <div className="mt-8 h-40 rounded-xl bg-white/5" />
          </div>

          <p className="mt-4 text-center text-sm text-[#A5A1B5]">
            Loading your resume...
          </p>
        </div>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="min-h-screen bg-[#09090F] px-4 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-[#12111B] p-6 sm:p-8">
          <h1 className="text-xl font-semibold">
            Unable to open resume
          </h1>

          <p role="alert" className="mt-3 text-sm text-red-300">
            {error || "Resume not found."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchResume()}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border border-[#353047] px-5 py-3 text-sm transition hover:bg-white/5"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090F] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Page header */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-5 inline-flex items-center gap-2 text-sm text-[#A5A1B5] transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-violet-300">
                RESUME BUILDER
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Resume Editor
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A5A1B5] sm:text-base">
                Build your professional resume one section at a time.
                Your information is saved to your account.
              </p>
            </div>

            <span className="w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              Resume ID: {resume._id.slice(-8)}
            </span>
          </div>
        </header>

        {/* Page-level feedback */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
          >
            {message}
          </div>
        )}

        {/* Responsive editor and preview layout */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-8">
          {/* LEFT COLUMN: Resume editor */}
          <div className="min-w-0 space-y-6">
            {/* 01 - Resume Title */}
            <section className="rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
                  01
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Resume Details</h2>
                  <p className="mt-1 text-sm text-[#A5A1B5]">
                    Give your resume a clear, professional title.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="resumeTitle" className={labelClass}>
                  Resume Title
                </label>

                <input
                  id="resumeTitle"
                  value={resumeTitle}
                  onChange={(e) => {
                    setResumeTitle(e.target.value);
                    setMessage("");
                    setError("");
                  }}
                  placeholder="e.g. Frontend Developer Resume"
                  className={inputClass}
                  maxLength={100}
                />
              </div>

              <button
                type="button"
                onClick={() => void handleSaveTitle()}
                disabled={savingTitle}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingTitle ? "Saving Title..." : "Save Title"}
              </button>
            </section>

            {/* 02 - Personal Information */}
            <PersonalInfoSection
              personalInfo={personalInfo}
              onChange={updatePersonalInfo}
              onSave={() => void handleSavePersonalInfo()}
              saving={savingPersonalInfo}
            />

            {/* 03 - Education */}
            <EducationSection
              resumeId={resumeId}
              education={education}
              onEducationChange={setEducation}
              onSaved={handleEducationSaved}
            />

            {/* 04 - Work Experience */}
            <WorkExperienceSection
              resumeId={resumeId}
              workExperience={workExperience}
              onWorkExperienceChange={setWorkExperience}
              onSaved={handleWorkExperienceSaved}
            />

            {/* 05 - Projects */}
            <ProjectsSection
              resumeId={resumeId}
              projects={projects}
              onProjectsChange={setProjects}
              onSaved={handleProjectsSaved}
            />

            {/* 06 - Skills */}
            <SkillsSection
              resumeId={resumeId}
              skills={skills}
              onSkillsChange={setSkills}
              onSaved={handleSkillsSaved}
            />

            {/* 07 - Certifications */}
            <CertificationsSection
              resumeId={resumeId}
              certifications={certifications}
              onCertificationsChange={setCertifications}
              onSaved={handleCertificationsSaved}
            />
          </div>

          {/* RIGHT COLUMN: Live resume preview */}
          
{/* RIGHT COLUMN: Professional live resume preview */}
<aside className="min-w-0 self-start md:sticky md:top-4">
  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12111B] shadow-2xl shadow-black/30">
    {/* Preview header */}
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
            <path d="M14 3.5V9h5M8.5 13h7M8.5 16.5h7" />
          </svg>
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white sm:text-base">
            Resume Preview
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Live document
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300 sm:text-xs">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Live
      </span>
    </div>

    {/* Document information */}
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-gray-200">
          {resumeTitle.trim() || "Untitled Resume"}
        </p>
        <p className="mt-1 text-[11px] text-gray-500">
          A4 · Professional layout
        </p>
      </div>

      <div className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-gray-400">
        PDF Ready
      </div>
    </div>

    {/* Resume document */}
    <div className="p-3 sm:p-5">
      <div className="rounded-xl border border-white/10 bg-[#20202A] p-2 sm:p-3">
        <ResumePreview
          resume={{
            title: resumeTitle,
            summary: resume?.summary ?? "",
            personalInfo,
            education,
            workExperience,
            projects,
            skills,
            certifications,
          }}
        />
      </div>
    </div>

    {/* Bottom helper */}
    <div className="flex items-center gap-2 border-t border-white/[0.07] px-4 py-3 sm:px-5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4 shrink-0 text-violet-300"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </svg>

      <p className="text-[11px] leading-5 text-gray-400">
        Changes appear in your preview as you edit. Use zoom controls to inspect details.
      </p>
    </div>
  </div>
</aside>

        </div>
      </div>
    </main>
  );
}
