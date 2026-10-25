
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    "w-full rounded-xl border border-[#353047] bg-[#100F19] px-4 py-3 text-sm text-white placeholder:text-[#777386] outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090F] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl font-bold text-violet-300">
            R
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#A5A1B5]">
            Sign in to continue building your resume.
          </p>
        </div>

        <div className="rounded-2xl border border-[#292536] bg-[#12111B]/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#E5E1F0]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#E5E1F0]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={inputClass}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#12111B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="my-6 h-px bg-[#292536]" />

          <p className="text-center text-sm text-[#A5A1B5]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-violet-300 transition hover:text-violet-200"
            >
              Create account
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#777386]">
          Your next career opportunity starts here.
        </p>
      </div>
    </main>
  );
}
