"use client";

import { motion } from "framer-motion";
import { BarChart3, Layers3, ShieldCheck, Sparkles } from "lucide-react";

import { GlassCard } from "@/components/glass-card";
import { GradientButton } from "@/components/gradient-button";
import { Navbar } from "@/components/navbar";

const features = [
  {
    title: "Campaign-ready drafting",
    description:
      "Shape briefs, hooks, variants, and repurposed assets from one focused workspace.",
    icon: Sparkles,
  },
  {
    title: "Reusable content systems",
    description:
      "Keep messaging, channel formats, and brand patterns organized before AI is connected.",
    icon: Layers3,
  },
  {
    title: "Performance context",
    description:
      "A dashboard foundation for tracking volume, velocity, and content outcomes.",
    icon: BarChart3,
  },
  {
    title: "Production controls",
    description:
      "Built with a clean app structure ready for auth, database, and AI integrations.",
    icon: ShieldCheck,
  },
];

const workflow = ["Brief", "Generate", "Review", "Publish"];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="fixed inset-0 -z-10 premium-grid" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(99,102,241,0.34),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.16),transparent_30%)]" />
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              AI content operations
            </p>
            <h1 className="text-balance max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              ContentFlow AI turns content chaos into a premium creation system.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A modern SaaS foundation for teams that want faster ideation,
              structured generation workflows, and a polished operating layer
              before AI and auth are connected.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <GradientButton href="/generate">Open generator</GradientButton>
              <a
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
              >
                View dashboard
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <GlassCard className="p-5">
              <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                      Live brief
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Launch week content
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Ready
                  </span>
                </div>
                <div className="mt-5 grid gap-3">
                  {["Audience angles", "LinkedIn variants", "Email sequence"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <span className="text-sm text-slate-200">{item}</span>
                        <span className="text-sm font-semibold text-cyan-300">
                          {index + 4}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-400/20 p-4">
                  <p className="text-sm leading-6 text-slate-200">
                    System prompt, model routing, and publishing integrations
                    are intentionally left open for the next build phase.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for a SaaS product that feels serious from day one.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <GlassCard key={feature.title} className="p-5">
                  <Icon className="size-6 text-cyan-300" />
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <GlassCard className="p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  How it works
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  A clean path from idea to reusable content.
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {workflow.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <span className="text-xs font-semibold text-cyan-300">
                      0{index + 1}
                    </span>
                    <p className="mt-3 font-medium text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready for AI, auth, billing, and analytics when you are.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            The product shell is intentionally crisp: premium UI, clean
            directories, Prisma-ready data layer, and focused routes.
          </p>
          <div className="mt-8">
            <GradientButton href="/dashboard">Enter workspace</GradientButton>
          </div>
        </section>
      </main>
    </div>
  );
}
