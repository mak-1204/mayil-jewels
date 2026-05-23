import PageLayout from "@/components/layout/PageLayout";
import { stores } from "@/data/stores";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

const store = stores[0];

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=519+Ranch+Trail+Apt+134+Irving+Texas+75063";

export default function StoreLocator() {
  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-secondary/30 border-b py-10 md:py-14">
        <div className="container max-w-2xl text-center">
          <h1 className="font-serif text-3xl md:text-4xl mb-3">Visit Our Boutique</h1>
          <p className="text-muted-foreground">
            Experience Mayil Jewels in person. Our expert jewellery consultants are here to help you find the perfect piece.
          </p>
        </div>
      </div>

      {/* Store card + map */}
      <div className="container py-12 md:py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Store Info Card */}
          <article className="luxury-card p-8 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-1">
                Our Only Store
              </p>
              <h2 className="font-serif text-2xl font-semibold">{store.name}</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[var(--brand)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground leading-relaxed">
                    519 Ranch Trail, Apt #134<br />
                    Irving, Texas 75063<br />
                    US
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-[var(--brand)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a
                    href={`tel:${store.phone}`}
                    className="text-muted-foreground hover:text-[var(--brand)] transition-colors"
                  >
                    {store.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-[var(--brand)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Store Hours</p>
                  <p className="text-muted-foreground">Mon – Sat: 10:00 AM – 7:00 PM</p>
                  <p className="text-muted-foreground">Sunday: 11:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="flex-1 luxury-button"
                onClick={() => window.open(GOOGLE_MAPS_URL, "_blank")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-sm text-xs uppercase tracking-wider"
                onClick={() =>
                  window.open(
                    `https://wa.me/14693676317?text=Hi%20Mayil%20Jewels!%20I%27d%20like%20to%20schedule%20a%20visit.`,
                    "_blank"
                  )
                }
              >
                Book a Visit
              </Button>
            </div>
          </article>

          {/* Embedded Google Map */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-border shadow-md h-80 md:h-96 w-full">
              <iframe
                title="Mayil Jewels Location"
                src="https://maps.google.com/maps?q=519+Ranch+Trail,+Apt+134,+Irving,+TX+75063,+USA&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--brand)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
