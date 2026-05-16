import Link from "next/link";
import { LockKeyhole, UserCircle } from "lucide-react";

import { Sidebar } from "@/components/sidebar";

type DashboardShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.14),transparent_28%)]" />
      <div className="flex">
        <Sidebar />
        <section className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-white/10 bg-slate-950/55 px-5 py-5 backdrop-blur-xl sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  <LockKeyhole className="size-3.5" />
                  Protected workspace
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                <UserCircle className="size-5 text-cyan-300" />
                <span>Auth preview</span>
                <Link href="/login" className="font-medium text-white hover:text-cyan-200">
                  Sign in
                </Link>
              </div>
            </div>
          </header>
          <div className="flex-1 p-5 sm:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
