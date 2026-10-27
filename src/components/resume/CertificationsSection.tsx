
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import type { ICertification } from "@/types/resume.types";

type CertificationsSectionProps = {
  resumeId: string;
  certifications: ICertification[];
  onCertificationsChange: (items: ICertification[]) => void;
  onSaved: (items: ICertification[]) => void;
};

const emptyCertification: ICertification = {
  name: "",
  organization: "",
  issueDate: "",
};

export default function CertificationsSection({
  resumeId,
  certifications,
  onCertificationsChange,
  onSaved,
}: CertificationsSectionProps) {
  const [formData, setFormData] =
    useState<ICertification>(emptyCertification);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function clearFeedback() {
    setError("");
    setSuccess("");
  }

  function updateField(
    field: keyof ICertification,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    clearFeedback();
  }

  function resetForm() {
    setFormData(emptyCertification);
    setEditingIndex(null);
    setError("");
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();

    const name = formData.name.trim();
    const organization = formData.organization?.trim() ?? "";
    const issueDate = formData.issueDate ?? "";

    if (!name) {
      setError("Please enter a certification name.");
      return;
    }

    const duplicate = certifications.some(
      (item, index) =>
        index !== editingIndex &&
        item.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      setError("This certification already exists.");
      return;
    }

    const updatedCertification: ICertification = {
      name,
      organization,
      issueDate,
    };

    const updated = [...certifications];

    if (editingIndex !== null) {
      updated[editingIndex] = updatedCertification;
    } else {
      updated.push(updatedCertification);
    }

    onCertificationsChange(updated);
    setFormData(emptyCertification);
    setEditingIndex(null);
    setSuccess("Click Save Certifications to save your changes.");
  }

  function handleEdit(index: number) {
    const certification = certifications[index];

    setFormData({
      name: certification.name ?? "",
      organization: certification.organization ?? "",
      issueDate: certification.issueDate ?? "",
    });

    setEditingIndex(index);
    clearFeedback();
  }

  function handleDelete(index: number) {
    const updated = certifications.filter((_, i) => i !== index);

    onCertificationsChange(updated);

    if (editingIndex === index) {
      setFormData(emptyCertification);
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    setError("");
    setSuccess("Click Save Certifications to save your changes.");
  }

  async function handleSave() {
    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const cleanedCertifications = certifications
        .map((cert) => ({
          name: cert.name.trim(),
          organization: cert.organization?.trim() ?? "",
          issueDate: cert.issueDate ?? "",
        }))
        .filter((cert) => cert.name.length > 0);

      const response = await api.patch(`/resume/${resumeId}`, {
        certifications: cleanedCertifications,
      });

      if (!response.data?.success) {
        setError(
          response.data?.message || "Unable to save certifications."
        );
        return;
      }

      const responseCertifications =
        response.data.data?.certifications ??
        response.data.data?.resume?.certifications;

      const saved: ICertification[] = Array.isArray(responseCertifications)
        ? responseCertifications.map(
            (cert: string | ICertification) =>
              typeof cert === "string"
                ? {
                    name: cert,
                    organization: "",
                    issueDate: "",
                  }
                : {
                    name: cert.name ?? "",
                    organization: cert.organization ?? "",
                    issueDate: cert.issueDate ?? "",
                  }
          )
        : cleanedCertifications;

      onCertificationsChange(saved);
      onSaved(saved);
      setSuccess("Certifications saved successfully!");
    } catch (err) {
      console.error("Save certifications error:", err);
      setError("Unable to save certifications. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12111B] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">
        Certifications
      </h2>

      <p className="mt-1 mb-5 text-sm text-gray-400">
        Add the certificate name, issuing organization and issue date.
      </p>

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-400"
        >
          {success}
        </p>
      )}

      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label
            htmlFor="certificationName"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Certification name <span className="text-red-400">*</span>
          </label>

          <input
            id="certificationName"
            type="text"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. Full Stack Web Development"
            maxLength={150}
            required
            className="w-full rounded-xl border border-white/10 bg-[#09090F] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
          />
        </div>

        <div>
          <label
            htmlFor="certificationOrganization"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Issuing organization
          </label>

          <input
            id="certificationOrganization"
            type="text"
            value={formData.organization ?? ""}
            onChange={(event) =>
              updateField("organization", event.target.value)
            }
            placeholder="e.g. Sheryians Coding School"
            maxLength={150}
            className="w-full rounded-xl border border-white/10 bg-[#09090F] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
          />
        </div>

        <div>
          <label
            htmlFor="certificationIssueDate"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Issue date
          </label>

          <input
            id="certificationIssueDate"
            type="month"
            value={formData.issueDate ?? ""}
            onChange={(event) =>
              updateField("issueDate", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#09090F] px-4 py-3 text-sm text-white outline-none [color-scheme:dark] focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            {editingIndex !== null ? "Update certification" : "Add certification"}
          </button>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {certifications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-gray-500">
            No certifications added yet.
          </p>
        ) : (
          certifications.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#09090F]/60 p-4 sm:flex-row sm:items-start"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-gray-100">
                  {item.name}
                </p>

                {item.organization && (
                  <p className="mt-1 break-words text-sm text-gray-400">
                    {item.organization}
                  </p>
                )}

                {item.issueDate && (
                  <p className="mt-1 text-xs text-gray-500">
                    Issued: {item.issueDate}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
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
          ))
        )}
      </div>

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving..." : "Save Certifications"}
      </button>
    </section>
  );
}
