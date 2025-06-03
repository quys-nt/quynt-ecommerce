import PageContent from "@/components/PageContent";
import LogoutButton from "@/components/custom/LogoutButton";

export default async function DashboardPage() {

  return (
    <main className="container">
      <>
        <h1>Dashboard Page</h1>
        <LogoutButton />
      </>
    </main>
  );
}
