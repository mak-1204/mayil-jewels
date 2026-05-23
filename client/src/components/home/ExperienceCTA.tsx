import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "wouter";

export default function ExperienceCTA() {
  return (
    <section className="py-16 bg-secondary/40">
      <div className="container text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl mb-3">Mayil Experience</h2>
        <p className="text-muted-foreground mb-8">
          Find a boutique near you or book a private consultation with our jewellery experts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] rounded-sm uppercase tracking-wider text-xs h-11"
          >
            <Link href="/stores">
              <MapPin className="w-4 h-4 mr-2" />
              Find a Store
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-sm uppercase tracking-wider text-xs h-11">
            <a href="tel:+914440001234">Book Consultation</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
