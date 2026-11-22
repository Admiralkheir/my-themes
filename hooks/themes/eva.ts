// Shared by the Evangelion scenes (eva-*), as tentacles.ts is by the Cthulhu ones: the same helpers each scene
// otherwise writes for itself (a fixed random sequence, a palette filled into a style template with written-out
// values, the SVG shell with its reduced-motion rule), plus shapes more than one scene draws.

export const r1 = (n: number) => Math.round(n * 10) / 10

export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const fill = (tpl: string, p: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => {
    if (!(k in p)) throw new Error(`missing palette key ${k}`)
    return String(p[k])
  })

export const svg = (style: string, defs: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${style}\n@media (prefers-reduced-motion: reduce) { * { animation: none !important } }</style><defs>${defs}</defs>${body}</svg>`

// A polygon from offsets about (cx, cy), scaled by s; mirror flips it left to right.
export const poly = (cx: number, cy: number, s: number, pts: [number, number][], mirror = false) =>
  'M' + pts.map(([x, y]) => `${r1(cx + (mirror ? -x : x) * s)} ${r1(cy + y * s)}`).join(' L') + ' Z'

// A hexagon, flat sides top and bottom.
export const hex = (cx: number, cy: number, r: number) => {
  let d = ''
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    d += `${i ? 'L' : 'M'}${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`
  }
  return d + 'Z'
}

// An octagon: the shape the AT Field takes when it shows.
export const oct = (cx: number, cy: number, r: number) => {
  let d = ''
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i + Math.PI / 8
    d += `${i ? 'L' : 'M'}${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`
  }
  return d + 'Z'
}

// Eva Unit-01 as a silhouette from the waist up: the horn, the shoulder pylons, the long arms.
// (cx, ny) is the base of the neck; s scales it. Returns the body, its accent lines and its eyes.
export function unit01(cx: number, ny: number, s: number) {
  const P = (pts: [number, number][], m = false) => poly(cx, ny, s, pts, m)
  const head: [number, number][] = [
    [-11, 2], [-13, -24], [-17, -38], [-10, -52], [-4, -55], [0, -112], [4, -55], [10, -52], [17, -38], [13, -24], [11, 2],
  ]
  const torso: [number, number][] = [[-44, 6], [44, 6], [40, 90], [22, 200], [-22, 200], [-40, 90]]
  const pylon: [number, number][] = [[-36, 14], [-46, -30], [-80, -34], [-102, 6], [-98, 58], [-70, 62], [-42, 40]]
  const arm: [number, number][] = [[-84, 56], [-97, 150], [-99, 250], [-90, 340], [-74, 338], [-76, 240], [-69, 150], [-58, 60]]
  const body = P(head) + P(torso) + P(pylon) + P(pylon, true) + P(arm) + P(arm, true)
  const L = (pts: [number, number][]) =>
    'M' + pts.map(([x, y]) => `${r1(cx + x * s)} ${r1(ny + y * s)}`).join(' L')
  const lines =
    L([[-10, -12], [0, -4], [10, -12]]) +
    L([[-32, 30], [0, 58], [32, 30]]) +
    L([[-26, 116], [0, 134], [26, 116]]) +
    L([[-48, -26], [-94, 20]]) + L([[48, -26], [94, 20]]) +
    L([[-90, 160], [-88, 250]]) + L([[90, 160], [88, 250]])
  const eyes = P([[-12, -36], [-4, -32], [-5, -28], [-13, -31]]) + P([[12, -36], [4, -32], [5, -28], [13, -31]])
  return { body, lines, eyes }
}

// Birds that cross now and then, each a pair of wings that beat.
export function birds(seed: number, n: number, yMin: number, yMax: number) {
  const rand = seeded(seed)
  let s = ''
  for (let i = 0; i < n; i++) {
    const y = yMin + rand() * (yMax - yMin)
    const size = 6 + rand() * 7
    const x = 20
    s += `<g class="bird" style="animation-duration:${r1(30 + rand() * 24)}s;animation-delay:-${r1(rand() * 50)}s"><g class="flap" style="transform-origin:${x}px ${r1(y)}px;animation-duration:${r1(0.45 + rand() * 0.3)}s"><path d="M${r1(x - size)} ${r1(y - size * 0.3)} Q${r1(x - size * 0.5)} ${r1(y - size * 0.7)} ${x} ${r1(y)} Q${r1(x + size * 0.5)} ${r1(y - size * 0.7)} ${r1(x + size)} ${r1(y - size * 0.3)}"/></g></g>`
  }
  return s
}
export const BIRD_KEYS = `@keyframes fly{from{transform:translate(-120px,0)}50%{transform:translate(800px,-30px)}to{transform:translate(1720px,10px)}}
@keyframes flap{from{transform:scale(1,1)}to{transform:scale(1,-.6)}}`
