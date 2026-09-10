import { HERO_ROWS } from "@/lib/images";
import { heroSlotId } from "@/lib/siteImages";
import SiteImage from "./SiteImage";

/* Three rows of uniform tiles, each scrolling horizontally. Every row repeats its
   own list enough times that the tail still covers the screen at the end of the
   travel, and shifts by exactly one copy — handed to CSS as --copies for the
   keyframe to divide by, so the loop is seamless whatever the row length.

   A tile's slot is keyed by its position within its row, not by its index in the
   repeated strip, so every copy of a row stays identical and the loop stays
   seamless however many times the row is repeated. */
const TILE_W = 306; // 300px tile + 6px gap
const COVER_W = 2600; // widest screen we keep covered

export default function HeroWall() {
  return (
    <div className="wall" aria-hidden="true">
      {HERO_ROWS.map((row, r) => {
        if (!row.length) return null; // an empty row has nothing to scroll
        const list = row.map((src, p) => ({ src, slot: heroSlotId(r, p) }));
        const copies = Math.max(3, Math.ceil(COVER_W / (list.length * TILE_W)) + 1);
        const tiles = Array.from({ length: copies }, () => list).flat();

        return (
          <div className="roww" key={r} style={{ "--copies": copies } as React.CSSProperties}>
            {tiles.map((tile, i) => (
              <SiteImage key={i} slot={tile.slot} fallback={tile.src} preset="wall"
                alt="AJ Power electrical project" />
            ))}
          </div>
        );
      })}
    </div>
  );
}
