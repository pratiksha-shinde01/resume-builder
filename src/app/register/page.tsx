
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      setError("Mobile number must contain exactly 10 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.mobile && { mobile: form.mobile }),
      });

      if (response.data.success) {
        setSuccess("Account created successfully!");
        router.push("/login");
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (
          err as { response?: { data?: { message?: string } } }
        ).response;

        setError(response?.data?.message || "Registration failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#353047] bg-[#100F19] px-4 py-3 text-sm text-white placeholder:text-[#777386] outline-none transition duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090F] px-4 py-10 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl font-bold text-violet-300 shadow-lg shadow-violet-950/30">
            R
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#A5A1B5]">
            Your next career opportunity starts here.
          </p>
        </div>

        {/* Register card */}
        <div className="rounded-2xl border border-[#292536] bg-[#12111B]/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#E5E1F0]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

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
                htmlFor="mobile"
                className="mb-2 block text-sm font-medium text-[#E5E1F0]"
              >
                Mobile number{" "}
                <span className="font-normal text-[#777386]">
                  (optional)
                </span>
              </label>

              <input
                id="mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={form.mobile}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
                placeholder="10-digit mobile number"
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
                autoComplete="new-password"
                minLength={6}
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
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

            {success && (
              <p
                role="status"
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#12111B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="my-6 h-px bg-[#292536]" />

          <p className="text-center text-sm text-[#A5A1B5]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-violet-300 transition hover:text-violet-200"
            >
              Sign in
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#777386]">
          Build your future, one resume at a time.
        </p>
      </div>
    </main>
  );
}
