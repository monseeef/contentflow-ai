import { History, Sparkles } from "lucide-react";
import type { Generation } from "@prisma/client";

import { DashboardShell } from "@/components/dashboard-shell";
import { GlassCard } from "@/components/glass-card";
import { GradientButton } from "@/components/gradient-button";
import { HistoryList } from "@/components/history/history-list";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type HistoryGenerationRecord = Pick<
  Generation,
  "id" | "type" | "prompt" | "output" | "platform" | "tone" | "createdAt"
>;

export default async function HistoryPage() {
  const user = await requireUser();
  const generations: HistoryGenerationRecord[] = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      prompt: true,
      output: true,
      platform: true,
      tone: true,
      createdAt: true,
    },
  });

  return (
    <DashboardShell
      title="History"
      description="Search, filter, and copy your saved Gemini generations."
    >
      {generations.length === 0 ? (
        <GlassCard className="flex min-h-[460px] items-center justify-center p-6 text-center">
          <div className="mx-auto max-w-md">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 shadow-2xl shadow-cyan-950/30">
              <History className="size-8 text-cyan-300" />
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
        <HistoryList
          generations={generations.map((generation: HistoryGenerationRecord) => ({
            id: generation.id,
            type: generation.type,
            prompt: generation.prompt,
            output: generation.output,
            platform: generation.platform,
            tone: generation.tone,
            createdAt: generation.createdAt.toISOString(),
          }))}
        />
      )}
    </DashboardShell>
  );
}
