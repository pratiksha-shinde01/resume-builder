
"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface GenerateExperienceDescriptionProps {
  onApply: (description: string) => void;
}

export default function GenerateExperienceDescription({
  onApply,
}: GenerateExperienceDescriptionProps) {
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [yearsOfExperience, setYearsOfExperience] = useState("0");
  const [techStack, setTechStack] = useState("");
  const [jobRole, setJobRole] = useState("Frontend Developer");

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    if (!techStack.trim() || !jobRole.trim()) {
      setError("Please enter your tech stack and job role.");
      setMessage("");
      return;
    }

    const technologies = techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (technologies.length === 0) {
      setError("Please enter at least one technology.");
      return;
    }

    const years = Number(yearsOfExperience);

    if (
      yearsOfExperience.trim() === "" ||
      !Number.isFinite(years) ||
      years < 0
    ) {
      setError("Please enter a valid number of years.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setDescription("");

      const response = await api.post(
        "/ai/generate-experiance-description",
        {
          experienceLevel,
          yearsOfExperience: years,
          techStack: technologies,
          jobRole: jobRole.trim(),
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to generate description."
        );
      }

      const result =
        response.data?.data?.workExperianceDescription;

      if (typeof result !== "string" || !result.trim()) {
        throw new Error(
          "The API response did not contain a valid description."
        );
      }

      setDescription(result.trim());
      setMessage("Description generated successfully!");
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: { message?: string };
        };
        message?: string;
      };

      console.error(
        "Generate experience description error:",
        apiError.response?.data ?? apiError.message ?? err
      );

      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          "Unable to generate description. Please try again."
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
    setMessage("Description applied successfully!");
  }

  return (
    <section className="space-y-5 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-violet-400">
          AI POWERED
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          AI Work Experience Description Generator
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Generate professional, ATS-friendly descriptions
          using your experience and technical skills.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="experience-level"
          className="text-sm text-gray-200"
        >
          Experience Level
        </label>

        <select
          id="experience-level"
          value={experienceLevel}
          onChange={(event) =>
            setExperienceLevel(event.target.value)
          }
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        >
          <option value="Fresher">Fresher</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="years-of-experience"
          className="text-sm text-gray-200"
        >
          Years of Experience
        </label>

        <input
          id="years-of-experience"
          type="number"
          min="0"
          step="0.5"
          value={yearsOfExperience}
          onChange={(event) =>
            setYearsOfExperience(event.target.value)
          }
          placeholder="e.g. 1"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="experience-tech-stack"
          className="text-sm text-gray-200"
        >
          Tech Stack
        </label>

        <input
          id="experience-tech-stack"
          type="text"
          value={techStack}
          onChange={(event) => setTechStack(event.target.value)}
          placeholder="React, JavaScript, Tailwind CSS"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />

        <p className="text-xs text-gray-500">
          Separate technologies with commas.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="experience-job-role"
          className="text-sm text-gray-200"
        >
          Job Role
        </label>

        <input
          id="experience-job-role"
          type="text"
          value={jobRole}
          onChange={(event) => setJobRole(event.target.value)}
          placeholder="e.g. MERN Stack Developer"
          className="w-full rounded-xl border border-[#353044] bg-[#0B0B12] p-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={
          loading || !techStack.trim() || !jobRole.trim()
        }
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
            htmlFor="generated-experience-description"
            className="block font-semibold text-white"
          >
            Generated Description
          </label>

          <textarea
            id="generated-experience-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
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
