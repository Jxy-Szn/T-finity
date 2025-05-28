"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("type", "product");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to upload images");
        }

        const data = await response.json();
        // Extract URLs from the files array in the response
        const urls = data.files.map((file: { url: string }) => file.url);
        onChange([...value, ...urls]);
        toast.success("Images uploaded successfully");
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload images"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: true,
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isUploading
              ? "Uploading..."
              : isDragActive
                ? "Drop the files here..."
                : "Drag & drop images here, or click to select files"}
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square">
              <Image
                src={url}
                alt="Product image"
                fill
                className="object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => onRemove(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
