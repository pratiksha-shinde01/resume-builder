"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Resume = {
  _id: string;
  title?: string;
  updatedAt?: string;
};

type User = {
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const userResponse = await api.get("auth/me");

      if (!userResponse.data.success) {
        router.replace("/login");
        return;
      }

      setUser(userResponse.data.data);

      const resumeResponse = await api.get("/resume");
      console.log("Resume API response:", resumeResponse.data);

      if (resumeResponse.data.success) {
        setResumes(resumeResponse.data.data);
      }
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleCreateResume() {
    try {
      setCreating(true);
      setError("");

      const response = await api.post("resume/create");
      console.log("Created resume response:", response.data);

      if (response.data.success) {
        const resumeId = response.data.data._id;
        router.push(`/dashboard/resume/${resumeId}`);
      } else {
        setError(
          response.data.message || "Could not create resume."
        );
      }
    } catch {
      setError("Resume create nahi hua. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteResume(resumeId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(resumeId);
      setError("");

      const response = await api.delete(`/resume/${resumeId}`);

      if (response.data.success) {
        setResumes((currentResumes) =>
          currentResumes.filter(
            (resume) => resume._id !== resumeId
          )
        );
      } else {
        setError(
          response.data.message || "Could not delete resume."
        );
      }
    } catch {
      setError("Resume delete nahi hua. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    try {
      await api.post("auth/logout");
      router.replace("/login");
    } catch {
      setError("Logout failed. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090F] text-violet-300">
        Loading your dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090F] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292536] pb-6">
          <div>
            <p className="text-sm font-medium text-violet-300">
              AI RESUME BUILDER
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#A5A1B5]">
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-[#353047] px-4 py-2 text-sm transition hover:bg-[#1A1725]"
          >
            Logout
          </button>
        </header>

        <section className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">My Resumes</h2>

            <p className="mt-1 text-sm text-[#A5A1B5]">
              Manage and improve your resumes in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateResume}
            disabled={creating || deletingId !== null}
            className="rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creating..." : "+ Create New Resume"}
          </button>
        </section>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        {resumes.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#353047] bg-[#12111B] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/15 text-2xl text-violet-300">
              ▤
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Create your first resume
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#A5A1B5]">
              Start with a new resume and use AI tools to improve your content.
            </p>

            <button
              type="button"
              onClick={handleCreateResume}
              disabled={creating || deletingId !== null}
              className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Resume"}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <article
                key={resume._id}
                className="rounded-2xl border border-[#292536] bg-[#12111B] p-5 transition hover:border-violet-500/60"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <span className="text-xl">▤</span>
                </div>

                <h3 className="truncate font-semibold">
                  {resume.title?.trim() || "Untitled Resume"}
                </h3>

                <p className="mt-2 text-xs text-[#A5A1B5]">
                  {resume.updatedAt
                    ? `Updated ${new Date(
                        resume.updatedAt
                      ).toLocaleDateString()}`
                    : "Recently created"}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/resume/${resume._id}`)
                  }
                  disabled={deletingId !== null}
                  className="mt-5 w-full rounded-xl border border-[#353047] py-2.5 text-sm font-medium transition hover:border-violet-500 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit Resume
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteResume(resume._id)}
                  disabled={deletingId !== null || creating}
                  className="mt-2 w-full rounded-xl border border-red-500/30 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === resume._id
                    ? "Deleting..."
                    : "Delete Resume"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}