import { redirect } from "next/navigation";

import { isUserAuthenticated } from "@/lib/firebase/firebase-admin";
import PageContent from "@/components/PageContent";
import LoginPage from "./sign-page.tsx";

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect("/dashboard");

  return (
    <main className="container">
      {/* <PageContent variant="sign-in" /> */}
      <LoginPage />
    </main>
  );
}
