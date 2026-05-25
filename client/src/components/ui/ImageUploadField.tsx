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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
          placeholder={placeholder}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 px-3"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Image"
        >
          <Upload className="w-4 h-4" />
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            className="shrink-0 px-3"
            onClick={openCropperWithCurrentUrl}
            title="Adjust/Crop Current Image"
          >
            <CropIcon className="w-4 h-4" />
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
