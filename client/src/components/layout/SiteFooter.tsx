import { Link } from "wouter";
import { WHATSAPP_NUMBER } from "@/const";
import { Phone, Mail, Instagram, Youtube } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#f8f9fa] text-neutral-700 border-t border-border/50 mt-16 font-sans">
      <div className="container py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-5 relative pb-2 inline-block text-neutral-900">
            ABOUT
            <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#832729]" />
          </h4>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
            Welcome to Mayil Jewels. Your destination for antique and imitation jewellery — handcrafted fashion pieces with premium plating, anti-tarnish care, and timeless Indian style.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-5 relative pb-2 inline-block text-neutral-900">
            CONTACT US
            <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#832729]" />
          </h4>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#832729] shrink-0" />
              <a href="tel:+14693676317" className="hover:text-[var(--brand)] transition-colors">
                +1 (469) 367-6317 (WhatsApp only)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#832729] shrink-0" />
              <a href="mailto:hello@mayiljewels.com" className="hover:text-[var(--brand)] transition-colors">
                hello@mayiljewels.com
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-5 relative pb-2 inline-block text-neutral-900">
            FOLLOW US
            <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#832729]" />
          </h4>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li className="flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-[#832729] shrink-0" />
              <a
                href="https://www.instagram.com/mayil.jewels/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--brand)] transition-colors"
              >
                Instagram
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Youtube className="w-4 h-4 text-[#832729] shrink-0" />
              <a
                href="#"
                className="hover:text-[var(--brand)] transition-colors"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-neutral-500 bg-[#f1f3f5]">
        © {new Date().getFullYear()} Mayil Jewels. All rights reserved.
      </div>
    </footer>
  );
}
