"use client";

import { usePathname } from "next/navigation";
import { backgroundForPath } from "@/lib/images";
import { pageBgSlotId } from "@/lib/siteImages";
import SiteImage from "./SiteImage";

/* Which picture each page gets — and how far it shows through — is set in
   lib/images.ts, and can be replaced per page from the admin panel. This
   component only renders the choice: the photo is pinned behind the page and
   the content scrolls over it, with a veil between the two so body copy and
   white cards stay readable (see .pagebg in globals.css). */
export default function PageBackground() {
  const pathname = usePathname() ?? "";
  const bg = backgroundForPath(pathname);
  if (!bg) return null;

  return (
    <div className={"pagebg" + (bg.veil === "light" ? " pagebg-open" : "")} aria-hidden="true">
      <SiteImage slot={pageBgSlotId(bg.route)} fallback={bg.src} preset="background" alt="" />
      <span className="pagebg-veil"></span>
    </div>
  );
}
