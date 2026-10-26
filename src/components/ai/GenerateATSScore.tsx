
"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface ATSResult {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface GenerateATSScoreProps {
  resumeText: string;
}

export default function GenerateATSScore({
  resumeText,
}: GenerateATSScoreProps) {
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateScore = async () => {
    if (!resumeText.trim()) {
      setError("Please add your resume content first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post("ai/ats-score", {
        resumeText,
      });

      const data = response.data?.data?.AtsScore;

      // Handle AI output returned either as an object or JSON string.
      const parsed: ATSResult =
        typeof data === "string" ? JSON.parse(data) : data;

      if (
        typeof parsed?.atsScore !== "number" ||
        !Array.isArray(parsed.strengths) ||
        !Array.isArray(parsed.weaknesses) ||
        !Array.isArray(parsed.suggestions)
      ) {
        throw new Error("Invalid ATS score response.");
      }

      setResult(parsed);
    } catch (err) {
      console.error("ATS score error:", err);
      setError(
        "Unable to generate ATS score. Please check the API route and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-[#12111B] p-5 text-white">
      <div>
        <h2 className="text-xl font-semibold">ATS Resume Score</h2>
        <p className="mt-1 text-sm text-gray-400">
          Analyze your resume and get actionable improvement suggestions.
        </p>
      </div>

      <button
        type="button"
        onClick={generateScore}
        disabled={loading || !resumeText.trim()}
        className="rounded-lg bg-violet-600 px-5 py-3 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing Resume..." : "Generate ATS Score"}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <div className="space-y-5">
          <div className="rounded-xl border border-white/10 bg-[#09090F] p-5">
            <p className="text-sm text-gray-400">ATS Compatibility Score</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-violet-400">
                {result.atsScore}
              </span>
              <span className="text-gray-400">/100</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, result.atsScore))}%`,
                }}
              />
            </div>
          </div>

          <FeedbackList title="Strengths" items={result.strengths} />
          <FeedbackList title="Areas to Improve" items={result.weaknesses} />
          <FeedbackList title="Suggestions" items={result.suggestions} />

          <p className="text-xs text-gray-500">
            This score is an estimate, not a guarantee of passing an actual ATS
            screening.
          </p>
        </div>
      )}
    </section>
  );
}

function FeedbackList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      {items.length > 0 ? (
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-300">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No items returned.</p>
      )}
    </div>
  );
}
