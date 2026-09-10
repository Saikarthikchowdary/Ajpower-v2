"use client";

import { resolveImage, type ImagePreset } from "@/lib/images";
import { useImageOverrides } from "./SiteImagesProvider";

/* One replaceable picture. Renders its default straight away — so the first
   paint is never blank and search engines see a real image — then swaps in the
   admin's upload if one exists for this slot. */
export default function SiteImage({
  slot, fallback, preset, alt, className, loading,
}: {
  slot: string;
  fallback: string;
  preset: ImagePreset;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const overrides = useImageOverrides();
  const src = overrides[slot] || fallback;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolveImage(src, preset)} alt={alt} className={className} loading={loading} />
  );
}
