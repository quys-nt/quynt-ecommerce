import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace( /\\n/g, "\n",),
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    // Xác minh token ID
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const expiresIn = 12 * 24 * 60 * 60 * 1000; // 12 ngày

    // Tạo session cookie (tùy chọn) hoặc sử dụng idToken trực tiếp
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn,
    });

    // Thiết lập cookie thủ công
    const response = NextResponse.json(
      { message: "Login successful", uid: decodedToken.uid },
      { status: 200 },
    );
    response.cookies.set({
      name: "auth-token",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn / 1000, // Chuyển từ ms sang giây
      path: "/",
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Invalid token or server error", details: error.message },
      { status: 500 },
    );
  }
}
