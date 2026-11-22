// Shared by the Metro scenes (metro-*), as eva.ts is by the Evangelion ones: a fixed random sequence, a palette
// filled into a style template with written-out values, the SVG shell with its reduced-motion rule, and shapes
// more than one scene draws.

export const r1 = (n: number) => Math.round(n * 10) / 10

export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export type Palette = Record<string, string | number>

export const fill = (tpl: string, p: Palette) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => {
    if (!(k in p)) throw new Error(`missing palette key ${k}`)
    return String(p[k])
  })

export const svg = (style: string, defs: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${style}\n@media (prefers-reduced-motion: reduce) { * { animation: none !important } }</style><defs>${defs}</defs>${body}</svg>`

// Inline timing for one animated element: its duration and a negative delay, so it starts mid-cycle.
export const timing = (dur: number, delay: number) => `animation-duration:${r1(dur)}s;animation-delay:-${r1(delay)}s`

// A five-pointed star about (x, y).
export function star(x: number, y: number, r: number) {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 ? r * 0.4 : r
    d += `${i ? 'L' : 'M'}${r1(x + rr * Math.cos(a))} ${r1(y + rr * Math.sin(a))}`
  }
  return d + 'Z'
}

// A standing figure in a coat, feet at (x, by), h tall: one path, the head a separate circle.
export function person(x: number, by: number, h: number) {
  const w = h * 0.3
  return `M${r1(x - w / 2)} ${r1(by)} L${r1(x - w * 0.44)} ${r1(by - h * 0.62)} Q${r1(x)} ${r1(by - h * 0.8)} ${r1(x + w * 0.44)} ${r1(by - h * 0.62)} L${r1(x + w / 2)} ${r1(by)} Z M${r1(x + h * 0.12)} ${r1(by - h * 0.84)} A${r1(h * 0.12)} ${r1(h * 0.12)} 0 1 0 ${r1(x - h * 0.12)} ${r1(by - h * 0.84)} A${r1(h * 0.12)} ${r1(h * 0.12)} 0 1 0 ${r1(x + h * 0.12)} ${r1(by - h * 0.84)} Z`
}

// A point on the quadratic curve from a through control c to b.
export function quad(a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]
}
