
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import UserModel from "@/models/User.model";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  let userId: string;

  try {
    userId = await getCurrentUser();
  } catch {
    redirect("/login");
  }

  await connectDB();

  const user = await UserModel.findById(userId)
    .select("name email")
    .lean();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="text-xl font-bold">
            Resume<span className="text-violet-400">Builder</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-300 sm:block">
              {user.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-medium text-violet-400">
          YOUR WORKSPACE
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Welcome, {user.name}!
        </h1>

        <p className="mt-3 text-slate-400">{user.email}</p>

        <p className="mt-3 max-w-2xl text-slate-400">
          Create a professional, ATS-friendly resume with the help of AI.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="text-2xl">📄</div>
            <h2 className="mt-4 text-lg font-semibold">My Resumes</h2>
            <p className="mt-2 text-sm text-slate-400">
              View and manage your resumes in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="text-2xl">✨</div>
            <h2 className="mt-4 text-lg font-semibold">AI Resume Builder</h2>
            <p className="mt-2 text-sm text-slate-400">
              Build a resume tailored to your target role.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="text-2xl">🎯</div>
            <h2 className="mt-4 text-lg font-semibold">ATS Score</h2>
            <p className="mt-2 text-sm text-slate-400">
              Improve your resume content for applicant tracking systems.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
