
"use client";

import { useState } from "react";
import api from "@/lib/axios";

type SkillsSectionProps = {
  resumeId: string;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onSaved: (skills: string[]) => void;
};

export default function SkillsSection({
  resumeId,
  skills,
  onSkillsChange,
  onSaved,
}: SkillsSectionProps) {
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setError("This skill has already been added.");
      return;
    }

    onSkillsChange([...skills, skill]);
    setSkillInput("");
    setError("");
    setSuccess("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/resume/${resumeId}`, {
        skills,
      });

      if (!response.data.success) {
        setError(response.data.message || "Skills save nahi hui.");
        return;
      }

      const savedSkills: string[] =
        response.data.data?.skills ?? skills;

      onSkillsChange(savedSkills);
      onSaved(savedSkills);
      setSuccess("Skills saved successfully!");
    } catch (err) {
      console.error("Save skills error:", err);
      setError("Skills save nahi hui. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12111B] p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Skills</h2>
        <p className="mt-1 text-sm text-gray-400">
          Add your technical skills to highlight your expertise.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mb-4 text-sm text-emerald-400">
          {success}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddSkill();
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="e.g. React, JavaScript, Node.js"
          className="w-full rounded-lg border border-white/10 bg-[#09090F] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          Add Skill
        </button>
      </form>

      <div className="mt-5">
        {skills.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-gray-500">
            No skills added yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="text-violet-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving Skills..." : "Save Skills"}
      </button>
    </section>
  );
}
