"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface ImproveContentProps {
  initialContent?: string;
  onApply?: (content: string) => void;
}

export default function ImproveContent({
  initialContent = "",
  onApply,
}: ImproveContentProps) {
  const [content, setContent] = useState(initialContent);
  const [improvedContent, setImprovedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleImprove() {
    if (!content.trim()) {
      setError("Please enter the resume content you want to improve.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setImprovedContent("");

      // Connect this request to your existing Improve Content API.
      const response = await api.post("/ai/improve-content", {
        content: content.trim(),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to improve content."
        );
      }

      const result =
        response.data?.data?.improvedContent ??
        response.data?.data?.content ??
        response.data?.data?.improvedText ??
        response.data?.improvedContent;

      if (typeof result !== "string" || !result.trim()) {
        throw new Error(
          "The API response format is different. Please check your API response."
        );
      }

      setImprovedContent(result.trim());
      setMessage("Content improved successfully!");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      console.error("Improve content error:", err);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to improve content. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!improvedContent.trim()) return;

    setContent(improvedContent);
    onApply?.(improvedContent);
    setMessage("Improved content applied!");
    setError("");
  }

  return (
    <section className="space-y-6 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-violet-400">
          AI POWERED
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Improve Resume Content
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Improve your resume content with professional, clear, and
          ATS-friendly wording while keeping your original meaning.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="resume-content"
          className="text-sm font-medium text-gray-200"
        >
          Original Content
        </label>

        <textarea
          id="resume-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Paste your summary, project description, work experience, or other resume content..."
          rows={7}
          className="w-full resize-y rounded-xl border border-[#353044] bg-[#0B0B12] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500"
        />
      </div>

      <button
        type="button"
        onClick={handleImprove}
        disabled={loading || !content.trim()}
        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Improving Content..." : "Improve with AI"}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="text-sm text-emerald-400"
        >
          {message}
        </p>
      )}

      {improvedContent && (
        <div className="space-y-4 border-t border-[#292536] pt-5">
          <div>
            <h3 className="font-semibold text-white">
              Improved Content
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Review the result before applying it to your resume.
            </p>
          </div>

          <textarea
            aria-label="Improved resume content"
            value={improvedContent}
            onChange={(event) => setImprovedContent(event.target.value)}
            rows={7}
            className="w-full resize-y rounded-xl border border-[#353044] bg-[#0B0B12] p-4 text-sm leading-6 text-white outline-none focus:border-violet-500"
          />

          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl border border-violet-500/40 px-5 py-3 font-medium text-violet-300 transition hover:bg-violet-500/10"
          >
            Apply Improved Content
          </button>
        </div>
      )}
    </section>
  );
}