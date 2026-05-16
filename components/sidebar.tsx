import Link from "next/link";
import { History, LayoutDashboard, PenLine, Sparkles } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Generate", href: "/generate", icon: PenLine },
  { title: "History", href: "/history", icon: History },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "hidden min-h-screen w-72 flex-col border-r border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl lg:flex",
        className,
      )}
    >
      <Link href="/" className="mb-8 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
          <Sparkles className="size-5 text-white" />
        </span>
        <span className="font-semibold text-white">ContentFlow AI</span>
      </Link>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4 text-cyan-300" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </aside>
  );
}
