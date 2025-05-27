"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/custom/LogoutButton";
import type { NextRequest } from "next/server";

export default function Dashboard(request: NextRequest) {
  console.log(request);

  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <h1 className="text-4xl">Dashboard Page</h1>
      <Button asChild>
        <Link href="/">Home Page</Link>
      </Button>
      <Button asChild>
        <Link href="/dashboard/setting">Setting Page</Link>
      </Button>
      <LogoutButton />
    </div>
  );
}
