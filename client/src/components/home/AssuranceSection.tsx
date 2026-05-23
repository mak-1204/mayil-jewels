import { Shield, Sparkles, Heart, MessageSquare } from "lucide-react";

const items = [
  {
    icon: Sparkles,
    title: "Premium Micro-Plating",
    desc: "Exquisite 24ct gold plating & micro-plating",
  },
  {
    icon: Heart,
    title: "Skin-Friendly",
    desc: "Hypoallergenic, nickel-free premium materials",
  },
  {
    icon: Shield,
    title: "Anti-Tarnish Coating",
    desc: "Special protective layer for long-lasting shine",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Ordering",
    desc: "Easy direct purchase & personal customization",
  },
];

export default function AssuranceSection() {
  return (
    <section className="py-12 border-y border-border bg-white">
      <div className="container">
        <h2 className="text-center font-serif text-2xl md:text-3xl mb-10">
          Mayil Assurance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
