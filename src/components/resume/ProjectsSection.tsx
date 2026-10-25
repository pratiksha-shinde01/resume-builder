
"use client";

import { useState } from "react";
import api from "@/lib/axios";

export type Project = {
  title: string;
  description: string;
  techstack: string[];
  githubUrl: string;
  LiveUrl: string;
};

type ProjectsSectionProps = {
  resumeId: string;
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  onSaved: (projects: Project[]) => void;
};

const emptyProject: Project = {
  title: "",
  description: "",
  techstack: [],
  githubUrl: "",
  LiveUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#12111B] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-300";

export default function ProjectsSection({
  resumeId,
  projects,
  onProjectsChange,
  onSaved,
}: ProjectsSectionProps) {
  const [form, setForm] = useState<Project>(emptyProject);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [techstackInput, setTechstackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (
    field: keyof Project,
    value: string | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyProject);
    setTechstackInput("");
    setEditingIndex(null);
  };

  const handleAddTech = () => {
    const tech = techstackInput.trim();
    if (!tech) return;

    const exists = form.techstack.some(
      (item) => item.toLowerCase() === tech.toLowerCase()
    );

    if (!exists) {
      updateField("techstack", [...form.techstack, tech]);
    }

    setTechstackInput("");
  };

  const removeTech = (techToRemove: string) => {
    updateField(
      "techstack",
      form.techstack.filter((tech) => tech !== techToRemove)
    );
  };

  const handleEdit = (index: number) => {
    const project = projects[index];

    setForm({
      ...project,
      techstack: [...(project.techstack ?? [])],
    });

    setTechstackInput("");
    setEditingIndex(index);
    setError("");
    setSuccess("");
  };

  const handleDelete = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);

    onProjectsChange(updatedProjects);
    setError("");
    setSuccess(
      "Project removed from the form. Click Save Projects to save the changes."
    );

    if (editingIndex === index) {
      resetForm();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    const normalizedProject: Project = {
      title: form.title.trim(),
      description: form.description.trim(),
      techstack: form.techstack,
      githubUrl: form.githubUrl.trim(),
      LiveUrl: form.LiveUrl.trim(),
    };

    let updatedProjects: Project[];

    if (editingIndex !== null) {
      updatedProjects = projects.map((project, index) =>
        index === editingIndex ? normalizedProject : project
      );
    } else {
      updatedProjects = [...projects, normalizedProject];
    }

    onProjectsChange(updatedProjects);
    resetForm();
    setSuccess(
      "Project added to the form. Click Save Projects to save the changes."
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/resume/${resumeId}`, {
        projects,
      });

      if (!response.data.success) {
        setError(response.data.message || "Projects save nahi hue.");
        return;
      }

      const savedProjects: Project[] =
        response.data.data?.projects ?? projects;

      onProjectsChange(savedProjects);
      onSaved(savedProjects);
      setSuccess("Projects saved successfully!");
    } catch (err: unknown) {
      console.error("Save projects error:", err);

      setError(
        "Projects save nahi hue. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12111B] p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Projects
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Showcase your development projects.
          </p>
        </div>

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
        >
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Project Title *</label>
          <input
            className={inputClass}
            placeholder="e.g. AI Resume Builder"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Project Description *</label>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            placeholder="Describe the project, its features, and your contribution..."
            value={form.description}
            onChange={(e) =>
              updateField("description", e.target.value)
            }
            required
            rows={4}
          />
        </div>

        <div>
          <label className={labelClass}>Tech Stack</label>

          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="e.g. React"
              value={techstackInput}
              onChange={(e) => setTechstackInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
            />

            <button
              type="button"
              onClick={handleAddTech}
              className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 text-sm font-medium text-violet-300 hover:bg-violet-500/20"
            >
              Add
            </button>
          </div>

          {form.techstack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.techstack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-200"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    aria-label={`Remove ${tech}`}
                    className="text-violet-300 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://github.com/username/project"
              value={form.githubUrl}
              onChange={(e) =>
                updateField("githubUrl", e.target.value)
              }
            />
          </div>

          <div>
            <label className={labelClass}>Live Demo URL</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://your-project.vercel.app"
              value={form.LiveUrl}
              onChange={(e) =>
                updateField("LiveUrl", e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            {editingIndex !== null ? "Update Project" : "Add Project"}
          </button>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-200">
          Added Projects
        </h3>

        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
            No projects added yet. Add your first project above.
          </p>
        ) : (
          projects.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className="rounded-xl border border-white/10 bg-[#09090F]/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-white">
                    {project.title}
                  </h4>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-400">
                    {project.description}
                  </p>

                  {project.techstack?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techstack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-300 hover:text-violet-200"
                      >
                        GitHub ↗
                      </a>
                    )}

                    {project.LiveUrl && (
                      <a
                        href={project.LiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-300 hover:text-violet-200"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>

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
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving Projects..." : "Save Projects"}
      </button>
    </section>
  );
}
