import { Activity, FileText, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { GlassCard } from "@/components/glass-card";

const metrics = [
  { label: "Generations", value: "0", icon: FileText },
  { label: "Active sessions", value: "Auth soon", icon: Activity },
  { label: "Content variants", value: "Ready", icon: Sparkles },
];

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Your protected command center for content generation activity. Auth wiring is staged, but the workspace structure is ready."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <GlassCard key={metric.label} className="p-5">
              <Icon className="size-5 text-cyan-300" />
              <p className="mt-5 text-sm text-slate-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {metric.value}
              </p>
            </GlassCard>
          );
        })}
      </div>
      <GlassCard className="mt-5 p-6">
        <h2 className="text-xl font-semibold">Protected app foundation</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          PostgreSQL models and auth UI are now in place. The next backend pass
          can enforce sessions, scope generations to users, and persist content
          without changing the core page structure.
        </p>
      </GlassCard>
    </DashboardShell>
  );
}
