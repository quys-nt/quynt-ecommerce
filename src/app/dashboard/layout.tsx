import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
