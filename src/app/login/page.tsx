"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/custom/LoginButton";

// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";

export default function Login() {
  // const router = useRouter();
  // const handleGoogleSignIn = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     await signInWithPopup(auth, provider);
  //     router.push("/dashboard");
  //   } catch (error) {
  //     console.error("Lỗi đăng nhập: ", error);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <h1 className="text-4xl">Login Page</h1>
      <Button asChild>
        <Link href="/">Home Page</Link>
      </Button>
      {/* <Button onClick={handleGoogleSignIn}>Sign in with Google</Button> */}
      <LoginButton />
    </div>
  );
}
