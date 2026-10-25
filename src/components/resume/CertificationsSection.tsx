
"use client";

import { useState } from "react";
import api from "@/lib/axios";

type CertificationsSectionProps = {
  resumeId: string;
  certifications: string[];
  onCertificationsChange: (items: string[]) => void;
  onSaved: (items: string[]) => void;
};

export default function CertificationsSection({
  resumeId,
  certifications,
  onCertificationsChange,
  onSaved,
}: CertificationsSectionProps) {
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = () => {
    const value = input.trim();

    if (!value) {
      setError("Please enter a certification name.");
      return;
    }

    if (
      certifications.some(
        (item, index) =>
          index !== editingIndex &&
          item.toLowerCase() === value.toLowerCase()
      )
    ) {
      setError("This certification already exists.");
      return;
    }

    const updated = [...certifications];

    if (editingIndex !== null) {
      updated[editingIndex] = value;
    } else {
      updated.push(value);
    }

    onCertificationsChange(updated);
    setInput("");
    setEditingIndex(null);
    setError("");
    setSuccess("Click Save Certifications to save your changes.");
  };

  const handleEdit = (index: number) => {
    setInput(certifications[index]);
    setEditingIndex(index);
    setError("");
    setSuccess("");
  };

  const handleDelete = (index: number) => {
    onCertificationsChange(
      certifications.filter((_, i) => i !== index)
    );

    if (editingIndex === index) {
      setInput("");
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    setError("");
    setSuccess("Click Save Certifications to save your changes.");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/resume/${resumeId}`, {
        certifications,
      });

      if (!response.data.success) {
        setError(
          response.data.message || "Unable to save certifications."
        );
        return;
      }

      const saved: string[] =
        response.data.data?.certifications ?? certifications;

      onCertificationsChange(saved);
      onSaved(saved);
      setSuccess("Certifications saved successfully!");
    } catch (err) {
      console.error("Save certifications error:", err);
      setError("Unable to save certifications. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12111B] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">
        Certifications
      </h2>

      <p className="mt-1 mb-5 text-sm text-gray-400">
        Highlight your courses and professional certificates.
      </p>

      {error && (
        <p role="alert" className="mb-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mb-3 text-sm text-emerald-400">
          {success}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Full Stack Web Development"
          className="w-full rounded-lg border border-white/10 bg-[#09090F] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>

        {editingIndex !== null && (
          <button
            type="button"
            onClick={() => {
              setInput("");
              setEditingIndex(null);
              setError("");
            }}
            className="rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-300 hover:bg-white/5"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mt-5 space-y-3">
        {certifications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-gray-500">
            No certifications added yet.
          </p>
        ) : (
          certifications.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#09090F]/60 p-4"
            >
              <p className="break-words text-sm text-gray-200">
                {item}
              </p>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving..." : "Save Certifications"}
      </button>
    </section>
  );
}
