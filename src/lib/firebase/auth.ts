import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from "firebase/auth";

import { APIResponse } from "@/types";
import { auth } from "@/lib/firebase";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const userCreds = await signInWithPopup(auth, provider);
    const idToken = await userCreds.user.getIdToken();

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return true;
    } else return false;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return false;
  }
}

export async function signOut() {
  try {
    await auth.signOut();

    const response = await fetch("/api/auth/sign-out", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return true;
    } else return false;
  } catch (error) {
    console.error("Error signing out with Google", error);
    return false;
  }
}

export async function signInWithEmailAndPassword(email: string, password: string) {
  try {
    const userCreds = await firebaseSignInWithEmailAndPassword(auth, email, password);
    const idToken = await userCreds.user.getIdToken();

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const resBody = await response.json() as APIResponse<string>;
    return resBody.success;
  } catch (error) {
    console.error("Error signing in with email and password", error);
    
    // Phân loại lỗi chi tiết hơn
    let errorMessage = "Đăng nhập thất bại";
    if (error instanceof Error) {
      switch (error.message) {
        case "Firebase: Error (auth/invalid-credential).":
          errorMessage = "Email hoặc mật khẩu không đúng";
          break;
        case "Firebase: Error (auth/user-not-found).":
          errorMessage = "Tài khoản không tồn tại";
          break;
        case "Firebase: Error (auth/wrong-password).":
          errorMessage = "Mật khẩu không đúng";
          break;
        case "Firebase: Error (auth/user-disabled).":
          errorMessage = "Tài khoản đã bị vô hiệu hóa";
          break;
      }
    }
    
    throw new Error(errorMessage); // Ném lỗi để xử lý ở component
  }
}
