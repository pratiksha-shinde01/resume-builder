
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  {
    number: "01",
    icon: "✳",
    title: "AI-powered writing",
    description:
      "Transform your skills and experience into compelling, professional resume content with AI assistance.",
    gradient: "from-violet-500/15 to-purple-500/5",
  },
  {
    number: "02",
    icon: "◈",
    title: "ATS-friendly structure",
    description:
      "Present your experience, education, and technical skills in a clear, organized, recruiter-friendly format.",
    gradient: "from-indigo-500/15 to-blue-500/5",
  },
  {
    number: "03",
    icon: "✎",
    title: "Complete creative control",
    description:
      "Customize every section, refine your wording, and build a resume that reflects your own journey.",
    gradient: "from-fuchsia-500/15 to-pink-500/5",
  },
];

const skills = ["React.js", "JavaScript", "Node.js", "MongoDB"];

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/me", {
      credentials: "include",
      cache: "no-store",
    })
      .then((response) => {
        if (active) setLoggedIn(response.ok);
      })
      .catch(() => {
        if (active) setLoggedIn(false);
      })
      .finally(() => {
        if (active) setCheckingAuth(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const primaryHref = loggedIn ? "/dashboard" : "/register";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080810] text-white selection:bg-violet-500/30">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-10 h-[480px] w-[480px] rounded-full bg-violet-700/20 blur-[150px]" />
        <div className="absolute right-[-150px] top-[300px] h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[420px] w-[420px] rounded-full bg-fuchsia-700/10 blur-[150px]" />

        <div className="absolute inset-0 bg-[radial-gradient(#ffffff09_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080810]/10 to-[#080810]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080810]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-xl font-black shadow-lg shadow-violet-900/40 transition duration-300 group-hover:rotate-6 group-hover:scale-105">
              R
            </div>

            <div>
              <span className="text-xl font-bold tracking-tight">
                Resume<span className="text-violet-400">AI</span>
              </span>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Your career companion
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            {!checkingAuth && loggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-400 hover:to-indigo-400 sm:px-5"
              >
                Dashboard <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white sm:px-4"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-400 hover:to-indigo-400 sm:px-5"
                >
                  Get started <span aria-hidden="true">↗</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-32 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 px-4 py-2 text-xs font-medium text-violet-200 shadow-lg shadow-violet-950/10 sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
            Your smarter resume starts here
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[68px]">
            Make your
            <br />
            next move
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              unforgettable.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
            Build a resume that tells your story. Improve your content with AI,
            highlight your projects, and present your skills with confidence.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              aria-disabled={checkingAuth}
              onClick={(event) => {
                if (checkingAuth) event.preventDefault();
              }}
              className={`group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-7 py-4 font-semibold shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-1 hover:shadow-violet-900/40 ${
                checkingAuth ? "cursor-wait opacity-70" : ""
              }`}
            >
              {checkingAuth
                ? "Checking account..."
                : loggedIn
                  ? "Open dashboard"
                  : "Build my resume"}

              {!checkingAuth && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-4 font-medium text-gray-200 backdrop-blur-xl transition hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
            >
              I have an account
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
            {["AI assistance", "Manual editing", "Resume management"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  {item}
                </span>
              ),
            )}
          </div>

          <div className="mt-12 flex items-center gap-4 border-t border-white/[0.08] pt-6">
            <div className="flex -space-x-2">
              {["P", "A", "R"].map((letter, index) => (
                <div
                  key={letter}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#080810] text-xs font-bold ${
                    index === 0
                      ? "bg-violet-500"
                      : index === 1
                        ? "bg-fuchsia-500"
                        : "bg-indigo-500"
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-200">
                Your story, professionally presented
              </p>
              <p className="mt-1 text-xs text-gray-500">
                AI assistance meets your personal touch.
              </p>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="relative mx-auto w-full max-w-[510px] lg:ml-auto">
          <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-violet-600/25 via-indigo-600/15 to-fuchsia-600/20 blur-3xl" />

          <div className="absolute -left-5 top-1/4 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-[#191725]/95 via-[#11101A]/95 to-[#111322]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-6">
            {/* Preview toolbar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-2 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 text-lg text-violet-300">
                  ✦
                </div>
                <div>
                  <p className="font-semibold">Resume workspace</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Your next chapter starts here
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs text-emerald-300">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ready
              </span>
            </div>

            <div className="my-5 flex items-center justify-between px-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  Live preview
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  Professional resume
                </p>
              </div>

              <span className="rounded-lg border border-violet-400/20 bg-gradient-to-r from-violet-500/15 to-indigo-500/10 px-3 py-2 text-xs font-medium tracking-wider text-violet-300">
                A4 FORMAT
              </span>
            </div>

            {/* Resume sheet */}
            <div className="mx-auto max-w-[360px] rounded-md bg-[#FDFDFE] p-5 text-gray-800 shadow-[0_16px_50px_rgba(0,0,0,0.4)] sm:p-7">
              <div className="border-b-2 border-violet-600 pb-4">
                <p className="text-[19px] font-extrabold tracking-tight text-gray-900">
                  YOUR NAME
                </p>
                <p className="mt-1.5 text-[10px] font-semibold tracking-wide text-violet-700">
                  FRONTEND DEVELOPER
                </p>

                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[8px] text-gray-500">
                  <span>✉ your@email.com</span>
                  <span>☎ +91 00000 00000</span>
                  <span>⌖ Mumbai, India</span>
                </div>
              </div>

              <div className="mt-5">
                <p className="border-b border-gray-200 pb-1.5 text-[9px] font-extrabold tracking-[0.13em] text-gray-800">
                  PROFESSIONAL SUMMARY
                </p>
                <div className="mt-3 space-y-2">
                  <div className="h-1.5 w-full rounded bg-gray-200" />
                  <div className="h-1.5 w-[95%] rounded bg-gray-200" />
                  <div className="h-1.5 w-[77%] rounded bg-gray-200" />
                </div>
              </div>

              <div className="mt-5">
                <p className="border-b border-gray-200 pb-1.5 text-[9px] font-extrabold tracking-[0.13em] text-gray-800">
                  TECHNICAL SKILLS
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded border border-violet-100 bg-violet-50 px-2 py-1 text-[8px] font-medium text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="border-b border-gray-200 pb-1.5 text-[9px] font-extrabold tracking-[0.13em] text-gray-800">
                  EXPERIENCE
                </p>
                <div className="mt-3 flex gap-3">
                  <div className="mt-0.5 h-9 w-1 shrink-0 rounded-full bg-violet-400" />
                  <div className="flex-1">
                    <div className="h-2 w-28 rounded bg-gray-700" />
                    <div className="mt-2 h-1.5 w-24 rounded bg-violet-300" />
                    <div className="mt-3 space-y-2">
                      <div className="h-1.5 w-full rounded bg-gray-200" />
                      <div className="h-1.5 w-[88%] rounded bg-gray-200" />
                      <div className="h-1.5 w-[72%] rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="border-b border-gray-200 pb-1.5 text-[9px] font-extrabold tracking-[0.13em] text-gray-800">
                  PROJECTS
                </p>
                <div className="mt-3 h-2 w-32 rounded bg-gray-700" />
                <div className="mt-3 space-y-2">
                  <div className="h-1.5 w-full rounded bg-gray-200" />
                  <div className="h-1.5 w-[86%] rounded bg-gray-200" />
                </div>
              </div>

              <div className="mt-5">
                <p className="border-b border-gray-200 pb-1.5 text-[9px] font-extrabold tracking-[0.13em] text-gray-800">
                  EDUCATION
                </p>
                <div className="mt-3 h-2 w-36 rounded bg-gray-700" />
                <div className="mt-2 h-1.5 w-24 rounded bg-gray-300" />
              </div>
            </div>

            {/* AI assistant callout */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-500/[0.10] to-indigo-500/[0.06] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/15 text-xl text-violet-300">
                ✧
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Make every detail count
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Improve your content with AI, then personalize it yourself.
                </p>
              </div>
            </div>
          </div>

          {/* Floating detail */}
          <div className="absolute -right-2 top-24 hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#211C32] to-[#141321] p-4 shadow-xl shadow-black/30 sm:block sm:-right-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                ✓
              </div>
              <div>
                <p className="text-xs font-semibold">AI writing assistant</p>
                <p className="mt-1 text-[10px] text-gray-500">
                  Ready to help
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 border-t border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-400">
              Everything in one place
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              A better resume.
              <span className="mt-2 block bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                A clearer way forward.
              </span>
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-gray-400">
              Spend less time struggling with words and more time showcasing
              what makes you a great candidate.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br ${feature.gradient} p-px transition duration-300 hover:-translate-y-1 hover:border-violet-400/30`}
              >
                <div className="relative h-full rounded-[23px] bg-[#101018]/95 p-7 transition duration-300 group-hover:bg-[#14121F]/95">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 text-2xl text-violet-300 transition duration-300 group-hover:scale-105 group-hover:border-violet-400/30">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium tracking-widest text-gray-600">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-gray-400">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-px w-full bg-gradient-to-r from-violet-400/30 via-indigo-400/10 to-transparent" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-violet-300/20 bg-gradient-to-br from-[#1C1532] via-[#171326] to-[#10111D] px-6 py-14 text-center shadow-2xl shadow-violet-950/20 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-violet-500/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 text-2xl text-violet-200 shadow-lg shadow-violet-950/20">
              ✦
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Your experience deserves
              <span className="mt-2 block bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                a great first impression.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
              Bring your skills, projects, and ambitions together in a resume
              designed to tell your story.
            </p>

            <Link
              href={primaryHref}
              aria-disabled={checkingAuth}
              onClick={(event) => {
                if (checkingAuth) event.preventDefault();
              }}
              className={`group mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-7 py-4 font-semibold text-white shadow-xl shadow-violet-950/30 transition duration-300 hover:-translate-y-1 hover:from-violet-400 hover:to-indigo-400 ${
                checkingAuth ? "cursor-wait opacity-70" : ""
              }`}
            >
              {checkingAuth
                ? "Checking account..."
                : loggedIn
                  ? "Go to dashboard"
                  : "Get started"}

              {!checkingAuth && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link href="/" className="text-lg font-bold">
            Resume<span className="text-violet-400">AI</span>
          </Link>

          <p className="text-sm text-gray-500">
            Build with confidence. Take the next step.
          </p>

          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ResumeAI
          </p>
        </div>
      </footer>
    </main>
  );
}
