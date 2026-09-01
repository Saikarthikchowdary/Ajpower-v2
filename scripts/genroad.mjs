// Generates components/JourneyRoad.tsx — a serpentine highway seen at a shallow
// angle, climbing from the bottom-left to the top-right through two switchbacks.
//
// THE CENTRAL TRICK. The road is NOT a constant-width ribbon offset in screen
// space. That cannot draw a switchback: an offset curve folds through itself as
// soon as the turn radius drops below the half-width, and a hairpin tight enough
// to double back needs a radius far smaller than the road is wide.
//
// Instead the whole ribbon is built in PLAN space — the road seen from directly
// above, where the turns are gentle and the width is genuinely constant — and
// then squashed vertically by SQUASH to lay it back down at a viewing angle.
// A vertical squash is an affine map, so it can never introduce a crossing that
// was not already there: if the plan ribbon is clean, the drawn one is clean.
// It also gives the perspective for free — the road reads thin where it runs
// across the view and opens out into a wide U through each hairpin, exactly as
// a real road does.
import { writeFileSync } from "node:fs";

const VW = 1600;
const N = 300;                       // samples along the road

// ---- the shape, in SCREEN coordinates (what the eye should see) ----
const X0 = 150, RUN = 1370;                  // overall left->right travel
const AMP = 330, CYCLES = 2.0, APOW = 0.7;   // switchback size / count / decay
const Y_BASE = 790, CLIMB = 640, YPOW = 1.3; // climb, compressing toward the horizon
const HS_NEAR = 44, HS_FAR = 16, WPOW = 1.3; // half-thickness where the road runs flat
const VERGE = 11;                            // apparent slab thickness at the near end
// The ribbon stops short of t=1: past this the climb has died away to nothing
// while the switchback is still swinging, so the tail whips sideways.
const T_END = 0.965;

// Shallower squash = flatter viewing angle = tighter-looking hairpins for the
// same plan geometry. It is the one knob that decides whether a switchback is
// drawable at all: halving it roughly quadruples the plan turn radius.
const SQUASH = 0.17;

const cx = (t) => X0 + RUN * t + AMP * Math.pow(1 - t, APOW) * Math.sin(2 * Math.PI * CYCLES * t);
const cy = (t) => Y_BASE - CLIMB * (1 - Math.pow(1 - t, YPOW));
// Half-thickness the road shows where it runs flat across the view, in screen
// px. Everything else about the width follows from the plan geometry.
const hs = (t) => HS_FAR + (HS_NEAR - HS_FAR) * Math.pow(1 - t, WPOW);

// screen <-> plan. Plan y grows with distance; the squash is the only difference.
const toPlan = (x, y) => ({ x, y: (Y_BASE - y) / SQUASH });
const toScreen = (p) => ({ x: p.x, y: Y_BASE - p.y * SQUASH });

const planPt = (t) => {
  const p = toPlan(cx(t), cy(t));
  return { ...p, w: hs(t) / SQUASH };        // constant-width road, in plan units
};
function planFrame(t) {
  const d = 0.0006, a = planPt(Math.max(0, t - d)), b = planPt(Math.min(1, t + d));
  let tx = b.x - a.x, ty = b.y - a.y;
  const len = Math.hypot(tx, ty) || 1;
  tx /= len; ty /= len;
  return { ...planPt(t), nx: -ty, ny: tx };
}
const r2 = (v) => Math.round(v * 10) / 10;

// One edge of the ribbon: offset in plan, then dropped back onto the screen.
// k=+1 left edge, k=-1 right, f scales the half-width.
const edge = (t, k, f = 1) => {
  const p = planFrame(t);
  return toScreen({ x: p.x + p.nx * p.w * f * k, y: p.y + p.ny * p.w * f * k });
};

const path = (pts) => "M " + pts.map((p) => `${r2(p.x)} ${r2(p.y)}`).join(" L ") + " Z";

function ribbon(fOuter, fInner) {
  const fwd = [], back = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_END;
    fwd.push(edge(t, 1, fOuter));
    back.push(edge(t, 1, fInner));
  }
  return path([...fwd, ...back.reverse()]);
}

function surface() {
  const fwd = [], back = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_END;
    fwd.push(edge(t, 1));
    back.push(edge(t, -1));
  }
  return path([...fwd, ...back.reverse()]);
}

// The slab's dark side: the surface dropped straight down the screen. The drop
// shrinks with distance like everything else, so it is baked into the path
// rather than applied as a flat CSS translate, which would leave the far tip
// ending in a visible block.
function verge() {
  const fwd = [], back = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_END;
    const off = VERGE * (0.2 + 0.8 * (hs(t) / HS_NEAR));
    const a = edge(t, 1), b = edge(t, -1);
    fwd.push({ x: a.x, y: a.y + off });
    back.push({ x: b.x, y: b.y + off });
  }
  return path([...fwd, ...back.reverse()]);
}

// Centre dashes as discrete quads so they shorten with distance.
function dashes() {
  const out = [];
  let t = 0.008;
  while (t < 0.945) {
    const k = hs(t) / HS_NEAR;
    const dLen = 0.0125 * (0.4 + 0.6 * k);
    const e = Math.min(0.945, t + dLen);
    const a = planFrame(t), b = planFrame(e);
    const wa = a.w * 0.055, wb = b.w * 0.055;
    out.push(path([
      toScreen({ x: a.x + a.nx * wa, y: a.y + a.ny * wa }),
      toScreen({ x: b.x + b.nx * wb, y: b.y + b.ny * wb }),
      toScreen({ x: b.x - b.nx * wb, y: b.y - b.ny * wb }),
      toScreen({ x: a.x - a.nx * wa, y: a.y - a.ny * wa }),
    ]));
    t = e + dLen * 1.15;
  }
  return out.join(" ");
}

// ---- checks: the plan ribbon must not fold, and the drawn one must snake ----
let minRatio = Infinity, minRatioT = 0;
for (let i = 0; i <= 1200; i++) {
  const t = 0.01 + (i / 1200) * 0.94, d = 0.002;
  const a = planPt(t - d), b = planPt(t), c = planPt(t + d);
  const x1 = (c.x - a.x) / (2 * d), y1 = (c.y - a.y) / (2 * d);
  const x2 = (a.x - 2 * b.x + c.x) / (d * d), y2 = (a.y - 2 * b.y + c.y) / (d * d);
  const num = Math.abs(x1 * y2 - y1 * x2);
  const R = num ? Math.pow(x1 * x1 + y1 * y1, 1.5) / num : Infinity;
  if (R / b.w < minRatio) { minRatio = R / b.w; minRatioT = t; }
}
let backtrack = 0, peak = cx(0.01), prev = peak;
for (let i = 0; i <= 1500; i++) {
  const v = cx(0.01 + (i / 1500) * 0.94);
  if (v < prev) backtrack = Math.max(backtrack, peak - v); else peak = v;
  prev = v;
}

// ---- milestones ----
// Posts are spaced by ARC LENGTH in screen space: by t alone they bunch where
// the road is steep, by x alone they bunch wherever a switchback stalls the
// left-to-right travel.
const ARC = [{ t: 0, l: 0 }];
for (let i = 1; i <= 3000; i++) {
  const t = (i / 3000) * T_END, q = ARC[i - 1];
  ARC.push({ t, l: q.l + Math.hypot(cx(t) - cx(q.t), cy(t) - cy(q.t)) });
}
const LEN = ARC[ARC.length - 1].l;
function solveArc(frac) {
  const target = LEN * frac;
  const i = ARC.findIndex((q) => q.l >= target);
  if (i <= 0) return ARC[0].t;
  const a = ARC[i - 1], b = ARC[i];
  return a.t + ((target - a.l) / (b.l - a.l)) * (b.t - a.t);
}

// `at` pins a caption's anchor by hand, in viewBox coordinates. The automatic
// search is a good default but it has no opinion about composition — these are
// the placements that were asked for. Anything without `at` still gets searched.
const COPY = [
  { yr: "2018", key: "2018", txt: "AJ Power Solutions journey started.", at: [159, 835] },
  { yr: "2019", key: "2019", txt: "Continued our emerging journey.", at: [524, 834] },
  { yr: "2020", key: "2020", txt: "New office set up at Pune, Maharashtra.", at: [800, 800] },
  { yr: "2021", key: "2021", txt: "Expanded to Bangalore, Karnataka.", at: [330, 400] },
  { yr: "2022", key: "2022", txt: "Started visionary LT panel manufacturing unit, Tech Pi Solutions.", at: [682, 330] },
  { yr: "2023", key: "2023", txt: "Established raceway and cable tray manufacturing unit.", at: [1182, 432] },
  { yr: "2024", key: "2024", txt: "Successfully completed 10+ million sq ft area.", at: [1462, 345] },
  { yr: "Present", key: "now", txt: "Successfully completed 250+ projects.", at: [1444, 119] },
];

const ARC_NEAR = 0.045, ARC_FAR = 0.93;
const arcStep = (ARC_FAR - ARC_NEAR) / (COPY.length - 1);
const NODE_W = 232, CAP_H = 104, EDGE = 10;
const PAD = 12;              // clear air between two captions
const BACKSTEP = 0.25;       // mild tie-break toward reading left to right
const MAX_STANDOFF = 250;    // a caption further than this from its own bollard
                             // stops reading as belonging to it
const FAN = 0.42;            // radians either side of straight up / straight down
const VY_LIMIT_TOP = -60;    // captions may reach a little above the ribbon

const postH = (t) => 80 * (0.34 + 0.66 * (hs(t) / HS_NEAR));

// ---- caption layout ----
// Each caption is placed by SEARCH, not by a fixed offset rule. A doubling-back
// road gives no single direction that is reliably clear, and the naive answer —
// push straight out along the road normal — both strands captions past hairpins
// and scrambles the reading order, because after a switchback the bollard for a
// later year genuinely sits to the LEFT of an earlier one. So each caption tries
// a fan of directions and distances around its own bollard and takes the
// cheapest placement that satisfies every hard constraint below.

// Road occupancy as a coarse grid — the box test runs thousands of times during
// the search, and point-in-polygon against 600 vertices each time is far too slow.
const SURF = [];
for (let i = 0; i <= N; i++) SURF.push(edge((i / N) * T_END, 1));
for (let i = N; i >= 0; i--) SURF.push(edge((i / N) * T_END, -1));
function inRoad(x, y) {
  let inside = false;
  for (let i = 0, j = SURF.length - 1; i < SURF.length; j = i++) {
    const a = SURF[i], b = SURF[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
const CELL = 8;
const GY0 = Math.floor((Math.min(...SURF.map((q) => q.y)) - 40) / CELL) * CELL;
const GY1 = Math.ceil((Math.max(...SURF.map((q) => q.y)) + 60) / CELL) * CELL;
const GW = Math.ceil(VW / CELL), GH = Math.ceil((GY1 - GY0) / CELL);
const grid = new Uint8Array(GW * GH);
for (let gx = 0; gx < GW; gx++)
  for (let gy = 0; gy < GH; gy++)
    if (inRoad(gx * CELL + CELL / 2, GY0 + gy * CELL + CELL / 2)) grid[gy * GW + gx] = 1;
// Dilate by two cells so captions keep a little air off the kerb.
const solid = Uint8Array.from(grid);
for (let gx = 0; gx < GW; gx++)
  for (let gy = 0; gy < GH; gy++)
    if (!solid[gy * GW + gx])
      outer: for (let dx = -2; dx <= 2; dx++)
        for (let dy = -2; dy <= 2; dy++) {
          const nx = gx + dx, ny = gy + dy;
          if (nx >= 0 && nx < GW && ny >= 0 && ny < GH && grid[ny * GW + nx]) { solid[gy * GW + gx] = 1; break outer; }
        }
function boxHitsRoad(b) {
  const x0 = Math.max(0, Math.floor(b.x0 / CELL)), x1 = Math.min(GW - 1, Math.ceil(b.x1 / CELL));
  const y0 = Math.max(0, Math.floor((b.y0 - GY0) / CELL)), y1 = Math.min(GH - 1, Math.ceil((b.y1 - GY0) / CELL));
  for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) if (solid[gy * GW + gx]) return true;
  return false;
}

// How sharply the road is turning at t, in screen terms.
function screenR(t) {
  const d = 0.004;
  const ax = cx(t - d), ay = cy(t - d), bx = cx(t), by = cy(t), c1 = cx(t + d), c2 = cy(t + d);
  const x1 = (c1 - ax) / (2 * d), y1 = (c2 - ay) / (2 * d);
  const x2 = (ax - 2 * bx + c1) / (d * d), y2 = (ay - 2 * by + c2) / (d * d);
  const n = Math.abs(x1 * y2 - y1 * x2);
  return n ? Math.pow(x1 * x1 + y1 * y1, 1.5) / n : 1e9;
}
// Even arc spacing alone drops bollards into the middle of a hairpin, where the
// road nests against itself and there is simply no open ground beside it for a
// caption to sit. Nudge each one along the road to the straightest nearby spot —
// which is where the reference puts every one of its posts.
const WINDOW = 0;   // 0 = leave the bollards on plain even arc spacing
const slots = COPY.map((m, i) => {
  const t0 = solveArc(ARC_NEAR + arcStep * i);
  let best = t0, bestScore = -Infinity;
  for (let t = Math.max(0.012, t0 - WINDOW); t <= Math.min(0.955, t0 + WINDOW); t += 0.002) {
    const score = Math.min(screenR(t), 900) - 900 * Math.abs(t - t0);
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return best;
});
// keep them from crowding after the nudge
for (let i = 1; i < slots.length; i++) slots[i] = Math.max(slots[i], slots[i - 1] + 0.045);

const posts = COPY.map((m, i) => {
  const t = slots[i];
  const d = 0.0015;
  const tx = cx(t + d) - cx(t - d), ty = cy(t + d) - cy(t - d);
  const L = Math.hypot(tx, ty) || 1;
  const c = { x: cx(t), y: cy(t) };
  const h = postH(t);
  return {
    ...m, t, i, c, k: Math.round((hs(t) / HS_NEAR) * 1000) / 1000,
    pref: i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2,   // alternate above / below
    x: r2(c.x), y: r2(c.y),
    head: { x: c.x, y: c.y - h },
  };
});

const mkBox = (p, ang, dist) => {
  const ax = Math.min(VW - EDGE - NODE_W / 2, Math.max(EDGE + NODE_W / 2, p.c.x + Math.cos(ang) * dist));
  const ay = p.c.y + Math.sin(ang) * dist;
  const up = Math.sin(ang) < 0;
  return {
    ax, ay, up, dist,
    x0: ax - NODE_W / 2, x1: ax + NODE_W / 2,
    y0: up ? ay - CAP_H : ay, y1: up ? ay : ay + CAP_H,
  };
};
const overlaps = (a, b) => a.x0 < b.x1 + PAD && b.x0 < a.x1 + PAD && a.y0 < b.y1 + PAD && b.y0 < a.y1 + PAD;
// A leader that runs through someone else's caption is worse than no leader at
// all — it reads as an underline or a strike, and points the eye at the wrong
// text. Liang-Barsky segment/rect clip, used to forbid exactly that.
function segHitsBox(x1, y1, x2, y2, b) {
  let t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  for (const [pp, qq] of [[-dx, x1 - b.x0], [dx, b.x1 - x1], [-dy, y1 - b.y0], [dy, b.y1 - y1]]) {
    if (pp === 0) { if (qq < 0) return false; continue; }
    const r = qq / pp;
    if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return t0 <= t1;
}
const angDiff = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

// Placed in chronological order. Reading order is a COST, not a constraint:
// forcing every caption strictly right of the last one drags them 300-400px off
// their own bollards on a road that backtracks 244px, and a caption sitting next
// to the wrong post is a worse failure than one the eye reaches out of turn.
// Proximity dominates; BACKSTEP just breaks ties toward left-to-right.
const placed = [];
const warnings = [];
let prevX = -Infinity;
for (const p of posts) {
  if (p.at) {
    const up = p.at[1] < p.c.y;
    const box = {
      ax: p.at[0], ay: p.at[1], up, dist: Math.hypot(p.at[0] - p.c.x, p.at[1] - p.c.y),
      x0: p.at[0] - NODE_W / 2, x1: p.at[0] + NODE_W / 2,
      y0: up ? p.at[1] - CAP_H : p.at[1],
      y1: up ? p.at[1] : p.at[1] + CAP_H,
    };
    if (boxHitsRoad(box)) warnings.push(`${p.yr}: pinned caption overlaps the road`);
    for (const q of placed) {
      if (overlaps(box, q.box)) warnings.push(`${p.yr}: pinned caption overlaps ${q.yr}`);
      if (segHitsBox(p.head.x, p.head.y, box.ax, box.ay, q.box)) warnings.push(`${p.yr}: its leader crosses ${q.yr}`);
      if (segHitsBox(q.head.x, q.head.y, q.anchor.x, q.anchor.y, box)) warnings.push(`${q.yr}: its leader crosses ${p.yr}`);
    }
    p.box = box; p.up = up; p.anchor = { x: box.ax, y: box.ay };
    prevX = box.ax; placed.push(p);
    continue;
  }
  let best = null;
  // Only straight up or straight down, give or take FAN. With no leader line
  // to follow, a caption reads as belonging to the bollard it sits directly
  // over or under; one parked off at 40 degrees just floats. The fan is the
  // whole reason the eight scan as a rhythm rather than as scattered labels.
  for (const base of [-Math.PI / 2, Math.PI / 2]) {
    for (let off = 0; off <= FAN; off += FAN / 6) {
      for (const ang of off === 0 ? [base] : [base - off, base + off]) {
        for (let dist = 44; dist <= MAX_STANDOFF; dist += 6) {
      const box = mkBox(p, ang, dist);
      if (box.y0 < VY_LIMIT_TOP || boxHitsRoad(box)) continue;
      if (placed.some((q) => overlaps(box, q.box))) continue;
      // Neither my leader through their caption, nor theirs through mine.
      if (placed.some((q) => segHitsBox(p.head.x, p.head.y, box.ax, box.ay, q.box))) continue;
      if (placed.some((q) => segHitsBox(q.head.x, q.head.y, q.anchor.x, q.anchor.y, box))) continue;
      // Closest to its bollard, then level with it, then square out from the
      // road on the side the alternation wanted, then reading left to right.
      // Proximity is nearly everything now that there is no leader line to
      // rescue a caption: the ONLY thing tying it to a point is being next to it.
      const cost =
        dist +
        1.2 * Math.abs(box.ay - p.c.y) +
        90 * angDiff(ang, p.pref) +
        BACKSTEP * Math.max(0, prevX - box.ax);
      if (!best || cost < best.cost) best = { box, cost };
      break;
        }
      }
    }
  }
  // Nothing fitted inside the cap: relax it rather than drop the caption, and
  // say so, because that is the signal the road needs more open space beside it.
  for (let extra = MAX_STANDOFF + 20; !best && extra <= 520; extra += 20) {
    for (let a = 0; a < 360; a += 9) {
      const ang = (a * Math.PI) / 180;
      for (let dist = 44; dist <= extra; dist += 6) {
        const box = mkBox(p, ang, dist);
        if (box.y0 < VY_LIMIT_TOP || boxHitsRoad(box)) continue;
        if (placed.some((q) => overlaps(box, q.box))) continue;
        if (placed.some((q) => segHitsBox(p.head.x, p.head.y, box.ax, box.ay, q.box))) continue;
        const cost = dist + 1.2 * Math.abs(box.ay - p.c.y);
        if (!best || cost < best.cost) best = { box, cost };
        break;
      }
    }
  }
  p.box = best.box;
  p.up = best.box.up;
  p.anchor = { x: best.box.ax, y: best.box.ay };
  prevX = best.box.ax;
  placed.push(p);
}
for (const w of warnings) console.log("  !! " + w);
console.log("caption standoff from its own bollard:");
for (const p of posts) console.log("   " + p.yr.padEnd(8) + Math.round(Math.hypot(p.anchor.x - p.c.x, p.anchor.y - p.c.y)) + "px");

// Crop the viewBox to what is actually drawn.
let yMin = Infinity, yMax = -Infinity;
for (let i = 0; i <= 600; i++) {
  const t = (i / 600) * T_END;
  const off = VERGE * (0.2 + 0.8 * (hs(t) / HS_NEAR));
  for (const k of [1, -1]) {
    const e = edge(t, k);
    yMin = Math.min(yMin, e.y);
    yMax = Math.max(yMax, e.y + off);
  }
}
for (const p of posts) {
  yMin = Math.min(yMin, p.head.y - 8, p.box.y0);
  yMax = Math.max(yMax, p.box.y1);
}
const VY = r2(yMin - 14), VBH = r2(yMax + 14 - (yMin - 14));

// Bollards: dark post, bright cap and a reflective band under it.
const postSvg = posts
  .map((p) => {
    const k = 0.34 + 0.66 * p.k;
    const h = 80 * k, w = 8.2 * k, cap = 11 * k, band = 7 * k;
    return `        <g className="post">
          <ellipse className="pshadow" cx="${p.x}" cy="${p.y}" rx="${r2(19 * k)}" ry="${r2(6.2 * k)}" />
          <rect className="pbody" x="${r2(p.x - w)}" y="${r2(p.y - h)}" width="${r2(w * 2)}" height="${r2(h)}" rx="${r2(w)}" />
          <rect className="pband" x="${r2(p.x - w)}" y="${r2(p.y - h + cap + band * 0.5)}" width="${r2(w * 2)}" height="${r2(band)}" />
          <rect className="pcap" x="${r2(p.x - w)}" y="${r2(p.y - h)}" width="${r2(w * 2)}" height="${r2(cap)}" rx="${r2(w)}" />
        </g>`;
  })
  .join("\n");

// Leader: a rule from the post head out to the caption, plus a dot on the point
// itself. Drawn in three passes — the rule under the asphalt, the same rule
// clipped TO the asphalt in a pale ink, then the dot on top — so a leader that
// crosses the road stays unbroken while still reading as being on the surface.
const leadPart = (kind) =>
  posts
    .map((p) => {
      const k = 0.34 + 0.66 * p.k;
      const dx = p.anchor.x - p.head.x, dy = p.anchor.y - p.head.y;
      const len = Math.hypot(dx, dy) || 1;
      const line = `<path d="M ${r2(p.head.x + (dx / len) * (5.5 * k + 2))} ${r2(p.head.y + (dy / len) * (4.5 * k + 2))} L ${r2(p.anchor.x - (dx / len) * 10)} ${r2(p.anchor.y - (dy / len) * 10)}" />`;
      if (kind === "line") return `        <g className="leadline m${p.key}">${line}</g>`;
      if (kind === "over") return `          <g className="leadover">${line}</g>`;
      return `        <g className="leaddot m${p.key}">
          <circle cx="${r2(p.head.x)}" cy="${r2(p.head.y)}" r="${r2(5.5 * k)}" />
        </g>`;
    })
    .join("\n");

const nodeJsx = posts
  .map((p) => `      <div className="roadnode m${p.key} ${p.up ? "side-t" : "side-b"}" style={{ left: "${r2((p.anchor.x / VW) * 100)}%", top: "${r2(((p.anchor.y - VY) / VBH) * 100)}%" }}>
        <span className="yr">${p.yr}</span>
        <p>${p.txt}</p>
      </div>`)
  .join("\n");

const file = `// GENERATED by scripts/genroad.mjs — a switchbacking perspective highway.
// The ribbon is built in PLAN space (the road from directly above, where its
// width is constant and its turns are gentle) and then squashed vertically to
// lay it down at a viewing angle. A vertical squash is affine, so it cannot
// introduce a self-crossing — which is what makes the hairpins drawable at all.
export default function JourneyRoad() {
  return (
    <div className="roadwrap">
      <svg className="roadsvg" viewBox="0 ${VY} ${VW} ${VBH}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="jasphalt" x1="0" y1="1" x2="0.35" y2="0">
            <stop offset="0" stopColor="#3f4950" />
            <stop offset="0.55" stopColor="#343e45" />
            <stop offset="1" stopColor="#262e34" />
          </linearGradient>
          <clipPath id="jsurface">
            <path d="${surface()}" />
          </clipPath>
        </defs>
${leadPart("line")}
        <path className="rverge" d="${verge()}" />
        <path className="rtar" d="${surface()}" />
        <path className="rline" d="${ribbon(0.94, 0.78)}" />
        <path className="rline" d="${ribbon(-0.94, -0.78)}" />
        <path className="rdash" d="${dashes()}" />
        <g clipPath="url(#jsurface)">
${leadPart("over")}
        </g>
${postSvg}
${leadPart("dot")}
      </svg>
${nodeJsx}
    </div>
  );
}
`;

writeFileSync(process.argv[2], file);
console.log("wrote", process.argv[2]);
console.log(`viewBox 0 ${VY} ${VW} ${VBH}  (aspect ${(VW / VBH).toFixed(2)}:1)`);
console.log(`plan turn radius / half-width = ${minRatio.toFixed(2)} at t=${minRatioT.toFixed(3)} (must stay > 1)`);
console.log(`switchback backtrack = ${Math.round(backtrack)}px of leftward doubling back`);
for (const p of posts) {
  console.log(`  ${p.yr.padEnd(8)} t=${p.t.toFixed(3)} post=(${p.x},${p.y}) k=${p.k} caption ${p.up ? "above" : "below"} at (${r2(p.anchor.x)},${r2(p.anchor.y)})`);
}
