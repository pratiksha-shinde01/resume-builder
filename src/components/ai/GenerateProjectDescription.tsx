"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface GenerateProjectDescriptionProps {
  onApply: (data: {
    title: string;
    description: string;
  }) => void;
}

export default function GenerateProjectDescription({
  onApply,
}: GenerateProjectDescriptionProps) {
  const [projectTitle, setProjectTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [techStack, setTechStack] = useState("");
  const [jobType, setJobType] = useState("Frontend Developer");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    if (
      !projectTitle.trim() ||
      !techStack.trim() ||
      !jobType.trim() ||
      !experienceLevel.trim()
    ) {
      setError(
        "Please enter the project title, tech stack, experience level, and target job role."
      );
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
          projectTitle: projectTitle.trim(),
          experienceLevel,
          jobTitle: jobType.trim(),
          techStack: technologies,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to generate description."
        );
      }

      const result = response.data?.data?.projectDescription;

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
  if (!projectTitle.trim() || !description.trim()) {
    setError(
      "Please enter a project title and generate a description first."
    );
    setMessage("");
    return;
  }

  setError("");
  setMessage("");

  onApply({
    title: projectTitle.trim(),
    description: description.trim(),
  });
}


  return (
    <section className="space-y-5 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-violet-400">
          AI POWERED
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          AI Project Description Generator
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Generate professional, ATS-friendly descriptions for your projects.
        </p>
      </div>

      {/* Project Title */}
      <div className="space-y-2">
        <label htmlFor="project-title" className="text-sm text-gray-200">
          Project Title
        </label>

        <input
          id="project-title"
          type="text"
          value={projectTitle}
          onChange={(event) => setProjectTitle(event.target.value)}
          placeholder="e.g. Movie Booking Website"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <label
          htmlFor="project-experience"
          className="text-sm text-gray-200"
        >
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

      {/* Tech Stack */}
      <div className="space-y-2">
        <label
          htmlFor="project-tech-stack"
          className="text-sm text-gray-200"
        >
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

      {/* Target Job Role */}
      <div className="space-y-2">
        <label
          htmlFor="project-job-type"
          className="text-sm text-gray-200"
        >
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

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={
          loading ||
          !projectTitle.trim() ||
          !techStack.trim() ||
          !jobType.trim()
        }
        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Generating..." : "Generate Description"}
      </button>

      {/* Error Message */}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Success Message */}
      {message && (
        <p role="status" className="text-sm text-emerald-400">
          {message}
        </p>
      )}

      {/* Generated Description */}
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
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Generating Description...
          </>
        ) : (
          <>✨ Generate Description</>
        )}
      </button>
        </div>
      )}
    </section>
  );
}