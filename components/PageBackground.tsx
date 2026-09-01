"use client";

import { usePathname } from "next/navigation";

/* Every page except home sits on a photograph chosen for what that page is about.
   Matching is by route prefix so detail routes (/services/<slug>, /projects/<slug>)
   inherit their section's image. The photo is pinned behind the page and the
   content scrolls over it — see .pagebg in globals.css for the veil that keeps
   body copy and white cards readable.

   `open` lets more of the photo through. It is only set for pages whose content
   sits entirely inside opaque cards — there the veil carries no legibility work.
   The rest put text straight onto the backdrop and keep the stronger veil. */
const PAGE_BG: [prefix: string, src: string, open?: boolean][] = [
  ["/services", "/images/hero/03.jpg"],                // rows of LT switchgear panels
  ["/projects", "/images/hero/07.jpg"],                // data centre hall
  ["/gallery", "/images/hero/04.jpg"],                 // technician working a live site
  ["/about", "/images/hero/01.jpg"],                   // transformer in a plant room
  ["/faq", "/images/hero/02.jpg", true],               // pylon against open sky
  ["/presence", "/images/hero/12.jpg", true],          // substation at golden hour
  ["/contact", "/images/services/lighting.jpg", true], // office on an integrated lighting scheme
];

export default function PageBackground() {
  const pathname = usePathname() ?? "";
  const hit = PAGE_BG.find(([p]) => pathname === p || pathname.startsWith(p + "/"));
  if (!hit) return null;
  const [, src, open] = hit;

  return (
    <div className={"pagebg" + (open ? " pagebg-open" : "")} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
      <span className="pagebg-veil"></span>
    </div>
  );
}
