import { CalendarDays, History, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { GlassCard } from "@/components/glass-card";
import { GradientButton } from "@/components/gradient-button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const typeLabels: Record<string, string> = {
  CAPTION: "Caption",
  HOOK: "Hook",
  HASHTAGS: "Hashtags",
  REWRITE: "Rewrite",
  CONTENT_IDEA: "Content idea",
};

export default async function HistoryPage() {
  const user = await requireUser();
  const generations = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell
      title="History"
      description="Review your saved Gemini generations, newest first."
    >
      {generations.length === 0 ? (
        <GlassCard className="flex min-h-[420px] items-center justify-center p-6 text-center">
          <div className="mx-auto max-w-md">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
              <History className="size-7 text-cyan-300" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold">No generations yet</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Generate your first caption, hook, hashtags, rewrite, or content
              idea and it will appear here automatically.
            </p>
            <div className="mt-7">
              <GradientButton href="/generate">
                <Sparkles className="size-4" />
                Generate content
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-5">
          {generations.map((generation) => (
            <GlassCard key={generation.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      {typeLabels[generation.type] ?? generation.type}
                    </span>
                    {generation.platform ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                        {generation.platform}
                      </span>
                    ) : null}
                    {generation.tone ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                        {generation.tone}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">
                    {generation.prompt}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays className="size-4 text-cyan-300" />
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(generation.createdAt)}
                </div>
              </div>
              <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
                {generation.output}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
