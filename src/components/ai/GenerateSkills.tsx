"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface GenerateSkillsProps {
  onApply: (skills: string[]) => void;
}

export default function GenerateSkills({ onApply }: GenerateSkillsProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    if (!jobTitle.trim()) {
      setError("Please enter your target job title.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setSkills([]);

      const response = await api.post("/ai/generate-skills", {
        experienceLevel,
        jobTitle: jobTitle.trim(),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to generate skills."
        );
      }

      const result =
        response.data?.data?.skills ?? response.data?.skills;

      if (!Array.isArray(result)) {
        throw new Error(
          "Unexpected API response. Please check your API response format."
        );
      }

      const validSkills = result.filter(
        (skill): skill is string =>
          typeof skill === "string" && skill.trim().length > 0
      );

      setSkills(validSkills);
      setMessage("Skills generated successfully!");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      console.error("Generate skills error:", err);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to generate skills. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (skills.length === 0) return;

    onApply(skills);
    setMessage("Skills applied to your resume!");
  }

  return (
    <section className="space-y-5 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-violet-400">AI POWERED</p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          AI Skills Generator
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-400">
          Generate relevant technical skills for your target job role.
          Review the suggestions before adding them to your resume.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="skills-job-title" className="text-sm text-gray-200">
          Target Job Title
        </label>
        <input
          id="skills-job-title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          placeholder="e.g. React Frontend Developer"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="skills-experience" className="text-sm text-gray-200">
          Experience Level
        </label>
        <select
          id="skills-experience"
          value={experienceLevel}
          onChange={(event) => setExperienceLevel(event.target.value)}
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        >
          <option value="Fresher">Fresher</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !jobTitle.trim()}
        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Generating Skills..." : "Generate Skills"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="text-sm text-emerald-400">
          {message}
        </p>
      )}

      {skills.length > 0 && (
        <div className="space-y-4 border-t border-[#292536] pt-5">
          <h3 className="font-semibold text-white">Suggested Skills</h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl border border-violet-500/40 px-5 py-3 font-medium text-violet-300 transition hover:bg-violet-500/10"
          >
            Add Skills to Resume
          </button>
        </div>
      )}
    </section>
  );
}