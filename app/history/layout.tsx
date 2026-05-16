import { requireUser } from "@/lib/auth";

export default async function HistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();

  return children;
}
