"use client";

import { AlertTriangle } from "lucide-react";

import { GlassCard } from "@/components/glass-card";
import { GradientButton } from "@/components/gradient-button";

export default function HistoryError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <GlassCard className="max-w-md p-8 text-center">
        <AlertTriangle className="mx-auto size-10 text-cyan-300" />
        <h1 className="mt-5 text-2xl font-semibold">History unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          We could not load saved generations right now. Check the database
          connection and refresh when it is available.
        </p>
        <div className="mt-6">
          <GradientButton href="/history">Try again</GradientButton>
        </div>
      </GlassCard>
    </main>
  );
}
