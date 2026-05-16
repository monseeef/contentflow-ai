import Link from "next/link";
import { Sparkles } from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";
import { GlassCard } from "@/components/glass-card";

export default function RegisterPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="fixed inset-0 -z-10 premium-grid" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(168,85,247,0.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.18),transparent_26%)]" />
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Start building
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
              Create your AI content operations account.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Create a secure workspace with hashed passwords and an httpOnly
              cookie session.
            </p>
          </div>

          <GlassCard className="mx-auto w-full max-w-md p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
                <Sparkles className="size-5 text-white" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Register</h2>
                <p className="mt-1 text-sm text-slate-400">Create your workspace</p>
              </div>
            </div>

            <RegisterForm />

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-cyan-200 hover:text-white">
                Log in
              </Link>
            </p>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
