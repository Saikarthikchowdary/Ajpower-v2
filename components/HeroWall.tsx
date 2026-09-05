import { HERO_ROWS, resolveImage } from "@/lib/images";

/* Three rows of uniform tiles, each scrolling horizontally. Every row repeats its
   own list enough times that the tail still covers the screen at the end of the
   travel, and shifts by exactly one copy — handed to CSS as --copies for the
   keyframe to divide by, so the loop is seamless whatever the row length. */
const TILE_W = 306; // 300px tile + 6px gap
const COVER_W = 2600; // widest screen we keep covered

export default function HeroWall() {
  return (
    <div className="wall" aria-hidden="true">
      {HERO_ROWS.map((row, r) => {
        const list = row.length ? row : HERO_ROWS.flat();
        const copies = Math.max(3, Math.ceil(COVER_W / (list.length * TILE_W)) + 1);
        const tiles = Array.from({ length: copies }, () => list).flat();

        return (
          <div className="roww" key={r} style={{ "--copies": copies } as React.CSSProperties}>
            {tiles.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={resolveImage(src, "wall")} alt="AJ Power electrical project" />
            ))}
          </div>
        );
      })}
    </div>
  );
}
