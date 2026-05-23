import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Award, Heart, Zap } from "lucide-react";

export default function About() {
  return (
    <PageLayout>
      <section className="py-16 md:py-24 bg-secondary/10 border-b border-border/50">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-light mb-6">About Mayil Jewels</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Antique and imitation jewellery for weddings, festivals, and everyday elegance
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Mayil Jewels celebrates the beauty of Indian fashion jewellery — antique temple
                  looks, kundan-style sets, and lightweight imitation pieces for every occasion.
                </p>
                <p>
                  We specialise in handcrafted fashion jewellery with premium plating and
                  anti-tarnish care. Our designs are made for stunning style, not sold as precious
                  metal or certified diamond jewellery.
                </p>
                <p>
                  Whether you are dressing for a wedding, a festival, or daily wear, we help you
                  find pieces that express your personality without the weight or cost of fine gold.
                </p>
              </div>
              <Link href="/contact">
                <Button size="lg" className="luxury-button">
                  Get in Touch
                </Button>
              </Link>
            </div>
            <div className="relative h-96 bg-secondary/30 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">✨</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Honest Offering",
                description:
                  "Clear about antique & imitation — fashion jewellery with beautiful finishes",
              },
              {
                icon: Award,
                title: "Craftsmanship",
                description: "Attention to detail in every jhumka, bangle, and bridal set",
              },
              {
                icon: Heart,
                title: "Passion",
                description: "Designs inspired by temple, heritage, and modern Indian style",
              },
              {
                icon: Zap,
                title: "Accessibility",
                description: "Statement looks for weddings and daily wear at approachable prices",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="luxury-card p-6 text-center space-y-4">
                  <Icon className="w-8 h-8 text-accent mx-auto" />
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/10 border-t border-b border-border/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Fashion Designs" },
              { number: "10K+", label: "Happy Customers" },
              { number: "8+", label: "Categories" },
              { number: "100%", label: "Style Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-4xl md:text-5xl font-light text-accent">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-light">Discover Your Perfect Piece</h2>
          <p className="text-lg text-muted-foreground">
            Explore antique and imitation collections for every mood and moment
          </p>
          <Link href="/collections">
            <Button size="lg" className="luxury-button">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
