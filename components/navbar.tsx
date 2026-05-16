import Link from "next/link";
import { Sparkles } from "lucide-react";

import { GradientButton } from "@/components/gradient-button";

const navItems = [
  { title: "Features", href: "/#features" },
  { title: "Workflow", href: "/#workflow" },
  { title: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Sparkles className="size-5 text-cyan-300" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">
            ContentFlow AI
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <GradientButton href="/generate" className="hidden h-10 px-4 md:inline-flex">
          Start creating
        </GradientButton>
      </nav>
    </header>
  );
}
