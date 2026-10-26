
"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface GenerateProjectDescriptionProps {
  onApply: (description: string) => void;
}

export default function GenerateProjectDescription({
  onApply,
}: GenerateProjectDescriptionProps) {
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [techStack, setTechStack] = useState("");
  const [jobType, setJobType] = useState("Frontend Developer");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    if (!techStack.trim() || !jobType.trim()) {
      setError("Please enter the project tech stack and target job role.");
      setMessage("");
      return;
    }

    const technologies = techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (technologies.length === 0) {
      setError("Please enter at least one technology.");
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setDescription("");

      const response = await api.post(
        "/ai/generate-project-description",
        {
          experienceLevel,
          jobTitle: jobType.trim(),
          techStack: technologies,
        }
      );

      console.log("Project description API response:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to generate description."
        );
      }

      const result = response.data?.data?.projectDescription;

      console.log("Generated description:", result);

      if (typeof result !== "string" || !result.trim()) {
        throw new Error(
          "The API response did not contain a valid project description."
        );
      }

      setDescription(result.trim());
      setMessage("Project description generated successfully!");
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      console.error(
        "Generate project description error:",
        apiError.response?.data ?? apiError.message ?? err
      );

      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          "Unable to generate project description. Please try again."
      );
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!description.trim()) {
      setError("Please generate a description first.");
      return;
    }

    onApply(description.trim());
    setError("");
    setMessage("Project description applied successfully!");
  }

  return (
    <section className="space-y-5 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-violet-400">AI POWERED</p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          AI Project Description Generator
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Generate professional, ATS-friendly descriptions for your projects.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="project-experience" className="text-sm text-gray-200">
          Experience Level
        </label>

        <select
          id="project-experience"
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

      <div className="space-y-2">
        <label htmlFor="project-tech-stack" className="text-sm text-gray-200">
          Project Tech Stack
        </label>

        <input
          id="project-tech-stack"
          type="text"
          value={techStack}
          onChange={(event) => setTechStack(event.target.value)}
          placeholder="React, Node.js, Express, MongoDB"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />

        <p className="text-xs text-gray-500">
          Separate technologies with commas.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="project-job-type" className="text-sm text-gray-200">
          Target Job Role
        </label>

        <input
          id="project-job-type"
          type="text"
          value={jobType}
          onChange={(event) => setJobType(event.target.value)}
          placeholder="e.g. MERN Stack Developer"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !techStack.trim() || !jobType.trim()}
        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Generating..." : "Generate Description"}
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

      {description && (
        <div className="space-y-4 border-t border-[#292536] pt-5">
          <label
            htmlFor="generated-project-description"
            className="block font-semibold text-white"
          >
            Generated Description
          </label>

          <textarea
            id="generated-project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-4 text-sm leading-6 text-white outline-none focus:border-violet-500"
          />

          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl border border-violet-500/40 px-5 py-3 font-medium text-violet-300 transition hover:bg-violet-500/10"
          >
            Apply Description
          </button>
        </div>
      )}
    </section>
  );
}
