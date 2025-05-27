import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <h1 className="text-4xl">Dashboard Page</h1>
      <Button asChild>
        <Link href="/">Home Page</Link>
      </Button>
    </div>
  );
}
