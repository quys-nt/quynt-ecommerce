"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Setting() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <h1 className="text-4xl">Setting Page</h1>
      <Button asChild>
        <Link href="/dashboard">Dashboard Page</Link>
      </Button>
    </div>
  );
}
