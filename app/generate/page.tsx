import { DashboardShell } from "@/components/dashboard-shell";
import { GenerateForm } from "@/components/generate/generate-form";

export default function GeneratePage() {
  return (
    <DashboardShell
      title="Generate"
      description="Create creator-focused content with Gemini and save every result to your authenticated history."
    >
      <GenerateForm />
    </DashboardShell>
  );
}
