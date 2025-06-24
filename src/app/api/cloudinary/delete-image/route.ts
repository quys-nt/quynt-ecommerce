import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API POST
export async function POST(req: NextRequest) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete image from Cloudinary" }, { status: 500 });
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json({ error: "Error deleting image" }, { status: 500 });
  }
}