
"use client";

import { useState } from "react";
import api from "@/lib/axios";

export type WorkExperience = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

type WorkExperienceSectionProps = {
  resumeId: string;
  workExperience: WorkExperience[];
  onWorkExperienceChange: (experiences: WorkExperience[]) => void;
  onSaved: (experiences: WorkExperience[]) => void;
};

const emptyExperience: WorkExperience = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

const inputClass =
  "w-full rounded-xl border border-[#353047] bg-[#100F19] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#777286] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm text-[#D8D4E5]";

export default function WorkExperienceSection({
  resumeId,
  workExperience,
  onWorkExperienceChange,
  onSaved,
}: WorkExperienceSectionProps) {
  const [form, setForm] = useState<WorkExperience>(emptyExperience);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function openAddForm() {
    setForm({ ...emptyExperience });
    setEditingIndex(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(index: number) {
    setForm({ ...workExperience[index] });
    setEditingIndex(index);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function updateField(field: keyof WorkExperience, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
    setMessage("");
  }

  function handleAddOrUpdate() {
    const entry: WorkExperience = {
      company: form.company.trim(),
      position: form.position.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
      description: form.description.trim(),
    };

    if (
      !entry.company ||
      !entry.position ||
      !entry.startDate ||
      !entry.endDate ||
      !entry.description
    ) {
      setError("Please fill in all work experience fields.");
      return;
    }

    if (editingIndex !== null) {
      if (
        editingIndex < 0 ||
        editingIndex >= workExperience.length
      ) {
        setError("Experience entry not found. Please try again.");
        return;
      }

      onWorkExperienceChange(
        workExperience.map((item, index) =>
          index === editingIndex ? entry : item
        )
      );
    } else {
      onWorkExperienceChange([...workExperience, entry]);
    }

    setShowForm(false);
    setEditingIndex(null);
    setForm({ ...emptyExperience });
    setError("");
    setMessage("Changes are ready. Click Save Experience to save them.");
  }

  function handleDelete(index: number) {
    onWorkExperienceChange(
      workExperience.filter((_, currentIndex) => currentIndex !== index)
    );

    if (editingIndex === index) {
      setShowForm(false);
      setEditingIndex(null);
      setForm({ ...emptyExperience });
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    setError("");
    setMessage("Entry removed. Click Save Experience to save the changes.");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.patch(`/resume/${resumeId}`, {
        workExperience,
      });

      if (!response.data.success) {
        setError(
          response.data.message || "Could not save work experience."
        );
        return;
      }

      const savedExperiences: WorkExperience[] =
        response.data.data?.workExperience ?? workExperience;

      onWorkExperienceChange(savedExperiences);
      onSaved(savedExperiences);
      setMessage("Work experience saved successfully!");
    } catch (err) {
      console.error("Save work experience error:", err);
      setError("Work experience save nahi hua. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            04
          </div>

          <div>
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <p className="mt-1 text-sm text-[#A5A1B5]">
              Highlight your internships, jobs and professional experience.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={openAddForm}
            className="rounded-xl border border-violet-500/40 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
          >
            + Add Experience
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300"
        >
          {message}
        </p>
      )}

      {showForm && (
        <div className="mt-6 rounded-xl border border-[#353047] bg-[#100F19] p-4 sm:p-5">
          <h3 className="font-semibold">
            {editingIndex !== null ? "Edit Experience" : "Add Experience"}
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="work-company" className={labelClass}>
                Company Name *
              </label>
              <input
                id="work-company"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="e.g. ABC Technologies"
                className={inputClass}
                maxLength={150}
              />
            </div>

            <div>
              <label htmlFor="work-position" className={labelClass}>
                Job Title / Position *
              </label>
              <input
                id="work-position"
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="e.g. Frontend Developer Intern"
                className={inputClass}
                maxLength={150}
              />
            </div>

            <div>
              <label htmlFor="work-start-date" className={labelClass}>
                Start Date *
              </label>
              <input
                id="work-start-date"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                placeholder="e.g. Jan 2026"
                className={inputClass}
                maxLength={30}
              />
            </div>

            <div>
              <label htmlFor="work-end-date" className={labelClass}>
                End Date *
              </label>
              <input
                id="work-end-date"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                placeholder="e.g. Present"
                className={inputClass}
                maxLength={30}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="work-description" className={labelClass}>
                Responsibilities & Achievements *
              </label>
              <textarea
                id="work-description"
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Describe your responsibilities, technologies used and achievements..."
                className={`${inputClass} min-h-32 resize-y`}
                rows={5}
                maxLength={3000}
              />
              <p className="mt-2 text-xs text-[#777286]">
                {form.description.length}/3000 characters
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddOrUpdate}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
            >
              {editingIndex !== null ? "Update Entry" : "Add Entry"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
                setForm({ ...emptyExperience });
                setError("");
              }}
              className="rounded-xl border border-[#353047] px-5 py-2.5 text-sm text-[#D8D4E5] transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {workExperience.length === 0 && !showForm ? (
        <div className="mt-6 rounded-xl border border-dashed border-[#353047] px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-300">
            +
          </div>

          <h3 className="mt-4 font-medium">No experience added yet</h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-[#A5A1B5]">
            Add your internships or previous jobs to showcase your
            professional experience.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
          >
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {workExperience.map((item, index) => (
            <article
              key={`${index}-${item.company}`}
              className="rounded-xl border border-[#353047] bg-[#100F19] p-4 sm:p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-white">
                    {item.position}
                  </h3>

                  <p className="mt-1 break-words text-sm text-violet-300">
                    {item.company}
                  </p>

                  <p className="mt-2 text-sm text-[#A5A1B5]">
                    {item.startDate} — {item.endDate}
                  </p>

                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#D8D4E5]">
                    {item.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-start gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(index)}
                    className="rounded-lg border border-[#353047] px-3 py-2 text-sm text-[#D8D4E5] transition hover:border-violet-500/50 hover:text-violet-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-7 border-t border-[#292536] pt-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || showForm}
          className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving Experience..." : "Save Experience"}
        </button>

        <p className="mt-3 text-xs text-[#A5A1B5]">
          Add, edit or remove entries first, then save your changes.
        </p>
      </div>
    </section>
  );
}
