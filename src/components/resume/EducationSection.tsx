
"use client";

import { useState } from "react";
import api from "@/lib/axios";

export type Education = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
};

type EducationSectionProps = {
  resumeId: string;
  education: Education[];
  onEducationChange: (education: Education[]) => void;
  onSaved: (education: Education[]) => void;
};

const emptyEducation: Education = {
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
};

const inputClass =
  "w-full rounded-xl border border-[#353047] bg-[#100F19] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#777286] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm text-[#D8D4E5]";

export default function EducationSection({
  resumeId,
  education,
  onEducationChange,
  onSaved,
}: EducationSectionProps) {
  const [form, setForm] = useState<Education>(emptyEducation);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function openAddForm() {
    setForm({ ...emptyEducation });
    setEditingIndex(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(index: number) {
    setForm({ ...education[index] });
    setEditingIndex(index);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function updateField(field: keyof Education, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
    setMessage("");
  }

  function handleAddOrUpdate() {
    const entry: Education = {
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
    };

    if (
      !entry.institution ||
      !entry.degree ||
      !entry.startDate ||
      !entry.endDate
    ) {
      setError("Please fill in all education fields.");
      return;
    }

    if (editingIndex !== null) {
      if (editingIndex < 0 || editingIndex >= education.length) {
        setError("Education entry not found. Please try again.");
        return;
      }

      onEducationChange(
        education.map((item, index) =>
          index === editingIndex ? entry : item
        )
      );
    } else {
      onEducationChange([...education, entry]);
    }

    setShowForm(false);
    setEditingIndex(null);
    setForm({ ...emptyEducation });
    setError("");
    setMessage("Changes are ready. Click Save Education to save them.");
  }

  function handleDelete(index: number) {
    onEducationChange(
      education.filter((_, currentIndex) => currentIndex !== index)
    );

    if (editingIndex === index) {
      setShowForm(false);
      setEditingIndex(null);
      setForm({ ...emptyEducation });
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    setError("");
    setMessage("Entry removed. Click Save Education to save the changes.");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.patch(`/resume/${resumeId}`, {
        education,
      });

      if (!response.data.success) {
        setError(
          response.data.message || "Could not save education."
        );
        return;
      }

      const savedEducation: Education[] =
        response.data.data?.education ?? education;

      onEducationChange(savedEducation);
      onSaved(savedEducation);
      setMessage("Education saved successfully!");
    } catch (err) {
      console.error("Save education error:", err);
      setError("Education save nahi hui. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            03
          </div>

          <div>
            <h2 className="text-xl font-semibold">Education</h2>
            <p className="mt-1 text-sm text-[#A5A1B5]">
              Add your degrees and academic qualifications.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={openAddForm}
            className="rounded-xl border border-violet-500/40 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
          >
            + Add Education
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
            {editingIndex !== null ? "Edit Education" : "Add Education"}
          </h3>

          <div className="mt-5 grid gap-5">
            <div>
              <label htmlFor="institution" className={labelClass}>
                Institution / University *
              </label>
              <input
                id="institution"
                value={form.institution}
                onChange={(e) =>
                  updateField("institution", e.target.value)
                }
                placeholder="e.g. D. Y. Patil University"
                className={inputClass}
                maxLength={150}
              />
            </div>

            <div>
              <label htmlFor="degree" className={labelClass}>
                Degree / Qualification *
              </label>
              <input
                id="degree"
                value={form.degree}
                onChange={(e) => updateField("degree", e.target.value)}
                placeholder="e.g. Master of Computer Applications"
                className={inputClass}
                maxLength={150}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className={labelClass}>
                  Start Date *
                </label>
                <input
                  id="startDate"
                  value={form.startDate}
                  onChange={(e) =>
                    updateField("startDate", e.target.value)
                  }
                  placeholder="e.g. 2026"
                  className={inputClass}
                  maxLength={30}
                />
              </div>

              <div>
                <label htmlFor="endDate" className={labelClass}>
                  End Date / Expected *
                </label>
                <input
                  id="endDate"
                  value={form.endDate}
                  onChange={(e) =>
                    updateField("endDate", e.target.value)
                  }
                  placeholder="e.g. 2028 or Present"
                  className={inputClass}
                  maxLength={30}
                />
              </div>
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
                setForm({ ...emptyEducation });
                setError("");
              }}
              className="rounded-xl border border-[#353047] px-5 py-2.5 text-sm text-[#D8D4E5] transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {education.length === 0 && !showForm ? (
        <div className="mt-6 rounded-xl border border-dashed border-[#353047] px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-300">
            +
          </div>
          <h3 className="mt-4 font-medium">No education added yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#A5A1B5]">
            Add your college, degree and study dates to complete your
            academic profile.
          </p>
          <button
            type="button"
            onClick={openAddForm}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
          >
            Add Your First Education
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {education.map((item, index) => (
            <article
              key={`${index}-${item.institution}`}
              className="rounded-xl border border-[#353047] bg-[#100F19] p-4 sm:p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-white">
                    {item.degree}
                  </h3>
                  <p className="mt-1 break-words text-sm text-violet-300">
                    {item.institution}
                  </p>
                  <p className="mt-2 text-sm text-[#A5A1B5]">
                    {item.startDate} — {item.endDate}
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
          {saving ? "Saving Education..." : "Save Education"}
        </button>

        <p className="mt-3 text-xs text-[#A5A1B5]">
          Add, edit or remove entries first, then save your changes.
        </p>
      </div>
    </section>
  );
}
