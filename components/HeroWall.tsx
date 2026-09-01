import { HERO_PICS } from "@/lib/data";

export default function HeroWall() {
  const rows = [0, 1, 2].map((r) => {
    const set = HERO_PICS.filter((_, i) => i % 3 === r);
    const list = set.length ? set : HERO_PICS.slice(0, 6);
    return { r, tripled: [...list, ...list, ...list] };
  });

  return (
    <div className="wall" aria-hidden="true">
      {rows.map(({ r, tripled }) => (
        <div className={"roww" + (r % 2 ? " d" : "")} key={r}>
          {tripled.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="AJ Power electrical project" />
          ))}
        </div>
      ))}
    </div>
  );
}