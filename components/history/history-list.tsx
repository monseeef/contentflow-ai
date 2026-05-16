"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clipboard, Search } from "lucide-react";

import { GlassCard } from "@/components/glass-card";

const typeLabels: Record<string, string> = {
  CAPTION: "Caption",
  HOOK: "Hook",
  HASHTAGS: "Hashtags",
  REWRITE: "Rewrite",
  CONTENT_IDEA: "Content idea",
};

const filters = [
  { label: "All", value: "ALL" },
  { label: "Captions", value: "CAPTION" },
  { label: "Hooks", value: "HOOK" },
  { label: "Hashtags", value: "HASHTAGS" },
  { label: "Rewrites", value: "REWRITE" },
  { label: "Ideas", value: "CONTENT_IDEA" },
];

export type HistoryGeneration = {
  id: string;
  type: string;
  prompt: string;
  output: string;
  platform: string | null;
  tone: string | null;
  createdAt: string;
};

export function HistoryList({
  generations,
}: {
  generations: HistoryGeneration[];
}) {
  const [activeType, setActiveType] = useState("ALL");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const filteredGenerations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return generations.filter((generation) => {
      const matchesType = activeType === "ALL" || generation.type === activeType;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        generation.prompt.toLowerCase().includes(normalizedQuery) ||
        generation.output.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesQuery;
    });
  }, [activeType, generations, query]);

  async function copyOutput(id: string, output: string) {
    await navigator.clipboard.writeText(output);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(""), 1800);
  }

  return (
    <div className="space-y-5">
      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveType(filter.value)}
                className={
                  activeType === filter.value
                    ? "rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
                    : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 lg:w-80">
            <Search className="size-4 shrink-0 text-cyan-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search prompt or output"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      </GlassCard>

      {filteredGenerations.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <h2 className="text-xl font-semibold">No matching generations</h2>
          <p className="mt-2 text-sm text-slate-400">
            Adjust your filter or search term to find saved content.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-5">
          {filteredGenerations.map((generation) => (
            <GlassCard key={generation.id} className="p-5 transition hover:border-cyan-300/30">
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <CalendarDays className="size-4 text-cyan-300" />
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(generation.createdAt))}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyOutput(generation.id, generation.output)}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy output"
                  >
                    {copiedId === generation.id ? (
                      <Check className="size-4" />
                    ) : (
                      <Clipboard className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
                {generation.output}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
