import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-card-border bg-card/80 shadow-2xl shadow-black/20 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
