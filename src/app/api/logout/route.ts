import { NextRequest, NextResponse } from "next/server";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    await signOut(auth);

    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    // Xóa cookie auth-token thủ công
    response.cookies.delete("auth-token");

    return response;
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
