"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";

export function LoginButton() {
  const router = useRouter();
  const handleSignIn = async () => {
    const isOk = await signInWithGoogle();
    if (isOk) router.push("/dashboard");
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleSignIn}>
      Login with Google
    </Button>
  );
}
