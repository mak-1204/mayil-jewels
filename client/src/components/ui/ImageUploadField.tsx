import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Crop as CropIcon } from "lucide-react";
import { ImageCropperDialog } from "./ImageCropperDialog";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: number;
  storagePath?: string;
  placeholder?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Image URL",
  aspect = 4 / 5,
  storagePath = "uploads",
  placeholder = "https://images.unsplash.com/..."
}: ImageUploadFieldProps) {
  // Upload button removed as requested
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const handleCropComplete = (croppedUrl: string) => {
    onChange(croppedUrl);
  };

  const openCropperWithCurrentUrl = () => {
    if (value) {
      setCropImageSrc(value);
      setCropDialogOpen(true);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase text-muted-foreground">{label}</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
          placeholder={placeholder}
        />

        {value ? (
          <Button
            type="button"
            variant="outline"
            className="shrink-0 px-3 flex items-center gap-1.5"
            onClick={openCropperWithCurrentUrl}
            title="Adjust/Crop Current Image"
          >
            <CropIcon className="w-4 h-4" />
            <span className="text-xs font-medium">Crop</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled
            className="shrink-0 px-3 flex items-center gap-1.5 opacity-50 cursor-not-allowed"
            title="Enter an image link to adjust/crop"
          >
            <CropIcon className="w-4 h-4" />
            <span className="text-xs font-medium">Crop</span>
          </Button>
        )}
      </div>

      {value && (
        <div className="mt-2 w-24 h-28 rounded overflow-hidden border border-border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <ImageCropperDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        imageSrc={cropImageSrc}
        aspect={aspect}
        onCropCompleteAction={handleCropComplete}
        storagePath={storagePath}
      />
    </div>
  );
}
