import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="container py-24 text-center">
        <p className="text-6xl font-serif text-[var(--brand)]/30 mb-4">404</p>
        <h1 className="font-serif text-2xl mb-4">Page not found</h1>
        <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand-dark)]">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </PageLayout>
  );
}
