import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

export function GradientButton({
  children,
  href,
  className,
  type = "button",
  disabled,
  ...props
}: GradientButtonProps) {
  const classes = cn(
    "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(79,70,229,0.35)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_64px_rgba(34,211,238,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
    className,
  );

  const content = (
    <>
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {content}
    </button>
  );
}
