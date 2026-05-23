import { filterProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "wouter";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";

const occasions = [
  { id: "wedding", label: "Wedding" },
  { id: "daily", label: "Daily Wear" },
  { id: "festive", label: "Festive" },
  { id: "gifting", label: "Gifting" },
  { id: "party", label: "Party Wear" },
];

const budgets = ["Under ₹50,000", "₹50,000 – ₹1,50,000", "Above ₹1,50,000"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StylingAssistantDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const { products, loading } = useProducts();

  const results = filterProducts({
    occasion: occasion || undefined,
    trending: true,
  }, products).slice(0, 3);

  const reset = () => {
    setStep(0);
    setOccasion("");
    setBudget("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            What&apos;s On Your Mind Today?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Jewellery tailored for your outfit, occasion & taste
          </p>
        </DialogHeader>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {occasions.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setOccasion(o.id);
                  setStep(1);
                }}
                className="py-4 px-3 border rounded-sm text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm">Do you have a specific budget?</p>
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setBudget(b);
                  setStep(2);
                }}
                className="w-full py-3 border rounded-sm text-sm text-left px-4 hover:border-[var(--brand)]"
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[var(--brand)]">
              Found unique styles for you!
            </p>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner className="w-6 h-6 text-[var(--brand)]" />
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((p) => (
                  <div key={p.id} onClick={() => onOpenChange(false)}>
                    <ProductCard product={p} compact />
                  </div>
                ))}
              </div>
            )}
            <Button asChild className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)]">
              <Link href={`/collections?occasion=${occasion}`}>View all similar</Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
