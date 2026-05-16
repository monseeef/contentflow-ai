import { DashboardShell } from "@/components/dashboard-shell";
import { GenerateForm } from "@/components/generate/generate-form";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;

  return (
    <DashboardShell
      title="Generate"
      description="Create creator-focused content with Gemini and save every result to your authenticated history."
    >
      <GenerateForm initialType={params.type} />
    </DashboardShell>
  );
}
