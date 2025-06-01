import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import PageContent from "@/components/PageContent";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  return (
    <main className="container">
      <PageContent
        variant="dashboard"
        currentUser={currentUser.toJSON() as typeof currentUser}
      />
    </main>
  );
}
