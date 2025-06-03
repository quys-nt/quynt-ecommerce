import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <h1>Sign Up</h1>
      <Button asChild>
        <Link href="/">Home Page</Link>
      </Button>
    </div>
  );
}
