import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full p-4 md:p-8 bg-gray-50">
      <div className="text-center space-y-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Lead Management System
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          A complete solution for tracking and managing your leads. View,
          create, and manage leads with our intuitive dashboard.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link href="/leads">View Leads Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/leads/new">Create New Lead</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
