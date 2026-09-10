/* ===========================================================================
   IMAGES THE ADMIN CAN REPLACE
   ===========================================================================
   lib/images.ts holds the DEFAULT picture for every decorative slot on the
   site. This file turns those defaults into a numbered list of "slots" the
   admin panel can show, so someone signed in at /admin can upload a
   replacement for any one of them without touching the code.

   How an override works:

     default (lib/images.ts)  →  always there, never modified
     override (Firestore)     →  optional, sits on top of one slot

   Uploading writes one small Firestore document keyed by the slot id.
   Removing it deletes that document — and because the default was never
   overwritten, the original picture simply reappears.
   =========================================================================== */
import { HERO_ROWS, PAGE_BACKGROUNDS, HOME_BACKGROUNDS } from "./images";
import { SERVICES } from "./data";

export type ImageSlot = {
  /** Firestore document id under the "siteImages" collection. */
  id: string;
  /** Heading this slot is listed under in the admin panel. */
  group: string;
  /** Plain-English name of the slot, as the admin reads it. */
  label: string;
  /** The picture used when nothing has been uploaded for this slot. */
  fallback: string;
};

/* Wording used to name a hero tile — "Middle row — 3rd picture". Rows beyond
   the third and positions beyond the eighth fall back to plain numbering, so
   adding pictures to lib/images.ts never leaves a slot unnamed. */
const ROW_NAMES = ["Top row", "Middle row", "Bottom row"];
const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const rowName = (r: number) => ROW_NAMES[r] ?? `Row ${r + 1}`;
const ordinal = (p: number) => ORDINALS[p] ?? `${p + 1}th`;

/* Route → the page name as it appears in the site's own navigation, so the
   admin recognises it. "/projects" is labelled "Our Clients" in the nav. */
const PAGE_NAMES: Record<string, string> = {
  "/services": "Services page",
  "/projects": "Our Clients page",
  "/gallery": "Gallery page",
  "/about": "About Us page",
  "/faq": "FAQs page",
  "/presence": "Our Presence page",
  "/contact": "Contact Us page",
};

export const GROUPS = {
  hero: "Home page — the scrolling picture wall behind the headline",
  homeBg: "Home page — the two large background photos",
  pageBg: "Background photo on every other page",
  service: "Service photos — each one appears on the home page, the Services list and that service's own page",
} as const;

/** Slot id for one tile of the hero wall, by row and position within that row. */
export const heroSlotId = (row: number, pos: number) => `hero-r${row + 1}-p${pos + 1}`;
/** Slot id for a page background, by its route ("/about" → "page-bg-about"). */
export const pageBgSlotId = (route: string) => `page-bg-${route.replace(/^\//, "")}`;
/** Slot id for a service photo, by that service’s id in lib/data.ts. */
export const serviceSlotId = (id: string) => `service-${id}`;

export const IMAGE_SLOTS: ImageSlot[] = [
  ...HERO_ROWS.flatMap((row, r) =>
    row.map((src, p) => ({
      id: heroSlotId(r, p),
      group: GROUPS.hero,
      label: `${rowName(r)} — ${ordinal(p)} picture`,
      fallback: src,
    })),
  ),
  {
    id: "home-bg-main",
    group: GROUPS.homeBg,
    label: "Behind the statistics, clients, why-choose-us and services sections",
    fallback: HOME_BACKGROUNDS.main.src,
  },
  {
    id: "home-bg-cta",
    group: GROUPS.homeBg,
    label: "Behind the closing “Transform Your Electrical Infrastructure” banner",
    fallback: HOME_BACKGROUNDS.cta.src,
  },
  ...Object.entries(PAGE_BACKGROUNDS).map(([route, bg]) => ({
    id: pageBgSlotId(route),
    group: GROUPS.pageBg,
    label: PAGE_NAMES[route] ?? route,
    fallback: bg.src,
  })),
  ...SERVICES.map((service) => ({
    id: serviceSlotId(service.id),
    group: GROUPS.service,
    label: service.t,
    fallback: service.img,
  })),
];
