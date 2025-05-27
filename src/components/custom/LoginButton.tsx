"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "@firebase/auth";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Lấy ID token
      const idToken = await user.getIdToken();

      // Gửi token đến API
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        console.log("Đăng nhập thành công");
        router.push("/dashboard");
      } else {
        throw new Error("Failed to set auth cookies");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      console.log("Đăng nhập thất bại");
    }
  };

  return (
    <Button onClick={handleLogin} variant="default">
      Đăng nhập với Google
    </Button>
  );
}
