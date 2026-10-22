
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthResponse = {
  success: boolean;
  message: string;
  data?: {
    user?: {
      _id: string;
      name: string;
      email: string;
    };
  };
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegister && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const payload = isRegister
        ? {
            name: name.trim(),
            email: email.trim(),
            password,
            ...(mobile.trim() && { mobile: mobile.trim() }),
          }
        : {
            email: email.trim(),
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const result: AuthResponse = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Something went wrong.");
        return;
      }

      setSuccess(result.message || "Authentication successful.");

      // The backend sets the httpOnly authentication cookie.
      // Do not store the JWT in localStorage.
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <Link
          href="/"
          className="text-sm font-semibold text-violet-400"
        >
          ← Resume Builder
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {isRegister
              ? "Create an account to start building your resume."
              : "Sign in to continue building your resume."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {isRegister && (
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {isRegister && (
            <div>
              <label
                htmlFor="mobile"
                className="mb-2 block text-sm font-medium"
              >
                Mobile number <span className="text-slate-500">(optional)</span>
              </label>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                pattern="[0-9]{10}"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                required
                minLength={isRegister ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isRegister ? "At least 6 characters" : "Enter your password"
                }
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 pr-20 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-violet-400 hover:text-violet-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isRegister ? "Already have an account?" : "New to Resume Builder?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            {isRegister ? "Sign in" : "Create account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
