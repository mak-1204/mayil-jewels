import { categories } from "@/data/categories";
import { Link } from "wouter";
import { WHATSAPP_NUMBER } from "@/const";

export default function SiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-white/90 mt-16">
      <div className="container py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-2xl tracking-[0.2em] text-white mb-4">MAYIL JEWELS</p>
          <p className="text-sm text-white/60 leading-relaxed">
            Your destination for antique and imitation jewellery — handcrafted fashion
            pieces with premium plating, anti-tarnish care, and timeless Indian style.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/collections?category=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/collections" className="hover:text-white">
                Browse Collections
              </Link>
            </li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp Order Support
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Customer Care
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Jewellery Care Guide
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Assurance</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Antique & Imitation Specialists</li>
            <li>Premium Fashion Plating</li>
            <li>Anti-Tarnish Protective Layer</li>
            <li>Hypoallergenic & Skin-Friendly</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Mayil Jewels. All rights reserved.
      </div>
    </footer>
  );
}
