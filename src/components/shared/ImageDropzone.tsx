import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { MAX_GALLERY_IMAGES, MAX_IMAGE_SIZE_MB } from "@/config/constants";

interface ImageDropzoneProps {
  mode?: "single" | "multiple";
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  existingUrls?: string[];
  label?: string;
  className?: string;
}

export function ImageDropzone({
  mode = "single",
  value,
  onChange,
  maxFiles = MAX_GALLERY_IMAGES,
  existingUrls = [],
  label,
  className,
}: ImageDropzoneProps) {
  // Hooks
  const { t } = useTranslation();

  // Ref
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const [isDragging, setIsDragging] = useState(false);

  // Variables — object URLs for the selected files
  const previews = useMemo(
    () => value.map((file) => URL.createObjectURL(file)),
    [value],
  );

  // Effects — revoke object URLs when they change or on unmount
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // Functions
  function validateFile(file: File): boolean {
    if (!file.type.startsWith("image/")) {
      toast.error(t("upload-invalid-type"));
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(t("upload-too-large", { size: MAX_IMAGE_SIZE_MB }));
      return false;
    }
    return true;
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList).filter(validateFile);
    if (incoming.length === 0) return;

    if (mode === "single") {
      onChange([incoming[0]]);
      return;
    }

    if (value.length + incoming.length > maxFiles) {
      toast.error(t("validation-gallery-max"));
    }
    onChange([...value, ...incoming].slice(0, maxFiles));
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  const showExisting = value.length === 0 && existingUrls.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      {label ? <p className="text-sm font-medium">{label}</p> : null}

      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-muted-foreground transition-colors hover:bg-muted/40",
          isDragging && "border-primary bg-muted/50",
        )}
      >
        <ImagePlus className="h-6 w-6" />
        <span className="text-sm">
          {mode === "single" ? t("upload-pick") : t("upload-pick-multiple")}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={mode === "multiple"}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* New file previews */}
      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div
              key={src}
              className="relative h-20 w-20 overflow-hidden rounded-md border border-border"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={t("upload-remove")}
                className="absolute end-1 top-1 rounded-full bg-background/80 p-0.5 text-foreground shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Existing hosted images (edit mode, read-only) */}
      {showExisting ? (
        <div className="flex flex-wrap gap-3">
          {existingUrls.map((src) => (
            <div
              key={src}
              className="h-20 w-20 overflow-hidden rounded-md border border-border"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
