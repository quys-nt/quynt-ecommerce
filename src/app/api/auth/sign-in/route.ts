import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/firebase/firebase-admin";

export async function POST(request: Request) {
  const { idToken } = await request.json();

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create session cookie" },
      { status: 401 },
    );
  }
}
