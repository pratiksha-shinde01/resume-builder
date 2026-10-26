"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      if (response.data.success) {
        // The backend sets the HTTP-only authentication cookie.
        router.push("/dashboard");
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (
          err as { response?: { data?: { message?: string } } }
        ).response;

        setError(response?.data?.message || "Unable to login. Try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#302B40] bg-[#0D0C14] px-4 py-3.5 text-sm text-white placeholder:text-[#777386] outline-none transition duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090F] px-4 py-10 text-white selection:bg-violet-500/30 sm:px-6">
      {/* Subtle background glow — dark theme preserved */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-32 h-[420px] w-[420px] rounded-full bg-violet-600/[0.10] blur-[130px]" />
        <div className="absolute -right-40 top-[25%] h-[400px] w-[400px] rounded-full bg-indigo-500/[0.07] blur-[140px]" />
        <div className="absolute -bottom-48 left-[25%] h-[350px] w-[350px] rounded-full bg-purple-500/[0.06] blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Brand */}
        <a
          href="/"
          className="mb-9 flex items-center justify-center gap-3"
          aria-label="Resume Builder home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-extrabold shadow-lg shadow-violet-950/40">
            R
          </div>

          <span className="text-xl font-bold tracking-tight">
            Resume<span className="text-violet-400">AI</span>
          </span>
        </a>

        {/* Login card */}
        <section className="rounded-3xl border border-white/[0.09] bg-[#111019]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3 py-1.5 text-xs font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              YOUR CAREER JOURNEY CONTINUES
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">
              Welcome back<span className="text-violet-400">.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#A5A1B5]">
              Sign in to manage your resumes and take the next step in your
              career.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#E5E1F0]"
              >
                Email address
              </label>

              <div className="relative">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#777386]"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#E5E1F0]"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#777386]"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass} pl-11 pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 py-1 text-xs font-medium text-[#A5A1B5] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#111019] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeOpacity=".25"
                      strokeWidth="3"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to your account
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  >
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-xs text-[#777386]">NEW TO RESUMEAI?</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <a
            href="/register"
            className="flex w-full items-center justify-center rounded-xl border border-[#353047] bg-white/[0.02] px-4 py-3.5 text-sm font-semibold text-[#E5E1F0] transition hover:border-violet-400/40 hover:bg-violet-500/[0.06] hover:text-white"
          >
            Create an account
          </a>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-[#777386]">
          Build your resume. Showcase your skills. Move your career forward.
        </p>

        <p className="mt-4 text-center text-xs text-[#625E72]">
          Secure sign-in · Your career, your future
        </p>
      </div>
    </main>
  );
}