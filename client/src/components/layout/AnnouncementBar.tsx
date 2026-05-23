import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-[var(--brand)] text-white text-center text-[10px] md:text-xs tracking-wider uppercase py-1.5 px-4 font-light">
      <p className="flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-3 h-3 shrink-0" />
        <span>Antique & Imitation Jewellery · Handcrafted Fashion Pieces · Order on WhatsApp</span>
      </p>
    </div>
  );
}
