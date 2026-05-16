import { NextResponse } from "next/server";

import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  toSafeUser,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({ user: toSafeUser(user) });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("AUTH_SECRET")
        ? error.message
        : "Unable to log in. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
