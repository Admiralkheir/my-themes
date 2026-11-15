// R'lyeh risen, seen in cold weather: a pale overcast sky over a slate-grey sea,
// a drizzle, fog that drifts across the water, the city's wrong angles on the
// horizon and, far off, a vast shape with wings that the fog gives and takes
// back. Its face-tentacles sway, its eyes now and then open, and nearer to hand
// two limbs rise out of the sea.
//
// Made for a light window: every color is a cold grey, so the app's dark text
// stays readable on the glass. Built from the same constructs as the cthulhu
// scene (see there): CSS keyframes with literal values, `transform-origin` in
// positive px, durations and delays inline, no SMIL, no filters, no `var()` in a
// keyframe and no `@media` but the reduced-motion rule.

import { tentacles, type TentacleSpec } from '../tentacles.js'

const r1 = (n: number) => Math.round(n * 10) / 10

// A fixed sequence in place of Math.random, so the scene is the same string every time.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const TENTACLES: TentacleSpec[] = [
  { x: 120, y: 1060, flip: false, length: 600, width: 120, joints: 10, period: 6.5, baseDeg: 2, tipDeg: 10, lag: 0.6, delay: 0 },
  { x: 300, y: 1070, flip: true, length: 330, width: 64, joints: 8, period: 5.2, baseDeg: 2.5, tipDeg: 12, lag: 0.5, delay: 2.6 },
  { x: 1500, y: 1060, flip: true, length: 660, width: 130, joints: 10, period: 7, baseDeg: 2, tipDeg: 9, lag: 0.65, delay: 3.8 },
]

const { markup: TENTACLE_MARKUP, style: SWING_STYLE } = tentacles(TENTACLES)

// ---- The one who waits -----------------------------------------------------------------------------------------
// Centered on x 1080, his shoulders on the horizon at y 600. Drawn whole: the sea, drawn after, hides the rest.

const CX = 1080
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${r1(2 * CX - Number(x))} ${y}`)

// A bat's wing from behind the shoulder: an arm up to the elbow, fingers fanning out from it to four points,
// and the membrane scalloped in toward the elbow between them.
const WING =
  'M1000 500 L905 352 L748 228 C786 282 772 300 712 322 C760 342 762 372 730 412 ' +
  'C776 412 800 436 808 474 C850 468 900 476 950 505 Z'
const WING_RIBS = 'M1000 500 L905 352 M905 352 L748 228 M905 352 L712 322 M905 352 L730 412 M905 352 L808 474'

// Hunched shoulders, and the head above them: an octopus's mantle, round and wide at the crown.
const BODY =
  'M840 612 C846 540 900 492 975 482 C1012 478 1030 476 1040 472 ' +
  'C1004 432 996 344 1030 298 C1056 262 1104 262 1130 298 C1164 344 1156 432 1120 472 ' +
  'C1130 476 1148 478 1185 482 C1260 492 1314 540 1320 612 Z'

// Face-tentacles hang from under the eyes to the water, each swaying about its root.
function faceTentacle(x: number, y: number, len: number, w: number, bend: number): string {
  const n = 8
  const left: string[] = []
  const right: string[] = []
  for (let i = 0; i <= n; i++) {
    const f = i / n
    const cx = x + Math.sin(f * Math.PI * 1.2) * bend * f
    const half = (w * (1 - f) + 1.2) / 2
    left.push(`${r1(cx - half)} ${r1(y + f * len)}`)
    right.unshift(`${r1(cx + half)} ${r1(y + f * len)}`)
  }
  return `M${left.join(' L')} L${right.join(' L')} Z`
}

const FACE: [x: number, len: number, w: number, bend: number, period: number, delay: number][] = [
  [1040, 128, 14, -12, 4.2, 0], [1058, 150, 16, 8, 5, 1.4], [1073, 162, 17, -6, 4.6, 2.8],
  [1088, 162, 17, 7, 5.4, 0.7], [1103, 150, 16, -9, 4.8, 2.1], [1120, 128, 14, 12, 4.4, 3.3],
]

const faceTentacles = FACE.map(
  ([x, len, w, bend, period, delay]) =>
    `<path class="sway" style="transform-origin:${x}px 440px;animation-duration:${period}s;animation-delay:-${delay}s" d="${faceTentacle(x, 440, len, w, bend)}"/>`,
).join('')

const EYES = [1052, 1108]
  .map(
    (x, i) =>
      `<g class="eye" style="transform-origin:${x}px 396px;animation-delay:-${i * 0.15}s">` +
      `<ellipse class="eye-glow" cx="${x}" cy="396" rx="22" ry="9"/><ellipse class="eye-core" cx="${x}" cy="396" rx="9" ry="3.5"/></g>`,
  )
  .join('')

const ANCIENT = `<g class="ancient" style="transform-origin:${CX}px 600px">
<path class="wing" d="${WING}"/><path class="wing" d="${mirror(WING)}"/>
<path class="rib" d="${WING_RIBS}"/><path class="rib" d="${mirror(WING_RIBS)}"/>
<path class="body" d="${BODY}"/>
<g class="beard">${faceTentacles}</g>
${EYES}
</g>`

// ---- R'lyeh on the horizon --------------------------------------------------------------------------------------

const CITY_FAR = `<path class="city-far" d="M0 602 L0 560 L60 554 L82 498 L132 514 L140 558 L232 550 L262 468 L304 490 L298 554 L384 548 L424 516 L474 542 L486 602 Z"/>
<path class="city-far" d="M1290 602 L1312 540 L1372 516 L1390 558 L1452 546 L1484 476 L1534 502 L1522 554 L1600 548 L1600 602 Z"/>`

// The great monolith, leaning, and a lintel that no right angle would hold.
const CITY_NEAR = `<path class="city-near" d="M520 602 L548 560 L586 556 L604 438 L652 418 L668 552 L720 548 L742 520 L792 534 L800 602 Z"/>
<path class="city-near" d="M140 602 L158 572 L214 566 L232 600 Z"/>
<path class="city-near" d="M1380 602 L1404 568 L1470 560 L1478 602 Z"/>`

// ---- Sea, fog and drizzle ----------------------------------------------------------------------------------------

// Rows of swell, closer together toward the horizon. Each row is a long wavy line that flows on by one
// wavelength and starts over (the same line again, so no seam), every other row the other way, while the row as
// a whole rises and falls. A row's flow names its keyframe with its distance written out, as the swings do.
const WAVE_ROWS: [y: number, wavelength: number, amp: number, width: number, opacity: number, period: number][] = [
  [618, 60, 1.5, 1, 0.3, 5], [638, 80, 2, 1.1, 0.32, 5.5], [664, 104, 3, 1.3, 0.34, 6],
  [698, 132, 4, 1.5, 0.36, 6.5], [742, 166, 5, 1.8, 0.38, 7], [798, 210, 7, 2.1, 0.4, 7.5],
  [866, 260, 9, 2.5, 0.42, 8], [948, 320, 11, 3, 0.44, 9],
]

const flows: string[] = []
const waves = WAVE_ROWS.map(([y, wl, amp, width, opacity, period], i) => {
  let d = `M${-wl * 2} ${y}`
  for (let x = -wl * 2; x < 1600 + wl * 2; x += wl) {
    d += ` q${r1(wl / 4)} ${-amp} ${r1(wl / 2)} 0 t${r1(wl / 2)} 0`
  }
  const dir = i % 2 === 0 ? 1 : -1
  const name = `flow${i}`
  const bob = r1(1.5 + i * 0.9)
  flows.push(
    `.${name}{animation:${name} 5s linear infinite}@keyframes ${name}{from{transform:translate(0,0)}to{transform:translate(${dir * wl}px,0)}}`,
    `.bob${i}{animation:bob${i} 5s ease-in-out infinite alternate}@keyframes bob${i}{from{transform:translate(0,-${bob}px)}to{transform:translate(0,${bob}px)}}`,
  )
  return (
    `<g class="bob${i}" style="animation-duration:${r1(period * 0.6)}s;animation-delay:-${r1(i * 1.3)}s">` +
    `<path class="wave ${name}" style="stroke-width:${width};opacity:${opacity};animation-duration:${period}s" d="${d}"/></g>`
  )
}).join('')
const FLOW_STYLE = flows.join('\n')

const FOG: [cx: number, cy: number, rx: number, ry: number, period: number, delay: number][] = [
  [260, 585, 620, 70, 38, 0], [1180, 560, 560, 60, 46, 12], [800, 520, 700, 50, 54, 25],
  [400, 470, 520, 40, 60, 8], [1320, 650, 600, 55, 42, 30],
]

const fog = FOG.map(
  ([cx, cy, rx, ry, period, delay]) =>
    `<ellipse class="fog" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#fog)" style="animation-duration:${period}s;animation-delay:-${delay}s"/>`,
).join('')

// Rain in two layers, a fine far one and a heavier near one that falls faster. Each layer is one tile of
// slanted streaks and a copy above it, falling together and starting over seamlessly.
const rand = seeded(42)
function rainLayer(count: number, minLen: number, spread: number, cls: string): string {
  const streaks: string[] = []
  for (let i = 0; i < count; i++) {
    const x = r1(rand() * 1760)
    const y = r1(rand() * 1000)
    const len = minLen + rand() * spread
    streaks.push(`M${x} ${y} l${r1(-len * 0.12)} ${r1(len)}`)
  }
  const tile = streaks.join(' ')
  return `<g class="${cls}"><path d="${tile}"/><path transform="translate(120 -1000)" d="${tile}"/></g>`
}
const RAIN = rainLayer(170, 12, 18, 'rain rain-far') + rainLayer(80, 26, 26, 'rain rain-near')

const STYLE = `
.sky-a{stop-color:#e6eaec}.sky-b{stop-color:#d0d7da}.sky-c{stop-color:#b7c1c6}
.sea-a{stop-color:#9ea9af}.sea-b{stop-color:#7e8b92}.sea-c{stop-color:#606d75}
.fog-a{stop-color:#f3f5f6;stop-opacity:.8}.fog-b{stop-color:#f3f5f6;stop-opacity:0}
.sun-a{stop-color:#fbfcfc;stop-opacity:.75}.sun-b{stop-color:#fbfcfc;stop-opacity:0}
.tent-a{stop-color:#76838a}.tent-b{stop-color:#414d55}
.city-far{fill:#aab4b9}.city-near{fill:#95a1a7}
.wing{fill:#b2bbc0}.rib{fill:none;stroke:#a6b0b5;stroke-width:3}.body{fill:#a9b2b8}.beard{fill:#9aa5ab}
.eye-glow{fill:#eef8f5;opacity:.7}.eye-core{fill:#ffffff}
.ancient{animation:loom 34s ease-in-out infinite}
.eye{opacity:0;animation:blink 19s ease-in-out infinite}
.sway{animation:sway 5s ease-in-out infinite alternate}
.wave{fill:none;stroke:#dde4e7}
.fog{animation:drift 45s ease-in-out infinite alternate}
.rain{fill:none;stroke:#6f7c84;animation:fall 1.4s linear infinite}
.rain-far{stroke-width:1;opacity:.2}.rain-near{stroke-width:1.4;opacity:.3;animation-duration:.85s}
.sk{fill:#bcc6cb;opacity:.5}
.glint{fill:#f4f7f8;opacity:0;animation:glint 7s ease-in-out infinite}
${SWING_STYLE}
${FLOW_STYLE}
@keyframes loom{0%,100%{transform:translate(0,10px);opacity:.2}45%,60%{transform:translate(0,0);opacity:.5}}
@keyframes blink{0%,70%,100%{transform:scale(1,.05);opacity:0}75%,90%{transform:scale(1,1);opacity:.9}82%{transform:scale(1,.7);opacity:1}}
@keyframes sway{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
@keyframes drift{from{transform:translate(-90px,0)}to{transform:translate(90px,-6px)}}
@keyframes fall{from{transform:translate(0,0)}to{transform:translate(-120px,1000px)}}
@keyframes glint{0%,100%{opacity:0}50%{opacity:.55}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`

const DEFS = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".5" class="sky-b"/><stop offset="1" class="sky-c"/></linearGradient>
<linearGradient id="sea" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="1000"><stop offset="0" class="sea-a"/><stop offset=".45" class="sea-b"/><stop offset="1" class="sea-c"/></linearGradient>
<radialGradient id="fog" cx=".5" cy=".5" r=".5"><stop offset="0" class="fog-a"/><stop offset="1" class="fog-b"/></radialGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" class="sun-a"/><stop offset="1" class="sun-b"/></radialGradient>
<linearGradient id="tent" gradientUnits="userSpaceOnUse" x1="0" y1="400" x2="0" y2="1070"><stop offset="0" class="tent-a"/><stop offset="1" class="tent-b"/></linearGradient>`

// Light on the water under the pale sun, coming and going.
const GLINTS = [
  [430, 640, 60], [470, 668, 80], [400, 700, 50], [455, 735, 95],
].map(([x, y, w], i) => `<rect class="glint" x="${x - w / 2}" y="${y}" width="${w}" height="2" style="animation-delay:-${i * 1.6}s"/>`).join('')

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${STYLE}</style><defs>${DEFS}</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<ellipse cx="430" cy="230" rx="260" ry="260" fill="url(#sun)"/>
<circle cx="430" cy="230" r="54" fill="#f7f9fa" opacity=".7"/>
<g>${fog}</g>
${CITY_FAR}
${ANCIENT}
${CITY_NEAR}
<rect y="598" width="1600" height="402" fill="url(#sea)"/>
<ellipse cx="${CX}" cy="618" rx="230" ry="16" fill="#8a969d" opacity=".25"/>
${GLINTS}
<g>${waves}</g>
<ellipse class="fog" cx="700" cy="610" rx="900" ry="45" fill="url(#fog)" style="animation-duration:50s;animation-delay:-18s"/>
<g fill="url(#tent)">${TENTACLE_MARKUP}</g>
${RAIN}
</svg>`
