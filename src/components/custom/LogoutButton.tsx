"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const isOk = await signOut();

    if (isOk) router.push("/sign-in");
  };

  return <Button onClick={handleSignOut}>Logout</Button>;
}
