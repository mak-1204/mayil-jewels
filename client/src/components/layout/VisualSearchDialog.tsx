import { filterProducts } from "@/data/products";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VisualSearchDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<"upload" | "results">("upload");
  const { products, loading } = useProducts();
  const similar = filterProducts({ trending: true }, products).slice(0, 4);

  const handleUpload = () => {
    toast.success("Image uploaded", {
      description: "Finding similar jewellery styles…",
    });
    setStep("results");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStep("upload");
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Search With A Picture</DialogTitle>
          <DialogDescription>
            Upload or take a photo to find the same or similar designs.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-secondary/20">
              <p className="text-sm text-muted-foreground mb-4">
                File size should not exceed 2 MB
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleUpload}>
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button onClick={handleUpload} className="bg-[var(--brand)] hover:bg-[var(--brand-dark)]">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium">Similar jewellery for you</p>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner className="w-6 h-6 text-[var(--brand)]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {similar.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={() => onOpenChange(false)}
                    className="group block border rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="aspect-square object-cover w-full"
                    />
                    <div className="p-2">
                      <p className="text-xs line-clamp-2 group-hover:text-[var(--brand)]">
                        {p.name}
                      </p>
                      <p className="text-sm font-semibold mt-1">{formatINR(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep("upload")}
            >
              Try another image
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
