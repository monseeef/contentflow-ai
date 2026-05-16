import { requireUser } from "@/lib/auth";

export default async function GenerateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();

  return children;
}
