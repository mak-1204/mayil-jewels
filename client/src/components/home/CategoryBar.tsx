import { useLocation, Link } from "wouter";
import {
  Home,
  LayoutGrid,
  Sparkles,
  Flame,
  Crown,
  Gift,
  Compass,
} from "lucide-react";

const sections = [
  { label: "Home", hash: "#home", icon: Home },
  { label: "Categories", hash: "#categories", icon: LayoutGrid },
  { label: "Trending", hash: "#trending", icon: Sparkles },
  { label: "New Arrivals", hash: "#new-arrivals", icon: Flame },
  { label: "Experience", hash: "#experience", icon: Compass },
  { label: "Explore All Collections", path: "/collections", icon: Sparkles, highlight: true },
];

export default function CategoryBar() {
  const [location, setLocation] = useLocation();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location !== "/") {
      // If we are not on the homepage, redirect to homepage with hash
      window.location.href = `/${hash}`;
    } else {
      // If we are on the homepage, smooth scroll directly to the section ID
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="border-b border-border/60 bg-white">
      <div className="container">
        <div className="flex items-center justify-center overflow-x-auto scrollbar-hide py-1">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            
            if (sec.highlight) {
              return (
                <div key={sec.path || sec.label} className="flex items-center shrink-0 py-2">
                  <Link
                    href={sec.path}
                    className="flex items-center gap-2 ml-4 px-4 py-1.5 bg-[#832729] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#6b1f21] hover:scale-105 transition-all duration-300 shadow-[0_2px_8px_rgba(131,39,41,0.25)] hover:shadow-[0_4px_12px_rgba(131,39,41,0.4)]"
                  >
                    <Icon className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>{sec.label}</span>
                  </Link>
                </div>
              );
            }

            return (
              <div key={sec.hash} className="flex items-center shrink-0">
                <a
                  href={`/${sec.hash}`}
                  onClick={(e) => handleNav(e, sec.hash || "")}
                  className="flex items-center gap-2 px-5 py-3 text-sm text-foreground/75 hover:text-[var(--brand)] font-medium transition-colors border-b-2 border-transparent hover:border-[var(--brand)] group"
                >
                  <Icon className="w-4 h-4 text-muted-foreground/80 group-hover:text-[var(--brand)] transition-colors" />
                  <span>{sec.label}</span>
                </a>
                {idx < sections.length - 1 && !sections[idx + 1].highlight && (
                  <div className="w-px h-6 bg-border/50 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
