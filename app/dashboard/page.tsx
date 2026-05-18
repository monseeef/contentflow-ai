import Link from "next/link";
import type { Generation, GenerationType } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  FileText,
  Hash,
  Lightbulb,
  PenLine,
  Sparkles,
  TrendingUp,
  WandSparkles,
} from "lucide-react";

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

type RecentGeneration = Pick<
  Generation,
  | "id"
  | "type"
  | "prompt"
  | "output"
  | "platform"
  | "tone"
  | "createdAt"
>;

type GenerationTypeRecord = {
  type: GenerationType;
};

type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

const quickActions = [
  {
    title: "Generate caption",
    description: "Polished captions with hooks and a natural CTA.",
    href: "/generate?type=CAPTION",
    icon: PenLine,
  },
  {
    title: "Create hooks",
    description: "Fast opening lines built to earn attention.",
    href: "/generate?type=HOOK",
    icon: Sparkles,
  },
  {
    title: "Generate hashtags",
    description: "Focused hashtag clusters for reach and intent.",
    href: "/generate?type=HASHTAGS",
    icon: Hash,
  },
  {
    title: "Rewrite content",
    description: "Sharper versions of an existing draft.",
    href: "/generate?type=REWRITE",
    icon: WandSparkles,
  },
];

function formatDate(date: Date | null) {
  if (!date) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const weekStart = new Date(now);

  weekStart.setDate(now.getDate() - diff);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const weekStart = getWeekStart();

  const totalGenerationsPromise: Promise<number> = prisma.generation.count({
    where: { userId: user.id },
  });
  const weeklyGenerationsPromise: Promise<number> = prisma.generation.count({
    where: {
      userId: user.id,
      createdAt: { gte: weekStart },
    },
  });
  const recentGenerationsPromise: Promise<RecentGeneration[]> =
    prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
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
  const generationTypesPromise: Promise<GenerationTypeRecord[]> =
    prisma.generation.findMany({
      where: { userId: user.id },
      select: {
        type: true,
      },
    });

  const [totalGenerations, weeklyGenerations, recentGenerations, generationTypes]: [
    number,
    number,
    RecentGeneration[],
    GenerationTypeRecord[],
  ] = await Promise.all([
    totalGenerationsPromise,
    weeklyGenerationsPromise,
    recentGenerationsPromise,
    generationTypesPromise,
  ]);

  const typeCounts = generationTypes.reduce<Record<GenerationType, number>>(
    (counts, generation) => {
      counts[generation.type] += 1;
      return counts;
    },
    {
      CAPTION: 0,
      HOOK: 0,
      HASHTAGS: 0,
      REWRITE: 0,
      CONTENT_IDEA: 0,
    },
  );

  const mostUsedTypeEntry = Object.entries(typeCounts).sort(
    ([, countA], [, countB]) => countB - countA,
  )[0] as [GenerationType, number] | undefined;

  const mostUsedType = mostUsedTypeEntry?.[1]
    ? typeLabels[mostUsedTypeEntry[0]] ?? mostUsedTypeEntry[0]
    : "No data yet";
  const lastGenerationDate = recentGenerations[0]?.createdAt ?? null;

  const metrics: DashboardMetric[] = [
    {
      label: "Total generations",
      value: totalGenerations.toString(),
      detail: "All saved outputs",
      icon: FileText,
    },
    {
      label: "This week",
      value: weeklyGenerations.toString(),
      detail: "Created since Monday",
      icon: TrendingUp,
    },
    {
      label: "Most used type",
      value: mostUsedType,
      detail: mostUsedTypeEntry?.[1]
        ? `${mostUsedTypeEntry[1]} saved`
        : "Start generating",
      icon: Lightbulb,
    },
    {
      label: "Last generation",
      value: lastGenerationDate ? formatDate(lastGenerationDate) : "None yet",
      detail: "Newest saved item",
      icon: CalendarClock,
    },
  ];

  return (
    <DashboardShell
      title="Dashboard"
      description="Your authenticated analytics hub for content generation activity."
    >
      {totalGenerations === 0 ? (
        <GlassCard className="mb-6 overflow-hidden p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                First run
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                No generations yet
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Create your first caption, hook, hashtag set, rewrite, or
                content idea to unlock dashboard analytics and history.
              </p>
            </div>
            <GradientButton href="/generate">Generate first content</GradientButton>
          </div>
        </GlassCard>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <GlassCard key={metric.label} className="p-5 transition hover:border-cyan-300/30">
              <div className="flex items-center justify-between gap-4">
                <Icon className="size-5 text-cyan-300" />
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                  Live
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-400">{metric.label}</p>
              <p className="mt-2 min-h-10 text-2xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Quick actions
            </p>
            <h2 className="mt-2 text-xl font-semibold">Start from a proven flow</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
                >
                  <Icon className="size-5 text-cyan-300" />
                  <h3 className="mt-4 font-semibold text-white">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Recent
              </p>
              <h2 className="mt-2 text-xl font-semibold">Last 5 generations</h2>
            </div>
            <Link href="/history" className="text-sm font-medium text-cyan-200 hover:text-white">
              View all
            </Link>
          </div>

          {recentGenerations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm leading-6 text-slate-400">
              Recent generations will appear here once you create content.
            </div>
          ) : (
            <div className="space-y-3">
              {recentGenerations.map((generation) => (
                <Link
                  key={generation.id}
                  href="/history"
                  className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      {typeLabels[generation.type] ?? generation.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(generation.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-medium text-white">
                    {generation.prompt}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
