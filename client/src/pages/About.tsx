import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Award, Heart, Zap } from "lucide-react";

export default function About() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary/10 border-b border-border/50">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-light mb-6">About Mayil Jewels</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Crafting timeless elegance through traditional artistry and modern design
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Mayil Jewels was founded with a vision to celebrate the beauty and elegance of traditional Indian jewelry. For over 15 years, we have been crafting exquisite pieces that blend timeless traditions with contemporary design.
                </p>
                <p>
                  Every piece in our collection is a testament to our commitment to quality, authenticity, and artistic excellence. Our master craftsmen bring decades of experience to create jewelry that tells a story.
                </p>
                <p>
                  We believe that jewelry is more than just an accessory—it's an expression of identity, culture, and personal style. That's why we pour our hearts into every creation.
                </p>
              </div>
              <Link href="/contact">
                <a>
                  <Button size="lg" className="luxury-button">
                    Get in Touch
                  </Button>
                </a>
              </Link>
            </div>
            <div className="relative h-96 bg-secondary/30 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">✨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Authenticity",
                description: "Every piece is genuine, certified, and crafted with integrity",
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We maintain the highest standards of craftsmanship and quality",
              },
              {
                icon: Heart,
                title: "Passion",
                description: "Our artisans pour their heart into every creation",
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "Blending traditional techniques with modern design sensibilities",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="luxury-card p-6 text-center space-y-4">
                  <Icon className="w-8 h-8 text-accent mx-auto" />
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Founder & Lead Designer",
                bio: "With 20+ years of experience in jewelry design, Priya leads our creative vision",
              },
              {
                name: "Rajesh Kumar",
                role: "Master Craftsman",
                bio: "A third-generation artisan with unparalleled expertise in traditional techniques",
              },
              {
                name: "Anjali Patel",
                role: "Quality Assurance",
                bio: "Ensures every piece meets our exacting standards of excellence",
              },
            ].map((member, index) => (
              <div key={index} className="luxury-card p-8 text-center space-y-4">
                <div className="w-24 h-24 bg-secondary/30 rounded-full mx-auto flex items-center justify-center text-3xl">
                  👤
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-secondary/10 border-t border-b border-border/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Years of Excellence" },
              { number: "500+", label: "Unique Designs" },
              { number: "10K+", label: "Happy Customers" },
              { number: "100%", label: "Certified Authentic" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-4xl md:text-5xl font-light text-accent">
                  {stat.number}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-light">
              Discover Your Perfect Piece
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our collections and find jewelry that resonates with your style and story
            </p>
            <Link href="/collections">
              <a>
                <Button size="lg" className="luxury-button">
                  Shop Now
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

