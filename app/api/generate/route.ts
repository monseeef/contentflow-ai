import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const generationTypes = [
  "CAPTION",
  "HOOK",
  "HASHTAGS",
  "REWRITE",
  "CONTENT_IDEA",
] as const;

const platforms = ["TikTok", "Instagram", "YouTube Shorts", "LinkedIn"];

type GenerationTypeInput = (typeof generationTypes)[number];

type GenerateContentResult = {
  output: string;
  model: string;
};

function isGenerationType(value: unknown): value is GenerationTypeInput {
  return typeof value === "string" && generationTypes.includes(value as GenerationTypeInput);
}

function cleanOptional(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getPromptInstruction(type: GenerationTypeInput) {
  const instructions: Record<GenerationTypeInput, string> = {
    CAPTION:
      "Write 3 polished social captions. Each caption should include a strong opener, value, and a natural CTA.",
    HOOK:
      "Write 12 short hooks. Make them scroll-stopping, specific, and varied in structure.",
    HASHTAGS:
      "Create a focused hashtag set grouped by broad, niche, and intent-driven tags. Avoid spammy repetition.",
    REWRITE:
      "Rewrite the provided content into 3 stronger versions while preserving the core message.",
    CONTENT_IDEA:
      "Generate 10 content ideas with concise angles, format suggestions, and why each idea would work.",
  };

  return instructions[type];
}

function buildCreatorPrompt({
  prompt,
  type,
  platform,
  tone,
}: {
  prompt: string;
  type: GenerationTypeInput;
  platform?: string;
  tone?: string;
}) {
  return [
    "You are ContentFlow AI, a senior creator strategist for modern social content teams.",
    "Produce practical, ready-to-use content. Be specific, polished, and concise.",
    "Avoid generic filler, fake metrics, and overexplaining your process.",
    "",
    `Task: ${getPromptInstruction(type)}`,
    `Content goal: ${prompt}`,
    `Platform: ${platform ?? "General social content"}`,
    `Tone: ${tone ?? "Clear, modern, confident"}`,
    "",
    "Format the answer with clean headings and readable spacing.",
  ].join("\n");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getGeminiModels() {
  return [
    process.env.GEMINI_MODEL?.trim(),
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-1.5-flash",
  ].filter((model, index, models): model is string => Boolean(model) && models.indexOf(model) === index);
}

async function generateWithGemini({
  apiKey,
  creatorPrompt,
}: {
  apiKey: string;
  creatorPrompt: string;
}): Promise<GenerateContentResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of getGeminiModels()) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(creatorPrompt);
      const output = result.response.text()?.trim();

      if (output) {
        return { output, model: modelName };
      }

      lastError = new Error(`Gemini model ${modelName} returned an empty response.`);
    } catch (error) {
      lastError = error;
      console.error(`[api/generate] Gemini model ${modelName} failed:`, error);
    }
  }

  throw lastError ?? new Error("Gemini did not return a response.");
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Please log in to generate content." }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini is not configured yet. Add GEMINI_API_KEY to your environment." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      prompt?: unknown;
      type?: unknown;
      platform?: unknown;
      tone?: unknown;
    };

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const type = body.type;
    const platform = cleanOptional(body.platform);
    const tone = cleanOptional(body.tone);

    if (prompt.length < 10) {
      return NextResponse.json(
        { error: "Describe your content goal in at least 10 characters." },
        { status: 400 },
      );
    }

    if (prompt.length > 3000) {
      return NextResponse.json(
        { error: "Keep the content goal under 3,000 characters." },
        { status: 400 },
      );
    }

    if (!isGenerationType(type)) {
      return NextResponse.json({ error: "Choose a valid content type." }, { status: 400 });
    }

    if (platform && !platforms.includes(platform)) {
      return NextResponse.json({ error: "Choose a valid platform." }, { status: 400 });
    }

    const { output } = await generateWithGemini({
      apiKey,
      creatorPrompt: buildCreatorPrompt({ prompt, type, platform, tone }),
    });

    if (!output) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 },
      );
    }

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        type,
        prompt,
        output,
        platform,
        tone,
      },
    });

    return NextResponse.json({ generation });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("[api/generate] Generation failed:", error);

    if (message.toLowerCase().includes("api key")) {
      return NextResponse.json(
        { error: "Gemini rejected the API key. Check GEMINI_API_KEY and try again." },
        { status: 503 },
      );
    }

    if (message.toLowerCase().includes("not found") || message.includes("404")) {
      return NextResponse.json(
        { error: "The configured Gemini model is unavailable. Try GEMINI_MODEL=gemini-2.5-flash or gemini-2.0-flash." },
        { status: 503 },
      );
    }

    if (message.includes("Generation_type") || message.includes("GenerationType")) {
      return NextResponse.json(
        { error: "Database generation types are out of sync. Run your Prisma migration and try again." },
        { status: 500 },
      );
    }

    if (message.toLowerCase().includes("does not exist")) {
      return NextResponse.json(
        { error: "The database schema is not migrated yet. Apply the latest Prisma schema and try again." },
        { status: 500 },
      );
    }

    if (
      message.toLowerCase().includes("connect") ||
      message.toLowerCase().includes("database") ||
      message.toLowerCase().includes("prisma")
    ) {
      return NextResponse.json(
        { error: "The database is temporarily unavailable. Please try again in a moment." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Unable to generate content right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
