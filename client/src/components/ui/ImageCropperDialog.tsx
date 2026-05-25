import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadFirebaseImage } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  aspect?: number;
  onCropCompleteAction: (croppedUrl: string) => void;
  storagePath?: string;
}

export function ImageCropperDialog({
  open,
  onOpenChange,
  imageSrc,
  aspect = 4 / 5,
  onCropCompleteAction,
  storagePath = "uploads"
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }
      
      const fileName = `${storagePath}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const downloadUrl = await uploadFirebaseImage(croppedBlob, fileName);
      onCropCompleteAction(downloadUrl);
      onOpenChange(false);
      toast.success("Image cropped and uploaded successfully!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to process image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>Adjust the frame to fit the aspect ratio</DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black rounded-lg overflow-hidden">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white/50">
              No image loaded
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <label className="text-sm font-medium">Zoom:</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(Number(e.target.value));
            }}
            className="flex-1"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!imageSrc || isUploading} className="bg-accent hover:bg-accent/90 text-white">
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm & Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
