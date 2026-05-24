import { Sparkles, X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-[var(--brand)] text-white text-center text-[10px] md:text-xs tracking-wider uppercase py-1.5 px-4 font-light">
      <p className="flex items-center justify-center gap-2 flex-wrap pr-6">
        <Sparkles className="w-3 h-3 shrink-0" />
        <span>Antique & Imitation Jewellery · Handcrafted Fashion Pieces · Order on WhatsApp</span>
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close announcement"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
