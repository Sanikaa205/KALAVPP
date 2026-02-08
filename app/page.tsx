import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import HomePage from "./(site)/page";

export const dynamic = "force-dynamic";

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
