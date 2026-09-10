"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* Reads the admin's picture overrides once per visit and hands them to every
   <SiteImage> on the page.

   All of them live in ONE Firestore document — siteImages/overrides — keyed by
   slot id, rather than one document per picture. Firestore's free tier is
   billed per document read, so a single document costs one read per visitor no
   matter how many pictures have been replaced; a document each would cost up to
   eighteen.

   An empty map is the normal, healthy state: it means nothing has been replaced
   in the admin panel and every slot is showing its default. If Firebase is
   unreachable or not configured, the map stays empty and the site renders
   exactly as it does with no admin at all. */
export type ImageOverrides = Record<string, string>;

export const OVERRIDES_DOC = { collection: "siteImages", id: "overrides" } as const;

const OverridesContext = createContext<ImageOverrides>({});

export function useImageOverrides(): ImageOverrides {
  return useContext(OverridesContext);
}

/** Pulls the usable "slot id → url" pairs out of the stored document. */
export function readOverrides(data: unknown): ImageOverrides {
  const out: ImageOverrides = {};
  if (!data || typeof data !== "object") return out;
  for (const [slot, value] of Object.entries(data as Record<string, unknown>)) {
    const url = (value as { url?: unknown })?.url;
    if (typeof url === "string" && url) out[slot] = url;
  }
  return out;
}

export default function SiteImagesProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<ImageOverrides>({});

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, OVERRIDES_DOC.collection, OVERRIDES_DOC.id));
        if (live && snap.exists()) setOverrides(readOverrides(snap.data()));
      } catch {
        // Firebase not configured, offline, or blocked — keep every default.
      }
    })();
    return () => { live = false; };
  }, []);

  return <OverridesContext.Provider value={overrides}>{children}</OverridesContext.Provider>;
}
