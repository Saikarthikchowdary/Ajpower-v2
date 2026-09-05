/* ===========================================================================
   PICTURES YOU CAN SWAP
   ===========================================================================
   Every photo on the site that is decorative — the scrolling hero wall and the
   background behind each page — is listed in this one file. Change a line here
   and that picture changes. Nothing else needs touching.

   A picture can be either:

     a file in this project     "/images/herowall/substation-hills.jpg"
     a Cloudinary link          "https://res.cloudinary.com/demo/image/upload/v1/site/tower.jpg"

   Both work anywhere below. Paste a Cloudinary link straight from the Media
   Library — you do NOT need to add sizing or quality options to it, because
   resolveImage() below inserts the right ones for where the picture is used.
   =========================================================================== */

/* Cloudinary delivery links look like:

     https://res.cloudinary.com/<cloud>/image/upload/v1712345678/folder/name.jpg
     └────────────── base ──────────────────────┘ └──── the rest ────┘

   Options go in between those two halves. We insert them for you so a pasted
   link is delivered cropped to the right shape, in the right format, at a
   sensible weight — rather than shipping a 4000px original to every visitor. */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)\/(.+)$/;

const PRESETS = {
  /* one tile of the scrolling hero wall — rendered at 300x280 CSS px */
  wall: "c_fill,g_auto,w_600,h_560,f_auto,q_auto",
  /* full-page backdrop — covers the viewport, so it needs to be larger */
  background: "c_fill,g_auto,w_1600,h_1000,f_auto,q_auto",
} as const;

/* Cloudinary option keys, used to spot options already sitting in a pasted link.
   Checking against real keys rather than "looks like x_y" keeps a folder called
   something like "hero_shots" from being mistaken for options and dropped. */
const OPTION_KEYS = new Set([
  "a", "ar", "b", "bo", "c", "co", "cs", "d", "dl", "dn", "dpr", "du", "e", "eo",
  "f", "fl", "fn", "g", "h", "if", "ka", "l", "o", "p", "pg", "q", "r", "so",
  "t", "u", "vc", "w", "x", "y", "z",
]);

/** True if a URL segment is a set of Cloudinary options, e.g. "w_1200,q_80". */
function isOptionSegment(segment: string): boolean {
  if (/^v\d+$/.test(segment)) return false; // a version, not options
  const parts = segment.split(",");
  return parts.every((p) => {
    const key = p.split("_")[0];
    return p.includes("_") && OPTION_KEYS.has(key);
  });
}

/**
 * Returns a URL ready to put in an <img src>.
 *
 * Local paths ("/images/...") and any non-Cloudinary URL are returned untouched.
 *
 * For a Cloudinary link, the preset's options are put in after "/upload/", so
 * `c_fill,g_auto` crops to the right shape around the subject of the photo and
 * `f_auto,q_auto` serves the best format and quality for each browser.
 *
 * Any options already in the pasted link are dropped first. Without that, a link
 * copied from Cloudinary's transformation builder (".../upload/w_1200,q_80/...")
 * would be cropped down by our options and then scaled back up by its own —
 * arriving upscaled, soft, and heavier than the original. So either the plain
 * delivery URL or one carrying options can be pasted, and both behave the same.
 */
export function resolveImage(src: string, preset: keyof typeof PRESETS): string {
  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match) return src;
  const [, base, rest] = match;

  const segments = rest.split("/");
  while (segments.length > 1 && isOptionSegment(segments[0])) segments.shift();

  return `${base}/${PRESETS[preset]}/${segments.join("/")}`;
}

/* ---------------------------------------------------------------------------
   1. THE SCROLLING HERO WALL (home page)
   ---------------------------------------------------------------------------
   Laid out exactly as it appears on screen: the first list is the top row, the
   second is the middle row, the third is the bottom row. To change the second
   picture in the second row, edit the second line of ROW 2. That is the whole
   job.

   Rows scroll on their own and each list repeats seamlessly, so the rows do not
   need to be the same length — 2 to 6 pictures per row all work.
   --------------------------------------------------------------------------- */
export const HERO_ROWS: string[][] = [
  // ROW 1 — top
  [
    "/images/herowall/substation-hills.jpg",   // HT & LT works
    "/images/herowall/design-drawings.jpg",    // design & engineering
    "/images/herowall/distribution-board.jpg", // internal electrification
  ],
  // ROW 2 — middle
  [
    "/images/herowall/desert-tower.jpg",       // transmission
    "/images/herowall/warehouse-lighting.jpg", // lighting management
    "/images/herowall/site-technician.jpg",    // maintenance & service
  ],
  // ROW 3 — bottom
  [
    "/images/herowall/substation-golden.jpg",  // substation works
    "/images/herowall/control-panel.jpg",      // HT & LT panels
    "/images/herowall/meter-testing.jpg",      // testing & commissioning
  ],
];

/* ---------------------------------------------------------------------------
   2. PAGE BACKGROUNDS (every page except home)
   ---------------------------------------------------------------------------
   One picture per section, pinned behind the page while the content scrolls
   over it. Detail pages inherit their section's picture, so /services/<any>
   uses whatever "/services" is set to.

   `veil` is how much the picture is faded back so text stays readable:

     "normal"  the default — for pages with text sitting straight on the photo
     "light"   lets more of the photo through — safe only where every piece of
               content sits inside a solid white card

   If you set a page to "light" and its text becomes hard to read, put it back
   to "normal". That is the only trade-off here.
   --------------------------------------------------------------------------- */
export type PageBackground = { src: string; veil?: "normal" | "light" };

export const PAGE_BACKGROUNDS: Record<string, PageBackground> = {
  "/services": { src: "/images/hero/03.jpg" },                          // LT switchgear panels
  "/projects": { src: "/images/hero/07.jpg" },                          // data centre hall
  "/gallery":  { src: "/images/hero/11.jpg" },                          // substation structures
  "/about":    { src: "/images/hero/01.jpg" },                          // transformer in a plant room
  "/faq":      { src: "/images/hero/02.jpg", veil: "light" },           // pylon against open sky
  "/presence": { src: "/images/hero/12.jpg", veil: "light" },           // substation at golden hour
  "/contact":  { src: "/images/services/lighting.jpg", veil: "light" }, // lit office interior
};

/* ---------------------------------------------------------------------------
   3. HOME PAGE BACKGROUNDS
   ---------------------------------------------------------------------------
   Home is built differently from the other pages, so its two backdrops are set
   here rather than in the table above. Swap them the same way — a file in this
   project, or a Cloudinary link.

   `alt` describes the picture for screen readers and for anyone whose images
   fail to load. If you change a picture, change its description to match.
   --------------------------------------------------------------------------- */
export const HOME_BACKGROUNDS: Record<"main" | "cta", { src: string; alt: string }> = {
  /* pinned behind the stats, clients, why-us and services sections */
  main: {
    src: "/images/pinsec-bg.jpg",
    alt: "Transmission towers against a bright blue sky",
  },
  /* behind the closing "Transform Your Electrical Infrastructure" band */
  cta: {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=85",
    alt: "Earth city lights at night",
  },
};

/** Finds the background for a route, preferring the most specific match. */
export function backgroundForPath(pathname: string): PageBackground | null {
  const hit = Object.entries(PAGE_BACKGROUNDS)
    .filter(([route]) => pathname === route || pathname.startsWith(route + "/"))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return hit ? hit[1] : null;
}
