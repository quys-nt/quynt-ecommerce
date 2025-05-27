"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Sử dụng shadcn-ui Button component

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Đăng xuất thành công");
        router.push("/login"); // Chuyển hướng về trang đăng nhập
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.log("Đăng xuất thất bại");
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Đăng xuất
    </Button>
  );
}
