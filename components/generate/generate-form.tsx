"use client";

import { FormEvent, useState } from "react";
import { Check, Clipboard, WandSparkles } from "lucide-react";

import { GlassCard } from "@/components/glass-card";
import { GradientButton } from "@/components/gradient-button";

const platforms = ["TikTok", "Instagram", "YouTube Shorts", "LinkedIn"];
const tones = ["Confident", "Playful", "Educational", "Direct", "Premium"];
const contentTypes = [
  { label: "Caption", value: "CAPTION" },
  { label: "Hook", value: "HOOK" },
  { label: "Hashtags", value: "HASHTAGS" },
  { label: "Rewrite", value: "REWRITE" },
  { label: "Content idea", value: "CONTENT_IDEA" },
];

type Generation = {
  id: string;
  type: string;
  prompt: string;
  output: string;
  platform: string | null;
  tone: string | null;
  createdAt: string;
};

export function GenerateForm() {
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: formData.get("prompt"),
        platform: formData.get("platform"),
        tone: formData.get("tone"),
        type: formData.get("type"),
      }),
    });

    const data = (await response.json()) as {
      generation?: Generation;
      error?: string;
    };

    if (!response.ok || !data.generation) {
      setError(data.error ?? "Unable to generate content.");
      setIsLoading(false);
      return;
    }

    setGeneration(data.generation);
    setIsLoading(false);
  }

  async function handleCopy() {
    if (!generation?.output) {
      return;
    }

    await navigator.clipboard.writeText(generation.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
      <GlassCard className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-cyan-300/10">
            <WandSparkles className="size-5 text-cyan-300" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Content brief</h2>
            <p className="mt-1 text-sm text-slate-400">
              Send a focused request to Gemini and save the result to history.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              Content goal
            </span>
            <textarea
              name="prompt"
              required
              minLength={10}
              rows={7}
              placeholder="Describe the campaign, audience, offer, and desired outcome..."
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                Platform
              </span>
              <select
                name="platform"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
              >
                {platforms.map((platform) => (
                  <option key={platform}>{platform}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Tone</span>
              <select
                name="tone"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
              >
                {tones.map((tone) => (
                  <option key={tone}>{tone}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                Content type
              </span>
              <select
                name="type"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <GradientButton type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Generating..." : "Generate content"}
          </GradientButton>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Output
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              {generation ? "Generated result" : "Ready for Gemini"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!generation?.output}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Copy generated output"
          >
            {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
          </button>
        </div>
        <div className="mt-6 min-h-[320px] whitespace-pre-wrap rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm leading-6 text-slate-300">
          {isLoading
            ? "Gemini is shaping your content..."
            : generation?.output ??
              "Your generated content will appear here and automatically save to history."}
        </div>
      </GlassCard>
    </div>
  );
}
