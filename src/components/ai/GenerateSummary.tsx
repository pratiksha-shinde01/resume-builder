
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface GenerateSummaryProps {
  resumeId: string;
  skills: string[];
  initialSummary?: string;
  onSummaryChange: (summary: string) => void;
}

export default function GenerateSummary({
  resumeId,
  skills,
  initialSummary = "",
  onSummaryChange,
}: GenerateSummaryProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [technicalSkills, setTechnicalSkills] = useState(
    () => skills.join(", ")
  );
  const [summary, setSummary] = useState(initialSummary);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Update summary when resume data loads.
  useEffect(() => {
    setSummary(initialSummary);
  }, [initialSummary]);

  // Load skills from the parent if the skills arrive asynchronously.
  useEffect(() => {
    setTechnicalSkills((current) =>
      current.trim() ? current : skills.join(", ")
    );
  }, [skills]);

  async function handleGenerate() {
    if (!jobTitle.trim()) {
      setError("Please enter your target job title.");
      setMessage("");
      return;
    }

    // Convert comma-separated input into a skills array.
    const skillsForSummary = technicalSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skillsForSummary.length === 0) {
      setError("Please enter at least one technical skill.");
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post("/ai/generate-summary", {
        experienceLevel,
        jobTitle: jobTitle.trim(),
        skills: skillsForSummary,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to generate summary."
        );
      }

      const generatedSummary = response.data?.data?.summary;

      if (
        typeof generatedSummary !== "string" ||
        !generatedSummary.trim()
      ) {
        throw new Error("The AI did not return a valid summary.");
      }

      setSummary(generatedSummary.trim());
      onSummaryChange(generatedSummary.trim());
      setMessage("Summary generated successfully!");
    } catch (err: any) {
      console.error("Generate summary error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to generate summary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!summary.trim()) {
      setError("Please generate or enter a summary first.");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.patch(`/resume/${resumeId}`, {
        summary: summary.trim(),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save summary."
        );
      }

      onSummaryChange(summary.trim());
      setMessage("Summary saved successfully!");
    } catch (err: any) {
      console.error("Save summary error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save summary. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
          ✨
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            AI Professional Summary
          </h2>
          <p className="mt-1 text-sm text-[#A5A1B5]">
            Generate an ATS-friendly summary for your target job.
          </p>
        </div>
      </div>

      {/* Job Title and Experience Level */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="jobTitle"
            className="text-sm font-medium text-white"
          >
            Target Job Title
          </label>

          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. React Frontend Developer"
            className="w-full rounded-xl border border-[#353044] bg-[#1A1925] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#777386] focus:border-violet-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="experienceLevel"
            className="text-sm font-medium text-white"
          >
            Experience Level
          </label>

          <select
            id="experienceLevel"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full rounded-xl border border-[#353044] bg-[#1A1925] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
          >
            <option value="Fresher">Fresher</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>
      </div>

      {/* Editable Technical Skills */}
      <div className="space-y-2">
        <label
          htmlFor="technicalSkills"
          className="text-sm font-medium text-white"
        >
          Technical Skills
        </label>

        <textarea
          id="technicalSkills"
          value={technicalSkills}
          onChange={(e) => setTechnicalSkills(e.target.value)}
          placeholder="React.js, JavaScript, HTML, CSS, Tailwind CSS"
          rows={3}
          className="w-full resize-y rounded-xl border border-[#353044] bg-[#1A1925] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#777386] focus:border-violet-500"
        />

        <p className="text-xs text-[#A5A1B5]">
          Enter your technical skills separated by commas. You can edit
          the skills before generating your summary.
        </p>
      </div>

      {/* Generate Summary */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Generating Summary...
          </>
        ) : (
          <>✨ Generate Summary</>
        )}
      </button>

      {/* Professional Summary Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="summary"
            className="text-sm font-medium text-white"
          >
            Professional Summary
          </label>

          <span className="text-xs text-[#A5A1B5]">
            {summary.length} characters
          </span>
        </div>

        <textarea
          id="summary"
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
            onSummaryChange(e.target.value);
            setError("");
            setMessage("");
          }}
          placeholder="Your AI-generated professional summary will appear here. You can also write or edit it manually."
          rows={6}
          className="w-full resize-y rounded-xl border border-[#353044] bg-[#1A1925] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#777386] focus:border-violet-500"
        />
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
        >
          {message}
        </div>
      )}

      {/* Save Summary */}
      <div className="flex justify-end border-t border-[#292536] pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#12111B] transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Summary"}
        </button>
      </div>
    </section>
  );
}
