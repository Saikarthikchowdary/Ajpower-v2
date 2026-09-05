"use client";

import { usePathname } from "next/navigation";
import { backgroundForPath, resolveImage } from "@/lib/images";

/* Which picture each page gets — and how far it shows through — is set in
   lib/images.ts. This component only renders the choice: the photo is pinned
   behind the page and the content scrolls over it, with a veil between the two
   so body copy and white cards stay readable (see .pagebg in globals.css). */
export default function PageBackground() {
  const pathname = usePathname() ?? "";
  const bg = backgroundForPath(pathname);
  if (!bg) return null;

  return (
    <div className={"pagebg" + (bg.veil === "light" ? " pagebg-open" : "")} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolveImage(bg.src, "background")} alt="" />
      <span className="pagebg-veil"></span>
    </div>
  );
}
