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

      setUser(userResponse.data.data.user);

      const resumeResponse = await api.get("/resume");

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

      if (response.data.success) {
        router.push(`/dashboard/resume/${response.data.data._id}`);
      } else {
        setError(response.data.message || "Could not create resume.");
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
        setResumes((current) =>
          current.filter((resume) => resume._id !== resumeId)
        );
      } else {
        setError(response.data.message || "Could not delete resume.");
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

  const getInitials = (name?: string) => {
    if (!name?.trim()) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return "Recently created";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently created";
    }

    return `Updated ${parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    })}`;
  };

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#121224] text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/50 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
          <p className="mt-4 text-sm text-violet-200">
            Preparing your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#0B0D19] text-white selection:bg-violet-500/30">
      {/* Ambient background: soft blurred color circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-48 -top-40 h-[560px] w-[560px] rounded-full bg-violet-600/[0.16] blur-[140px]" />
        <div className="absolute -right-48 top-[18%] h-[520px] w-[520px] rounded-full bg-indigo-600/[0.13] blur-[140px]" />
        <div className="absolute -bottom-64 left-[22%] h-[560px] w-[560px] rounded-full bg-fuchsia-600/[0.08] blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101126]/40 via-transparent to-[#111126]/60" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        {/* Navigation */}
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0B0D19]/75 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/50 ring-1 ring-white/15">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12a2.5 2.5 0 0 1 2-2.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3.75v5h5M8.5 13h6M8.5 16.5h6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[15px] font-bold tracking-tight">
                  Resume<span className="text-violet-400">AI</span>
                </p>
                <p className="text-[10px] tracking-[0.18em] text-[#9692B1]">
                  CAREER WORKSPACE
                </p>
              </div>
            </button>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">
                  {user?.name || "Welcome"}
                </p>
                <p className="mt-0.5 max-w-48 truncate text-xs text-[#A5A1BC]">
                  {user?.email}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/30 bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-sm font-bold text-violet-100 shadow-lg shadow-violet-950/20">
                {getInitials(user?.name)}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#D0CDE0] transition hover:border-red-400/30 hover:bg-red-400/[0.08] hover:text-red-300 sm:px-4"
              >
                <span className="hidden sm:inline">Log out</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 sm:hidden"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M10 17l5-5-5-5M15 12H3m9-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pt-12">
          {/* Welcome hero */}
          <section className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-[#201A3B]/95 via-[#19182F]/95 to-[#13182B]/95 p-6 shadow-2xl shadow-violet-950/10 backdrop-blur-xl sm:p-9 lg:p-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-500/20 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 right-[25%] h-64 w-64 rounded-full bg-indigo-500/15 blur-[100px]"
            />
            <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border border-violet-200/[0.10]" />
            <div className="pointer-events-none absolute -right-4 -top-16 h-64 w-64 rounded-full border border-violet-200/[0.10]" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/[0.10] px-3 py-1.5 text-xs font-medium text-violet-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                  YOUR PERSONAL CAREER WORKSPACE
                </div>

                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
                  Welcome back
                  {user?.name?.trim() ? (
                    <>
                      ,{" "}
                      <span className="bg-gradient-to-r from-violet-200 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                        {user.name.trim()}
                      </span>
                    </>
                  ) : ""}
                  !
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#C0BCD5] sm:text-base">
                  Build a resume that gets noticed. Create, refine, and
                  optimize your resume with AI — all from one workspace.
                </p>

                <button
                  type="button"
                  onClick={handleCreateResume}
                  disabled={creating || deletingId !== null}
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-violet-950/40 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating your resume...
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                      Create a new resume
                    </>
                  )}
                </button>
              </div>

              {/* Resume illustration */}
              <div className="hidden min-w-[240px] items-center justify-center lg:flex">
                <div className="relative flex h-48 w-48 rotate-3 items-center justify-center rounded-[30px] border border-white/15 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur-xl">
                  <div className="absolute inset-3 rounded-[23px] border border-violet-300/15" />
                  <svg
                    viewBox="0 0 100 120"
                    fill="none"
                    className="h-32 w-28 text-violet-200"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="17"
                      y="7"
                      width="66"
                      height="106"
                      rx="7"
                      fill="#8B5CF6"
                      fillOpacity=".12"
                    />
                    <circle
                      cx="37"
                      cy="31"
                      r="9"
                      fill="#A78BFA"
                      fillOpacity=".4"
                    />
                    <path
                      d="M26 49c0-6 5-9 11-9s11 3 11 9v3H26v-3Z"
                      fill="#A78BFA"
                      fillOpacity=".4"
                    />
                    <path
                      d="M55 25h17M55 32h12M27 65h46M27 73h46M27 81h35M27 95h46"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute -bottom-4 -left-5 rounded-xl border border-violet-200/15 bg-[#25203D]/95 px-3 py-2 shadow-xl backdrop-blur-xl">
                    <p className="text-xs font-semibold text-violet-200">
                      AI-powered
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#B5B0CB]">
                      Resume assistant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-violet-300/[0.12] bg-gradient-to-br from-[#19172B]/90 to-[#121522]/90 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-violet-300/25">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#B7B2CE]">Total resumes</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.12] text-violet-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12a2.5 2.5 0 0 1 2-2.5Z"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 3.75v5h5M9 13h6M9 16h6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight">
                {resumes.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-[#9994B0]">
                Resumes in your workspace
              </p>
            </article>

            <article className="rounded-2xl border border-indigo-300/[0.12] bg-gradient-to-br from-[#18182D]/90 to-[#121522]/90 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-indigo-300/25">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#B7B2CE]">Your workspace</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300/10 bg-indigo-400/[0.12] text-indigo-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      d="M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">
                AI-powered
              </p>
              <p className="mt-2 text-xs text-[#9994B0]">
                Tools to refine your resume
              </p>
            </article>

            <article className="rounded-2xl border border-emerald-300/[0.12] bg-gradient-to-br from-[#16232B]/90 to-[#121522]/90 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-emerald-300/25 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#B7B2CE]">Next step</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/10 bg-emerald-400/[0.12] text-emerald-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">
                {resumes.length === 0 ? "Start creating" : "Keep improving"}
              </p>
              <p className="mt-2 text-xs text-[#9994B0]">
                {resumes.length === 0
                  ? "Create your first professional resume"
                  : "Review and update your resume content"}
              </p>
            </article>
          </section>

          {/* Resume collection */}
          <section className="mt-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-violet-300">
                  YOUR DOCUMENTS
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  My resumes
                </h2>
                <p className="mt-2 text-sm text-[#AAA5C1]">
                  All your resumes, organized in one place.
                </p>
              </div>

              {resumes.length > 0 && (
                <p className="text-sm text-[#AAA5C1]">
                  <span className="font-semibold text-white">
                    {resumes.length}
                  </span>{" "}
                  {resumes.length === 1 ? "document" : "documents"}
                </p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.08] p-4 text-sm text-red-300 backdrop-blur-xl"
              >
                <span className="font-bold">!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Empty state */}
            {resumes.length === 0 ? (
              <div className="mt-7 rounded-3xl border border-dashed border-violet-200/15 bg-gradient-to-br from-[#19172B]/80 to-[#121522]/80 px-6 py-16 text-center shadow-xl shadow-black/10 backdrop-blur-xl sm:py-20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.10] text-violet-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12a2.5 2.5 0 0 1 2-2.5Z"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 3.75v5h5M9 13h6M9 16h6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Your next opportunity starts here
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#AAA5C1]">
                  You haven't created a resume yet. Build your first one
                  and use AI tools to make your profile stand out.
                </p>

                <button
                  type="button"
                  onClick={handleCreateResume}
                  disabled={creating || deletingId !== null}
                  className="mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create your first resume"}
                </button>
              </div>
            ) : (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {resumes.map((resume) => (
                  <article
                    key={resume._id}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#19172B]/95 via-[#141523]/95 to-[#111522]/95 shadow-lg shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:shadow-xl hover:shadow-violet-950/20"
                  >
                    <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-fuchsia-400 opacity-80 transition group-hover:opacity-100" />

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.15] to-indigo-400/[0.08] text-violet-200">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12a2.5 2.5 0 0 1 2-2.5Z"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 3.75v5h5M9 13h6M9 16h6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <span className="rounded-full border border-emerald-300/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-medium text-emerald-200">
                          Saved
                        </span>
                      </div>

                      <h3
                        className="mt-5 truncate text-lg font-semibold tracking-tight"
                        title={resume.title?.trim() || "Untitled Resume"}
                      >
                        {resume.title?.trim() || "Untitled Resume"}
                      </h3>

                      <p className="mt-2 text-xs text-[#A5A1BC]">
                        {formatDate(resume.updatedAt)}
                      </p>

                      <div className="mt-6 flex gap-3 border-t border-white/[0.08] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/resume/${resume._id}`)
                          }
                          disabled={deletingId !== null}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-300/10 bg-gradient-to-r from-violet-500/[0.15] to-indigo-500/[0.12] px-3 py-2.5 text-sm font-semibold text-violet-100 transition hover:border-violet-300/25 hover:from-violet-500/25 hover:to-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit resume
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              d="M5 12h14m-6-6 6 6-6 6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteResume(resume._id)}
                          disabled={deletingId !== null || creating}
                          aria-label={`Delete ${resume.title?.trim() || "Untitled Resume"}`}
                          title="Delete resume"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-300/15 bg-red-400/[0.03] text-red-300/90 transition hover:border-red-300/30 hover:bg-red-400/[0.10] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === resume._id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300/30 border-t-red-300" />
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            >
                              <path
                                d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="mt-16 border-t border-white/[0.08] pt-6 text-center text-xs text-[#85819D]">
            Built for your next career move · ResumeAI
          </footer>
        </div>
      </div>
    </main>
  );
}