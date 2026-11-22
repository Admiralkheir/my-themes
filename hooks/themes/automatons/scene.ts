// Steam automatons crossing a frozen plain: a convoy small on the far ridge, one
// at middle distance along a road of marker lamps and one giant close by. Each
// walks on four jointed legs in a true walking gait (one leg lifts at a time, the
// knee folding as the foot swings forward), its hull rocking on the footfalls,
// its furnace breathing, a gear turning on its flank, its stack trailing smoke and
// its searchlight thrown on the snow ahead. On the horizon a city's generator
// smokes; snow streaks past on the wind.
//
// One layout, two palettes: NIGHT for a dark window (steel-blue night, a faint
// aurora, amber light) and DAY for a light window (a pale overcast with a weak sun,
// iron dark against the snow), so both scenes hold the same automatons in the same
// places.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS
// keyframes with literal values, `transform-origin` in positive px, durations and
// delays inline, no SMIL, no filters, no masks, no `var()` in a keyframe and no
// `@media` but the reduced-motion rule.

const r1 = (n: number) => Math.round(n * 10) / 10
const P = (x: number, y: number) => `${r1(x)} ${r1(y)}`

// A fixed sequence in place of Math.random, so the scene is the same string every time.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

type Palette = {
  night: boolean
  sky: [string, string, string]
  cloudDark: [string, number]
  cloudLight: [string, number]
  haze: [string, number]
  far: [fill: string, shade: string, crest: string]
  near: [fill: string, shade: string, crest: string]
  plain: string
  drift: [string, number]
  road: [string, number]
  drum: [string, string, string]
  iron: string
  ironDark: string
  leg: string
  legFar: string
  joint: string
  edge: [string, number]
  snowCap: [string, number]
  glow: string
  hot: string
  beam: number
  pool: [string, number]
  shadow: [string, number]
  smoke: [string, string, number]
  steam: [string, number]
  city: string
  cityGlow: number
  snow: [far: string, mid: string, near: string]
  snowOp: [number, number, number]
  gust: [string, number]
  vignette: [string, number]
  bank: [string, string]
  bankLip: [string, number]
  pole: string
  legCyl: [string, string, string, string]
  drumBounce: string
  rust: [string, number]
  ice: [string, number]
  halo: number
  spill: number
  shadowDx: number
  spindrift: [string, number]
  prints: [string, number]
}

export const NIGHT: Palette = {
  night: true,
  sky: ['#060a11', '#121c29', '#28384a'],
  cloudDark: ['#0b1118', 0.75],
  cloudLight: ['#4a4c58', 0.35],
  haze: ['#5c7590', 0.55],
  far: ['#2b3c4f', '#213042', '#5d7891'],
  near: ['#24344a', '#1a2737', '#4f6982'],
  plain: '#2d3f53',
  drift: ['#6f88a0', 0.35],
  road: ['#1d2a38', 0.6],
  drum: ['#3b4858', '#1b232d', '#0b1016'],
  iron: '#121820',
  ironDark: '#080c11',
  leg: '#161d26',
  legFar: '#0b1016',
  joint: '#2a3542',
  edge: ['#6b8197', 0.55],
  snowCap: ['#b8cad9', 0.85],
  glow: '#ffb050',
  hot: '#ffe0a0',
  beam: 0.09,
  pool: ['#ffb060', 0.35],
  shadow: ['#0a1018', 0.45],
  smoke: ['#2a2d33', '#3c3f45', 0.85],
  steam: ['#dfe9f2', 0.75],
  city: '#0e141b',
  cityGlow: 0.6,
  snow: ['#e3ecf4', '#e3ecf4', '#e3ecf4'],
  snowOp: [0.35, 0.45, 0.35],
  gust: ['#c9d9e8', 0.2],
  vignette: ['#04070b', 0.7],
  bank: ['#7d93a9', '#3c4f63'],
  bankLip: ['#c6d6e4', 0.6],
  pole: '#0f151d',
  legCyl: ['#06090d', '#2e3a48', '#151c25', '#04070a'],
  drumBounce: '#1c2734',
  rust: ['#8a5030', 0.24],
  ice: ['#cfe0ee', 0.75],
  halo: 0.55,
  spill: 0.55,
  shadowDx: 0,
  spindrift: ['#d6e2ee', 0.2],
  prints: ['#121b25', 0.5],
}

export const DAY: Palette = {
  night: false,
  sky: ['#a9b5c1', '#ccd4dc', '#e6eaee'],
  cloudDark: ['#8d99a6', 0.45],
  cloudLight: ['#f6f8fa', 0.7],
  haze: ['#e9eef2', 0.75],
  far: ['#b3bfcb', '#a2afbd', '#f4f7fa'],
  near: ['#a4b2c0', '#8e9db0', '#eef3f7'],
  plain: '#d8e0e7',
  drift: ['#ffffff', 0.7],
  road: ['#a9b4bf', 0.45],
  drum: ['#717d8b', '#3c4550', '#1f252c'],
  iron: '#2a3139',
  ironDark: '#171c22',
  leg: '#2d343d',
  legFar: '#525d6a',
  joint: '#4a5562',
  edge: ['#c9d4de', 0.6],
  snowCap: ['#ffffff', 0.95],
  glow: '#ffa040',
  hot: '#ffd890',
  beam: 0.07,
  pool: ['#f0a050', 0.22],
  shadow: ['#7d8c9b', 0.35],
  smoke: ['#3c4047', '#5a5f66', 0.85],
  steam: ['#ffffff', 0.9],
  city: '#39424c',
  cityGlow: 0.3,
  snow: ['#7f91a3', '#7f91a3', '#ffffff'],
  snowOp: [0.3, 0.35, 0.75],
  gust: ['#ffffff', 0.5],
  vignette: ['#eef2f5', 0.6],
  bank: ['#fbfcfd', '#c4d0db'],
  bankLip: ['#ffffff', 0.9],
  pole: '#2a2f36',
  legCyl: ['#191e24', '#6a7582', '#343b44', '#14181d'],
  drumBounce: '#5d6b7a',
  rust: ['#7a4a2e', 0.3],
  ice: ['#ffffff', 0.9],
  halo: 0.3,
  spill: 0.15,
  shadowDx: -40,
  spindrift: ['#ffffff', 0.65],
  prints: ['#98a5b2', 0.5],
}

// ---- The automaton -------------------------------------------------------------------------------------------------
// Drawn facing left in its own frame: 360 wide, feet on the ground at y 420. Its hips sit under the hull, every
// leg a thigh that swings about the hip and a shin that folds about the knee.

const GROUND = 420
const HIP_Y = 212
const THIGH = [-16, 100] as const // knee, from the hip
const SHIN_LEN = 96 // ankle, below the knee
const LEG_REACH = 206 // hip to sole
const SWEEP = 24 // degrees the thigh swings through in a stride
const STANCE = 0.75 // the share of a stride a foot is on the ground
const STRIDE = 4.8 // seconds
// How fast the hull must move, in its own frame, for a planted foot to stay put.
const SPEED = ((SWEEP * Math.PI) / 180) * LEG_REACH / (STANCE * STRIDE)

function leg(hx: number, hy: number, far: boolean, phase: number, detail: boolean): string {
  const kx = hx + THIGH[0]
  const ky = hy + THIGH[1]
  const ax = kx + 14
  const ay = ky + SHIN_LEN
  const fill = far ? 'a-legfar' : 'a-leg'
  const delay = `animation-duration:${STRIDE}s;animation-delay:-${r1(phase * STRIDE)}s`
  const thigh = `M${P(hx - 18, hy - 6)} L${P(hx + 17, hy - 6)} L${P(kx + 13, ky)} L${P(kx - 13, ky)} Z`
  const sleeve = `M${P(kx - 11, ky)} L${P(kx + 11, ky)} L${P(kx + 14 + 9, ky + 56)} L${P(kx + 14 - 9, ky + 56)} Z`
  const foot = `M${P(ax - 11, ay - 4)} L${P(ax + 11, ay - 4)} L${P(ax + 22, ay + 12)} L${P(ax - 25, ay + 12)} Z`
  let out = `<g class="hip" style="transform-origin:${hx}px ${hy}px;${delay}">`
  out += `<path class="${fill}" d="${thigh}"/>`
  if (detail && !far) {
    out += `<path class="a-edge" d="M${P(hx - 16, hy)} L${P(kx - 12, ky - 4)}"/>`
    out += `<path class="a-rod" d="M${P(hx + 8, hy + 10)} L${P(kx + 4, ky - 18)}"/>`
    out += `<path class="a-rivet" d="M${P(hx - 9, hy + 24)}h.1 M${P(hx + 8, hy + 24)}h.1 M${P(kx - 7, ky - 16)}h.1 M${P(kx + 7, ky - 16)}h.1"/>`
  }
  out += `<g class="knee" style="transform-origin:${r1(kx)}px ${r1(ky)}px;${delay}">`
  out += `<path class="${fill}" d="${sleeve}"/>`
  out += `<path class="${far ? 'a-rodfar' : 'a-rod'}" style="stroke-width:9" d="M${P(kx + 14, ky + 54)} L${P(ax, ay)}"/>`
  out += `<path class="${fill}" d="${foot}"/>`
  if (!far) {
    out += `<path class="a-cap" d="M${P(ax - 24, ay + 11)} L${P(ax + 21, ay + 11)}"/>`
  }
  out += `<circle class="${far ? 'a-legfar' : 'a-joint'}" cx="${r1(kx)}" cy="${r1(ky)}" r="14"/>`
  if (detail && !far) {
    out += `<circle class="a-hub" cx="${r1(kx)}" cy="${r1(ky)}" r="5"/>`
  }
  out += `</g></g>`
  return out
}

// A gear of `n` teeth, as one path.
function gear(cx: number, cy: number, r: number, n: number): string {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const a0 = (i / (n * 2)) * Math.PI * 2
    const a1 = ((i + 1) / (n * 2)) * Math.PI * 2
    const rr = i % 2 === 0 ? r + 4 : r
    pts.push(P(cx + rr * Math.cos(a0), cy + rr * Math.sin(a0)), P(cx + rr * Math.cos(a1), cy + rr * Math.sin(a1)))
  }
  return `M${pts.join(' L')} Z M${P(cx + r * 0.35, cy)} A${r1(r * 0.35)} ${r1(r * 0.35)} 0 1 0 ${P(cx - r * 0.35, cy)} A${r1(r * 0.35)} ${r1(r * 0.35)} 0 1 0 ${P(cx + r * 0.35, cy)} Z`
}

// Puffs from a stack, in the automaton's frame: they drift back as fast as it walks on, so in the scene the smoke
// hangs where it was let out and leans away on the wind.
function puffs(x: number, y: number, r: number, count: number, period: number, cls: string, fill: string): string {
  let out = ''
  for (let i = 0; i < count; i++) {
    const j = 1 + ((i * 7) % 5) / 10
    out += `<circle class="${cls}" cx="${x}" cy="${y}" r="${r1(r * j)}" fill="url(#${fill})" style="transform-origin:${x}px ${y}px;animation-duration:${period}s;animation-delay:-${r1((i * period) / count)}s"/>`
  }
  return out
}

// Snow kicked up where a foot comes down: it lands at the front of its swing, so the spray sits there, starts
// with the stride and drifts back as the hull walks on.
const spray = (hx: number, phase: number) =>
  `<ellipse class="spray" cx="${hx - 45}" cy="${GROUND - 3}" rx="16" ry="6" fill="url(#spray)" style="transform-origin:${hx - 45}px ${GROUND - 3}px;animation-duration:${STRIDE}s;animation-delay:-${r1(phase * STRIDE)}s"/>`

// Rust run down from the rivets, and icicles hung under the chassis.
const weather = seeded(77)
const RUST = [152, 196, 236, 272]
  .flatMap(x => [128, 168].map(y => `M${x + 4} ${y + 2}l.6 ${r1(8 + weather() * 18)}`))
  .concat([`M70 166l.5 ${r1(10 + weather() * 10)}`, `M90 166l.5 ${r1(8 + weather() * 10)}`])
  .join('')
let ICICLES = ''
for (let x = 92; x < 294; x += 7 + weather() * 6) {
  const len = 4 + weather() * 10
  ICICLES += `M${r1(x)} 226l1.6 ${r1(len)}l1.6 ${r1(-len)}Z`
}

function automaton(detail: boolean, blink: number): string {
  // The far pair first, behind the hull, a quarter stride apart from the near pair.
  const legsFar = leg(128, HIP_Y - 6, true, 0.75, detail) + leg(268, HIP_Y - 6, true, 0.5, detail)
  const legsNear = leg(250, HIP_Y, false, 0, detail) + leg(110, HIP_Y, false, 0.25, detail)

  const drum = `<rect fill="url(#drum)" x="120" y="112" width="172" height="86" rx="40"/>`
  const cab = `<path fill="url(#drum)" d="M136 116 L84 122 L54 150 L50 190 L86 208 L136 208 Z"/>`
  const chassis = `<path class="a-iron" d="M70 196 L304 196 L298 226 L84 226 Z"/>`
  const stack = `<path class="a-iron" d="M240 116 L242 58 L262 58 L264 116 Z"/><rect class="a-dark" x="234" y="46" width="36" height="13" rx="2"/>`
  const vent = `<rect class="a-iron" x="204" y="84" width="11" height="32"/>`
  const window = `<path class="a-glow a-breathe" style="animation-delay:-${blink}s" d="M64 152 L98 148 L98 160 L62 164 Z"/>`
  const furnace = `<rect class="a-dark" x="166" y="156" width="52" height="30" rx="5"/><rect class="a-glow a-breathe" style="animation-delay:-${r1(blink * 0.7)}s" x="171" y="161" width="42" height="20" rx="3"/>`
  const lamp = `<circle class="a-dark" cx="50" cy="172" r="11"/><circle class="a-lamp" cx="48" cy="172" r="6"/>`
  const caps = `<path class="a-cap" d="M132 112.5 L280 112.5 M86 121 L136 115.5 M234 46 L270 46 M204 84 L215 84 M72 196 L304 196"/>`
  const hipCaps = `<circle class="a-joint" cx="110" cy="${HIP_Y}" r="21"/><circle class="a-joint" cx="250" cy="${HIP_Y}" r="21"/>`
  let extras = ''
  if (detail) {
    const bands = [152, 196, 236, 272].map(x => `M${x} 114 L${x} 196`).join(' ')
    const rivets = [152, 196, 236, 272].flatMap(x => [126, 146, 166, 186].map(y => `M${x + 4} ${y}h.1`)).join('')
    extras += `<path class="a-band" d="${bands}"/><path class="a-rivet" d="${rivets}"/>`
    extras += `<path class="a-band" style="stroke-width:3" d="M228 92 C228 104 240 108 246 110 M90 186 L130 186"/>`
    extras += `<path class="a-rail" d="M140 104 L284 104 M150 104 l0 8 M180 104 l0 8 M210 104 l0 8 M270 104 l0 8"/>`
    extras += `<path class="a-edge" d="M134 118 C180 114 240 114 286 120 M58 152 L86 126"/>`
    extras += `<g class="a-spin" style="transform-origin:282px 210px"><path class="a-joint" fill-rule="evenodd" d="${gear(282, 210, 15, 10)}"/></g>`
    extras += `<circle class="a-warn" style="animation-delay:-${r1(blink * 1.3)}s" cx="158" cy="100" r="3"/>`
    extras += `<path class="a-rust" d="${RUST}"/>`
    extras += `<path class="a-snow" d="M140 116 C168 105 252 105 285 116 C254 110 170 110 140 119 Z M88 124 L134 117.5 L134 121 L92 127 Z M236 47 L268 47 L266 50 L238 50 Z"/>`
    extras += `<path class="a-ice" d="${ICICLES}"/>`
  }
  const beam = `<path class="a-beam" d="M46 166 L-150 ${GROUND + 6} L10 ${GROUND + 10} L54 178 Z"/>`
  const pool = `<ellipse class="a-pool" cx="-60" cy="${GROUND + 4}" rx="110" ry="12"/>`
  const shadow = `<ellipse class="a-shadow" cx="190" cy="${GROUND + 2}" rx="170" ry="11"/>`
  const spill = `<ellipse class="a-spill" cx="192" cy="${GROUND + 2}" rx="96" ry="9" fill="url(#pool)"/>`
  const halos =
    `<circle class="a-halo" cx="48" cy="172" r="36" fill="url(#halo)"/>` +
    (detail
      ? `<ellipse class="a-halo a-breathe" style="animation-delay:-${blink}s" cx="80" cy="156" rx="34" ry="16" fill="url(#halo)"/>` +
        `<ellipse class="a-halo a-breathe" style="animation-delay:-${r1(blink * 0.7)}s" cx="192" cy="171" rx="46" ry="26" fill="url(#halo)"/>`
      : '')
  const spraysFar = detail ? spray(128, 0.75) + spray(268, 0.5) : ''
  const spraysNear = detail ? spray(250, 0) + spray(110, 0.25) : ''
  const smoke = puffs(252, 44, 14, detail ? 8 : 5, 7, 'puff', 'smoke') + puffs(209, 82, 8, detail ? 4 : 2, 3, 'vent', 'steam')
  return (
    shadow + spill + pool + beam + spraysFar + legsFar +
    `<g class="bob" style="animation-duration:${STRIDE / 2}s">${stack}${vent}${drum}${cab}${chassis}${hipCaps}${extras}${furnace}${window}${lamp}${caps}${halos}</g>` +
    legsNear + spraysNear + smoke
  )
}

type Walker = { scale: number; ground: number; left: boolean; at: number; detail: boolean }

const walkStyles: string[] = []
function walker(w: Walker, i: number): string {
  const width = 360 * w.scale
  // From off the right edge to off the left one (or back, for one walking right), with its beam and smoke.
  const startX = w.left ? 1600 + 220 * w.scale : -width - 240 * w.scale
  const span = 1600 + width + 460 * w.scale
  const dist = r1(span / w.scale)
  const period = r1(dist / SPEED)
  walkStyles.push(`@keyframes walk${i}{from{transform:translate(0,0)}to{transform:translate(-${dist}px,0)}}`)
  const y = r1(w.ground - GROUND * w.scale)
  const placed = w.left ? `translate(${r1(startX)} ${y}) scale(${w.scale})` : `translate(${r1(startX + width)} ${y}) scale(-${w.scale} ${w.scale})`
  return `<g transform="${placed}"><g style="animation:walk${i} ${period}s linear infinite;animation-delay:-${r1(w.at * period)}s">${automaton(w.detail, (i * 1.7) % 5)}</g></g>`
}

const FAR: Walker[] = [
  { scale: 0.12, ground: 536, left: true, at: 0.62, detail: false },
  { scale: 0.15, ground: 546, left: true, at: 0.32, detail: false },
  { scale: 0.17, ground: 560, left: false, at: 0.55, detail: false },
]
const MID: Walker = { scale: 0.42, ground: 712, left: true, at: 0.5, detail: true }
const NEAR: Walker = { scale: 1.05, ground: 984, left: true, at: 0.38, detail: true }

const WALKERS_FAR = FAR.map((w, i) => walker(w, i)).join('')
const WALKER_MID = walker(MID, 3)
const WALKER_NEAR = walker(NEAR, 4)

// ---- The land --------------------------------------------------------------------------------------------------------

function range(seed: number, base: number, top: number, step: number, [fill, shade, crest]: [string, string, string]): string {
  const r = seeded(seed)
  const pts: [number, number][] = []
  for (let x = -40; x <= 1640; x += step * (0.6 + r() * 0.8)) {
    pts.push([x, top + r() * (base - top) * 0.85])
  }
  // Broken rock along the ridge: points between the main ones, only ever raised, so the shading below still fits.
  const rough: [number, number][] = []
  for (let i = 0; i < pts.length; i++) {
    rough.push(pts[i]!)
    const next = pts[i + 1]
    if (next) {
      const [x0, y0] = pts[i]!
      const len = Math.hypot(next[0] - x0, next[1] - y0)
      for (const t of [0.25, 0.5, 0.75]) {
        rough.push([x0 + (next[0] - x0) * t, y0 + (next[1] - y0) * t - r() * len * 0.05])
      }
    }
  }
  const ridge = `M-40 ${base + 40} L${rough.map(([x, y]) => P(x, y)).join(' L')} L1640 ${base + 40} Z`
  let shadows = ''
  let crests = ''
  let gullies = ''
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i]!
    const [vx, vy] = pts[i + 1]!
    const [lx, ly] = pts[i - 1]!
    if (py < ly && py < vy) {
      const fx = px + (vx - px) * 0.18
      const fy = py + (base - py) * 0.75
      shadows += `M${P(px, py)} L${P(vx, vy)} L${P(vx, base + 40)} L${P(fx, base + 40)} L${P(fx, fy)} Z`
      crests += `M${P(px + (lx - px) * 0.35, py + (ly - py) * 0.35)} L${P(px, py)} L${P(px + (vx - px) * 0.25, py + (vy - py) * 0.25)}`
      // Snow-filled gullies down the lit face.
      // Each runs from the lit edge down toward the fold, as the rock ribs of a real face do.
      for (let g = 0; g < 3; g++) {
        const t = 0.15 + r() * 0.55
        const gx = px + (lx - px) * t
        const gy = py + (ly - py) * t + 2
        const k = 0.25 + r() * 0.3
        gullies += `M${P(gx, gy)} L${P(gx + (fx - gx) * k, gy + (fy - gy) * k)}`
      }
    }
  }
  return `<path fill="${fill}" d="${ridge}"/><path fill="${shade}" d="${shadows}"/><path class="crest" stroke="${crest}" d="${crests}"/><path class="gully" stroke="${crest}" d="${gullies}"/>`
}

const CLOUDS: [cx: number, cy: number, rx: number, ry: number, fill: string, period: number, delay: number][] = [
  [300, 110, 700, 80, 'cl-d', 90, 0], [1250, 80, 760, 90, 'cl-d', 110, 30], [820, 220, 820, 70, 'cl-w', 80, 50],
  [200, 310, 600, 55, 'cl-w', 100, 15], [1350, 290, 620, 60, 'cl-w', 95, 65],
]
const CLOUD_LAYER = CLOUDS.map(
  ([cx, cy, rx, ry, fill, period, delay]) =>
    `<ellipse class="cloud" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${fill})" style="animation-duration:${period}s;animation-delay:-${delay}s"/>`,
).join('')

// A city far off on the ridge: its generator, a few roofs and its smoke, one stream with its own keyframe.
const CX = 300
const cityPuffs = Array.from({ length: 18 }, (_, i) => {
  const j = 1 + ((i * 7) % 5) / 10
  return `<circle class="cityrise" cx="${CX}" cy="430" r="${r1(12 * j)}" fill="url(#smoke)" style="transform-origin:${CX}px 430px;animation-duration:24s;animation-delay:-${r1(i * 1.33)}s"/>`
}).join('')
const CITY = `<ellipse class="cityglow" cx="${CX}" cy="500" rx="190" ry="60" fill="url(#cityglow)"/>
<path class="city" d="M${CX - 9} 500 L${CX - 6} 446 L${CX + 6} 446 L${CX + 9} 500 Z M${CX - 13} 446 L${CX + 13} 446 L${CX + 10} 438 L${CX - 10} 438 Z M${CX - 5} 438 L${CX - 4} 428 L${CX + 4} 428 L${CX + 5} 438 Z
M${CX - 120} 506 L${CX - 120} 498 L${CX - 112} 493 L${CX - 104} 498 L${CX - 96} 493 L${CX - 88} 498 L${CX - 80} 494 L${CX - 60} 494 L${CX - 52} 499 L${CX - 30} 499 L${CX - 24} 494 L${CX + 24} 494 L${CX + 30} 499 L${CX + 60} 499 L${CX + 66} 494 L${CX + 90} 494 L${CX + 98} 499 L${CX + 130} 499 L${CX + 130} 506 Z"/>
<circle class="citycore" cx="${CX}" cy="478" r="3.5"/>
<path class="citywin" d="${[-112, -100, -84, -66, -44, -36, -16, 18, 30, 46, 72, 80, 104, 118].map((dx, i) => `M${CX + dx} ${i % 2 ? 501 : 503}h1.6`).join('')}"/>
${cityPuffs}`

// A road across the plain at middle distance, marked by poles with lamps, where the middle automaton walks.
const POLES = Array.from({ length: 9 }, (_, i) => {
  const x = 40 + i * 195
  const y = 706 + Math.sin(i * 1.3) * 3
  return `<path class="pole" d="M${x} ${r1(y)} L${x} ${r1(y - 34)} L${x + 7} ${r1(y - 34)}"/><circle class="polelamp" style="animation-delay:-${r1((i * 0.9) % 4)}s" cx="${x + 7}" cy="${r1(y - 31)}" r="2.2"/><ellipse class="polepool" cx="${x + 7}" cy="${r1(y + 2)}" rx="34" ry="5"/>`
}).join('')

const MOUNDS = [[260, 640, 420, 40], [1180, 620, 480, 34], [700, 820, 560, 54], [1400, 800, 380, 40]]
  .map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#mound)"/>`)
  .join('')

// Wind ripples on the snow, finer and denser toward the horizon.
const ground = seeded(4242)
const ripples = ['', '', '']
for (let i = 0; i < 90; i++) {
  const d = ground() ** 1.5 // 0 far, 1 near
  const y = 518 + d * 470
  const len = 14 + d * 70 * (0.5 + ground())
  const x = ground() * 1700 - 50
  ripples[d < 0.33 ? 0 : d < 0.66 ? 1 : 2] += `M${Math.round(x)} ${Math.round(y)}q${Math.round(len / 2)} ${r1(-(1.5 + d * 4))} ${Math.round(len)} 0`
}
const RIPPLES = ripples.map((d, i) => `<path class="ripple ripple${i}" d="${d}"/>`).join('')

// Footprints along the road, the hull's stride apart, and the far walkers' tracks on the ridge.
const stridePx = (((SWEEP * Math.PI) / 180) * LEG_REACH) * 0.42
let PRINTS = ''
for (let x = 10; x < 1600; x += stridePx) {
  const y = 712 + Math.sin(x / 260) * 3
  PRINTS += `M${Math.round(x)} ${r1(y - 4)}h5M${Math.round(x + stridePx / 2)} ${r1(y + 3)}h5`
}
const TRACKS = `<path class="prints" style="stroke-width:3" d="${PRINTS}"/><path class="prints" style="stroke-width:1;opacity:.25" d="M0 537 L1600 535 M0 547 L1600 546 M0 561 L1600 560"/>`

// Spindrift: snow blown low along the ground, one tiled path and a copy beside it, sliding on the wind.
function spindrift(rand: () => number, count: number, y0: number, y1: number, len: number, cls: string): string {
  let tile = ''
  for (let i = 0; i < count; i++) {
    const l = len * (0.4 + rand())
    tile += `M${Math.round(rand() * 2000)} ${Math.round(y0 + rand() * (y1 - y0))}q${Math.round(l / 2)} -3 ${Math.round(l)} 0`
  }
  return `<g class="spindrift ${cls}"><path d="${tile}"/><path transform="translate(2000 0)" d="${tile}"/></g>`
}
const DRIFT_FAR = spindrift(ground, 40, 520, 600, 90, 'drift-far')
const DRIFT_NEAR = spindrift(ground, 34, 880, 1000, 220, 'drift-near')

const ROAD = `<path class="road" d="M-20 712 C300 704 600 718 900 710 C1200 702 1400 716 1620 708"/>`

const GUSTS: [cx: number, cy: number, rx: number, ry: number, period: number, delay: number][] = [
  [900, 640, 520, 26, 17, 0], [600, 780, 640, 34, 21, 7], [1100, 520, 560, 30, 25, 14],
  [700, 900, 700, 40, 19, 4], [1000, 360, 600, 36, 29, 19],
]
const GUST_LAYER = GUSTS.map(
  ([cx, cy, rx, ry, period, delay]) =>
    `<ellipse class="gust" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#gust)" style="animation-duration:${period}s;animation-delay:-${delay}s"/>`,
).join('')

const BANKS = `<path fill="url(#bank)" d="M0 1000 L0 860 C90 842 180 870 260 914 C320 946 380 968 470 1000 Z"/>
<path fill="url(#bank)" d="M1600 1000 L1600 846 C1500 834 1410 864 1340 906 C1280 940 1220 966 1120 1000 Z"/>
<path class="banklip" d="M0 860 C90 842 180 870 260 914 C320 946 380 968 470 1000 M1600 846 C1500 834 1410 864 1340 906 C1280 940 1220 966 1120 1000"/>`

// Aurora at night, a weak sun by day.
const AURORA = `<path class="aurora" style="animation-duration:38s" fill="url(#aurora)" d="M-100 150 C200 90 420 210 700 140 C980 70 1200 190 1700 110 L1700 250 C1200 330 980 210 700 280 C420 350 200 230 -100 290 Z"/>
<path class="aurora" style="animation-duration:52s;animation-delay:-20s" fill="url(#aurora)" d="M-100 60 C260 20 520 120 860 70 C1160 26 1380 100 1700 50 L1700 140 C1380 190 1160 116 860 160 C520 210 260 110 -100 150 Z"/>`
const SUN = `<circle cx="1190" cy="150" r="230" fill="url(#sun)"/><circle class="sundisk" cx="1190" cy="150" r="30"/>`

// ---- Snow ------------------------------------------------------------------------------------------------------------

function snowLayer(rand: () => number, count: number, len: number, cls: string): string {
  let tile = ''
  for (let i = 0; i < count; i++) {
    const l = len * (0.5 + rand())
    tile += `M${Math.round(rand() * 2200)} ${Math.round(rand() * 1000)}l${r1(-l * 0.6)} ${r1(l)}`
  }
  return `<g class="snow ${cls}"><path d="${tile}"/><path transform="translate(600 -1000)" d="${tile}"/></g>`
}
const flakes = seeded(1919)
const SNOW_FAR = snowLayer(flakes, 280, 2.5, 'snow-far')
const SNOW_MID = snowLayer(flakes, 140, 5, 'snow-mid')
const SNOW_NEAR = snowLayer(flakes, 40, 9, 'snow-near')

// ---- Assembly --------------------------------------------------------------------------------------------------------

const stop = (offset: number, color: string, opacity = 1) =>
  `<stop offset="${offset}" stop-color="${color}"${opacity < 1 ? ` stop-opacity="${opacity}"` : ''}/>`
const radial = (id: string, stops: string, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx=".5" cy="${cy}" r="${r}">${stops}</radialGradient>`
const vertical = (id: string, stops: string) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>`

function scene(p: Palette): string {
  const defs = [
    vertical('sky', stop(0, p.sky[0]) + stop(0.38, p.sky[1]) + stop(0.55, p.sky[2])),
    vertical('hazeband', stop(0, p.haze[0], 0) + stop(1, p.haze[0], p.haze[1])),
    vertical('hazemid', stop(0, p.haze[0], 0) + stop(0.5, p.haze[0], p.haze[1]) + stop(1, p.haze[0], 0)),
    vertical('drum', stop(0, p.drum[1]) + stop(0.16, p.drum[0]) + stop(0.42, p.drum[1]) + stop(0.86, p.drum[2]) + stop(1, p.drumBounce)),
    `<linearGradient id="legcyl" x1="0" y1="0" x2="1" y2="0">${stop(0, p.legCyl[0]) + stop(0.3, p.legCyl[1]) + stop(0.6, p.legCyl[2]) + stop(1, p.legCyl[3])}</linearGradient>`,
    `<linearGradient id="beamfade" x1="1" y1="0" x2="0" y2="0">${stop(0, p.hot, p.beam * 2.4) + stop(1, p.hot, 0)}</linearGradient>`,
    radial('halo', stop(0, p.hot, p.halo) + stop(0.4, p.glow, p.halo * 0.35) + stop(1, p.glow, 0)),
    radial('spray', stop(0, p.ice[0], 0.9) + stop(1, p.ice[0], 0)),
    vertical('bank', stop(0, p.bank[0]) + stop(1, p.bank[1])),
    vertical('aurora', stop(0, '#5fe0b0', 0) + stop(0.5, '#5fe0b0', 0.3) + stop(0.8, '#4a9fd0', 0.12) + stop(1, '#4a9fd0', 0)),
    radial('mound', stop(0, p.drift[0], p.night ? 0.12 : 0.55) + stop(1, p.drift[0], 0), 0.35),
    radial('cl-d', stop(0, p.cloudDark[0], p.cloudDark[1]) + stop(1, p.cloudDark[0], 0)),
    radial('cl-w', stop(0, p.cloudLight[0], p.cloudLight[1]) + stop(1, p.cloudLight[0], 0)),
    radial('horizon', stop(0, p.haze[0], p.haze[1] * 0.8) + stop(1, p.haze[0], 0)),
    radial('sun', stop(0, '#fffaee', 0.85) + stop(0.3, '#f6f1e6', 0.3) + stop(1, '#eef0f0', 0)),
    radial('cityglow', stop(0, '#ff9a3c', 0.5) + stop(1, '#ff9a3c', 0)),
    radial('smoke', stop(0, p.smoke[0], p.smoke[2]) + stop(0.6, p.smoke[1], p.smoke[2] * 0.8) + stop(1, p.smoke[1], 0)),
    radial('steam', stop(0, p.steam[0], p.steam[1]) + stop(1, p.steam[0], 0)),
    radial('gust', stop(0, p.gust[0], p.gust[1]) + stop(1, p.gust[0], 0)),
    radial('pool', stop(0, p.pool[0], p.pool[1]) + stop(1, p.pool[0], 0)),
    radial('vignette', stop(0.55, p.vignette[0], 0) + stop(1, p.vignette[0], p.vignette[1]), 0.55, 0.75),
  ].join('\n')

  const style = `
.cloud{animation:cloud 100s ease-in-out infinite alternate}
.crest{fill:none;stroke-width:1.6;stroke-linejoin:round;opacity:${p.night ? 0.55 : 0.8}}
.plain{fill:${p.plain}}.drift{fill:none;stroke:${p.drift[0]};stroke-width:1.2;opacity:${p.drift[1]}}
.road{fill:none;stroke:${p.road[0]};stroke-width:16;stroke-linecap:round;opacity:${p.road[1]}}
.aurora{animation:aurora 40s ease-in-out infinite alternate}
.sundisk{fill:#fffcf3;opacity:.75}
.city{fill:${p.city}}.cityglow{opacity:${p.cityGlow};animation:glow 5s ease-in-out infinite}.citycore{fill:${p.glow};animation:breathe 5s ease-in-out infinite}
.cityrise{opacity:0;animation:cityrise 24s linear infinite}
.pole{fill:none;stroke:${p.pole};stroke-width:2.4;stroke-linecap:round}.polelamp{fill:${p.glow};animation:lamp 4s ease-in-out infinite}
.polepool{fill:url(#pool);opacity:${p.night ? 0.9 : 0.5}}
.a-leg{fill:url(#legcyl)}.a-legfar{fill:${p.legFar}}.a-joint{fill:${p.joint}}.a-hub{fill:${p.ironDark}}
.a-iron{fill:${p.iron}}.a-dark{fill:${p.ironDark}}
.a-rod{fill:none;stroke:${p.joint};stroke-width:4;stroke-linecap:round}.a-rodfar{fill:none;stroke:${p.legFar};stroke-linecap:round}
.a-edge{fill:none;stroke:${p.edge[0]};stroke-width:2;stroke-linecap:round;opacity:${p.edge[1]}}
.a-cap{fill:none;stroke:${p.snowCap[0]};stroke-width:3;stroke-linecap:round;opacity:${p.snowCap[1]}}
.a-band{fill:none;stroke:${p.ironDark};stroke-width:5}.a-rivet{fill:none;stroke:${p.joint};stroke-width:2.4;stroke-linecap:round}
.a-rail{fill:none;stroke:${p.iron};stroke-width:2.2}
.a-glow{fill:${p.glow}}.a-lamp{fill:${p.hot}}
.a-breathe{animation:breathe 3.6s ease-in-out infinite}
.a-warn{fill:#ff5a3a;animation:lamp 1.8s ease-in-out infinite}
.a-beam{fill:url(#beamfade)}.a-pool{fill:url(#pool)}
.a-shadow{fill:${p.shadow[0]};opacity:${p.shadow[1]}${p.shadowDx ? `;transform-origin:190px 422px;transform:translate(${p.shadowDx}px,0) scale(1.2,1)` : ''}}
.a-spill{opacity:${p.spill};animation:glow 3.6s ease-in-out infinite}.a-halo{opacity:.9}
.a-rust{fill:none;stroke:${p.rust[0]};stroke-width:1.6;stroke-linecap:round;opacity:${p.rust[1]}}
.a-snow{fill:${p.snowCap[0]};opacity:${p.snowCap[1]}}.a-ice{fill:${p.ice[0]};opacity:${p.ice[1]}}
.spray{opacity:0;animation:spray 4.8s linear infinite}
.gully{fill:none;stroke-width:1.2;stroke-linecap:round;opacity:${p.night ? 0.2 : 0.45}}
.ripple{fill:none;stroke:${p.drift[0]};stroke-linecap:round}.ripple0{stroke-width:.7;opacity:${r1(p.drift[1] * 0.35)}}.ripple1{stroke-width:1;opacity:${r1(p.drift[1] * 0.35)}}.ripple2{stroke-width:1.4;opacity:${r1(p.drift[1] * 0.4)}}
.prints{fill:none;stroke:${p.prints[0]};stroke-linecap:round;opacity:${p.prints[1]}}
.citywin{fill:none;stroke:${p.glow};stroke-width:1.6;opacity:${p.night ? 0.85 : 0.5}}
.spindrift{fill:none;stroke:${p.spindrift[0]};stroke-linecap:round;opacity:${p.spindrift[1]};animation:blow 9s linear infinite}
.drift-far{stroke-width:1.2;animation-duration:14s}.drift-near{stroke-width:2.6;animation-duration:6s}
.a-spin{animation:spin 6s linear infinite}
.hip{animation:hip 4.8s linear infinite}.knee{animation:knee 4.8s linear infinite}
.bob{animation:bob 2.4s ease-in-out infinite}
.puff{opacity:0;animation:puff 7s linear infinite}.vent{opacity:0;animation:vent 3s ease-out infinite}
.snow{fill:none;stroke-linecap:round;animation:fall 8s linear infinite}
.snow-far{stroke:${p.snow[0]};stroke-width:1.4;opacity:${p.snowOp[0]};animation-duration:10s}
.snow-mid{stroke:${p.snow[1]};stroke-width:2.4;opacity:${p.snowOp[1]};animation-duration:6.5s}
.snow-near{stroke:${p.snow[2]};stroke-width:4.2;opacity:${p.snowOp[2]};animation-duration:3.6s}
.gust{opacity:0;animation:gust 20s linear infinite}
.banklip{fill:none;stroke:${p.bankLip[0]};stroke-width:2.5;opacity:${p.bankLip[1]}}
${walkStyles.join('\n')}
@keyframes cloud{from{transform:translate(-70px,0)}to{transform:translate(70px,4px)}}
@keyframes aurora{0%{transform:translate(-60px,0);opacity:.5}50%{opacity:1}100%{transform:translate(60px,-8px);opacity:.6}}
@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes breathe{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes lamp{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes hip{0%{transform:rotate(12deg)}75%{transform:rotate(-12deg)}88%{transform:rotate(2deg)}100%{transform:rotate(12deg)}}
@keyframes knee{0%,75%{transform:rotate(0deg)}83%{transform:rotate(-34deg)}93%{transform:rotate(-12deg)}100%{transform:rotate(0deg)}}
@keyframes bob{0%,100%{transform:translate(0,0)}50%{transform:translate(0,3px)}}
@keyframes puff{0%{transform:translate(0,0) scale(.4);opacity:0}8%{opacity:.9}60%{opacity:.5}100%{transform:translate(230px,-230px) scale(4.2);opacity:0}}
@keyframes vent{0%{transform:translate(0,0) scale(.4);opacity:0}10%{opacity:.8}100%{transform:translate(70px,-50px) scale(3);opacity:0}}
@keyframes cityrise{0%{transform:translate(0,0) scale(.5);opacity:0}8%{opacity:.85}60%{opacity:.5}100%{transform:translate(260px,-260px) scale(4.5);opacity:0}}
@keyframes spray{0%{transform:translate(0,0) scale(.3);opacity:0}4%{opacity:.85}22%{transform:translate(28px,-12px) scale(2.4);opacity:0}100%{transform:translate(28px,-12px) scale(2.4);opacity:0}}
@keyframes blow{from{transform:translate(0,0)}to{transform:translate(-2000px,0)}}
@keyframes fall{from{transform:translate(0,0)}to{transform:translate(-600px,1000px)}}
@keyframes gust{0%{transform:translate(500px,0);opacity:0}25%{opacity:1}75%{opacity:.8}100%{transform:translate(-600px,0);opacity:0}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${style}</style><defs>${defs}</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${p.night ? AURORA : SUN}
<g>${CLOUD_LAYER}</g>
<ellipse cx="800" cy="500" rx="1100" ry="150" fill="url(#horizon)"/>
${range(7, 500, 340, 80, p.far)}
<rect y="300" width="1600" height="230" fill="url(#hazeband)"/>
${range(11, 525, 440, 70, p.near)}
<rect class="plain" y="512" width="1600" height="488"/>
${MOUNDS}
${RIPPLES}
${CITY}
${WALKERS_FAR}
${DRIFT_FAR}
<rect y="440" width="1600" height="200" fill="url(#hazemid)" opacity=".6"/>
<path class="drift" d="M0 560 C200 552 380 566 560 558 M1040 558 C1220 550 1400 564 1600 554 M60 610 C240 600 420 614 600 606 M1000 620 C1180 610 1360 622 1560 614 M120 820 C340 806 560 826 760 816 M900 860 C1100 846 1300 866 1520 852"/>
${ROAD}
${TRACKS}
${POLES}
${WALKER_MID}
<rect y="560" width="1600" height="300" fill="url(#hazemid)" opacity=".3"/>
<g>${GUST_LAYER}</g>
${SNOW_FAR}
${WALKER_NEAR}
${DRIFT_NEAR}
${SNOW_MID}
${BANKS}
<rect width="1600" height="1000" fill="url(#vignette)"/>
${SNOW_NEAR}
</svg>`
}

export const SCENE_NIGHT = scene(NIGHT)
export const SCENE_DAY = scene(DAY)
