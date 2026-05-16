"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { GradientButton } from "@/components/gradient-button";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(data.error ?? "Unable to create your account.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-200">Name</span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          minLength={2}
          placeholder="Alex Morgan"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-200">Email</span>
        <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <Mail className="size-4 text-cyan-300" />
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </span>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-200">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Create a password"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <GradientButton type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating account..." : "Create account"}
      </GradientButton>
    </form>
  );
}
