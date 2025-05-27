import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/custom/mode-toggle.tsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <h1 className="text-4xl">Home Page</h1>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button asChild>
        <Link href="/dashboard/setting">Setting</Link>
      </Button>
      <ModeToggle />
    </div>
  );
}
