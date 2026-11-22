// Yog-Sothoth, the Gate and the Key, as a plate in a forbidden book. A conglomeration of globes, as the stories
// describe him, drawn in iron-gall ink on vellum and held in the rings of an astrolabe that turn against each
// other, ticked and lettered in a script no one reads, with a red rubric, the text running down the margin and
// limbs reaching in at the edge. Each globe wears a second wash that comes and goes over it.
//
// Made for a light window: parchment and sepia, so the app's dark text stays readable on the glass. Built from the
// same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// `transform-origin` in positive px, durations and delays inline, no SMIL, no filters, no masks, no `var()` in a
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

// One layout, two palettes: the style is a template whose {key} slots each palette fills with written-out values,
// so no keyframe ever holds a var().
const fill = (tpl: string, p: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => {
    if (!(k in p)) throw new Error(`missing palette key ${k}`)
    return String(p[k])
  })

const svg = (style: string, defs: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${style}\n@media (prefers-reduced-motion: reduce) { * { animation: none !important } }</style><defs>${defs}</defs>${body}</svg>`

const CX = 1080
const CY = 440

// A sigil: a few strokes in a small box, the same every time.
function sigil(rand: () => number, s: number) {
  let d = ''
  const pts = () => `${r1((rand() - 0.5) * s)} ${r1((rand() - 0.5) * s)}`
  const n = 2 + Math.floor(rand() * 3)
  for (let i = 0; i < n; i++) {
    const kind = rand()
    if (kind < 0.4) d += `M${pts()} L${pts()}`
    else if (kind < 0.8) d += `M${pts()} Q${pts()} ${pts()}`
    else d += `M${r1((rand() - 0.5) * s)} ${r1((rand() - 0.5) * s)} m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0`
  }
  return d
}

function ring(rand: () => number, r: number, width: number, glyphs: number, ticks: number, dur: number, dir: 1 | -1) {
  let s = `<circle class="ring" cx="${CX}" cy="${CY}" r="${r}" style="stroke-width:${width}"/><circle class="ring-thin" cx="${CX}" cy="${CY}" r="${r + 16}"/>`
  let t = ''
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2
    const l = i % 5 === 0 ? 10 : 5
    t += `M${r1(CX + Math.cos(a) * (r + 16))} ${r1(CY + Math.sin(a) * (r + 16))} L${r1(CX + Math.cos(a) * (r + 16 - l))} ${r1(CY + Math.sin(a) * (r + 16 - l))}`
  }
  s += `<path class="tick" d="${t}"/>`
  for (let i = 0; i < glyphs; i++) {
    const a = (i / glyphs) * 360 + rand() * 4
    const rad = (a * Math.PI) / 180
    const gx = r1(CX + Math.cos(rad) * (r + 30))
    const gy = r1(CY + Math.sin(rad) * (r + 30))
    s += `<path class="${i % 7 === 0 ? 'glyph rubric' : 'glyph'}" transform="translate(${gx} ${gy}) rotate(${r1(a + 90)})" d="${sigil(rand, 14)}"/>`
  }
  return `<g class="${dir > 0 ? 'turn' : 'unturn'}" style="transform-origin:${CX}px ${CY}px;animation-duration:${dur}s">${s}</g>`
}

function rings() {
  const rand = seeded(101)
  return [
    ring(rand, 200, 2, 18, 72, 140, 1),
    ring(rand, 278, 1.5, 26, 120, 210, -1),
    ring(rand, 360, 2.5, 34, 180, 300, 1),
    ring(rand, 452, 1, 44, 240, 420, -1),
  ].join('')
}

// The elder sign, faint, behind it all: a five-pointed star with the eye-shaped heart.
const STAR = (() => {
  const pts: string[] = []
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5
    pts.push(`${r1(CX + Math.cos(a) * 196)} ${r1(CY + Math.sin(a) * 196)}`)
  }
  return `<g class="unturn" style="transform-origin:${CX}px ${CY}px;animation-duration:600s"><path class="sign" d="M${pts.join(' L')} Z"/><ellipse class="sign" cx="${CX}" cy="${CY}" rx="40" ry="16"/></g>`
})()

// The globes: each a sphere and a second skin of another hue that comes and goes over it.
function globes() {
  const rand = seeded(7)
  const placed: [number, number, number][] = []
  let tries = 0
  while (placed.length < 26 && tries < 4000) {
    tries++
    const r = 12 + Math.pow(rand(), 1.8) * 50
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * 160
    const x = CX + Math.cos(a) * d
    const y = CY + Math.sin(a) * d * 0.9
    if (placed.every(([px, py, pr]) => Math.hypot(px - x, py - y) > (pr + r) * 0.82)) placed.push([x, y, r])
  }
  placed.sort((a, b) => a[2] - b[2]) // small ones behind
  return placed
    .map(([x, y, r], i) => {
      const g1 = 1 + (i % 5)
      const g2 = 1 + ((i * 3 + 2) % 5)
      const dur = r1(6 + rand() * 6)
      const dl = r1(rand() * 8)
      return `<g class="bob" style="animation-duration:${dur}s;animation-delay:-${dl}s"><circle class="globe" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="url(#g${g1})"/><circle class="skin" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="url(#g${g2})" style="animation-duration:${r1(dur * 1.3)}s;animation-delay:-${dl}s"/><ellipse class="shine" cx="${r1(x - r * 0.35)}" cy="${r1(y - r * 0.4)}" rx="${r1(r * 0.28)}" ry="${r1(r * 0.16)}" transform="rotate(-30 ${r1(x - r * 0.35)} ${r1(y - r * 0.4)})"/></g>`
    })
    .join('')
}

function specks() {
  const rand = seeded(13)
  let s = ''
  for (let i = 0; i < 110; i++) {
    s += `<circle class="speck" cx="${r1(rand() * 1600)}" cy="${r1(rand() * 1000)}" r="${r1(0.5 + rand() * 1.4)}" style="animation-duration:${r1(3 + rand() * 6)}s;animation-delay:-${r1(rand() * 6)}s"/>`
  }
  return s
}

function stains() {
  const rand = seeded(31)
  let s = ''
  for (let i = 0; i < 9; i++) {
    s += `<ellipse class="stain" cx="${r1(rand() * 1600)}" cy="${r1(rand() * 1000)}" rx="${r1(60 + rand() * 200)}" ry="${r1(40 + rand() * 140)}" fill="url(#stain)"/>`
  }
  return s
}

// The margin's text: lines of a hand no one reads, with a red initial.
function margin() {
  const rand = seeded(59)
  let d = ''
  for (let line = 0; line < 30; line++) {
    const y = 130 + line * 26
    let x = line < 3 ? 160 : 90
    const end = 470 - rand() * (line % 6 === 5 ? 200 : 30)
    while (x < end) {
      const w = 14 + rand() * 40
      d += `M${r1(x)} ${y}`
      for (let k = 0; k < w; k += 5) d += ` l2.5 ${r1(-3 - rand() * 3)} l2.5 ${r1(3 + rand() * 3)}`
      x += w + 9
    }
  }
  return `<path class="script" d="${d}"/><rect class="initial" x="90" y="106" width="56" height="64"/><path class="initial-ink" d="M102 122 C128 108 136 150 114 152 C98 154 100 134 120 134 M124 160 L134 116 M100 162 L112 158"/>`
}

const TENTACLES: TentacleSpec[] = [
  { x: 1560, y: 1080, flip: true, length: 520, width: 104, joints: 10, period: 6.8, baseDeg: 2, tipDeg: 11, lag: 0.6, delay: 0 },
  { x: 1420, y: 1090, flip: false, length: 300, width: 60, joints: 8, period: 5.4, baseDeg: 2.5, tipDeg: 13, lag: 0.5, delay: 2.4 },
  { x: 640, y: 1090, flip: true, length: 260, width: 52, joints: 8, period: 5, baseDeg: 3, tipDeg: 14, lag: 0.45, delay: 1.3 },
]
const { markup: TENT, style: SWING } = tentacles(TENTACLES)

const TPL = `
.bg-a{stop-color:{bgA}}.bg-b{stop-color:{bgB}}.bg-c{stop-color:{bgC}}
.aura-a{stop-color:{aura};stop-opacity:{auraOp}}.aura-b{stop-color:{aura};stop-opacity:0}
.st-a{stop-color:{stain};stop-opacity:{stainOp}}.st-b{stop-color:{stain};stop-opacity:0}
.tent-a{stop-color:{tentA}}.tent-b{stop-color:{tentB}}
.g1a{stop-color:{g1a}}.g1b{stop-color:{g1b}}.g2a{stop-color:{g2a}}.g2b{stop-color:{g2b}}.g3a{stop-color:{g3a}}.g3b{stop-color:{g3b}}
.g4a{stop-color:{g4a}}.g4b{stop-color:{g4b}}.g5a{stop-color:{g5a}}.g5b{stop-color:{g5b}}
.ring{fill:none;stroke:{ring};opacity:{ringOp}}.ring-thin{fill:none;stroke:{ring};stroke-width:.8;opacity:{ringOp}}
.tick{fill:none;stroke:{ring};stroke-width:1;opacity:{ringOp}}
.glyph{fill:none;stroke:{glyph};stroke-width:1.4;stroke-linecap:round;opacity:{glyphOp}}.rubric{stroke:{rubric}}
.sign{fill:none;stroke:{sign};stroke-width:1.2;opacity:{signOp}}
.turn{animation:turn 200s linear infinite}.unturn{animation:unturn 200s linear infinite}
.globe{stroke:{globeLine};stroke-width:{globeLineW}}.skin{opacity:0;animation:skin 8s ease-in-out infinite alternate}
.shine{fill:{shine};opacity:{shineOp}}
.bob{animation:bob 8s ease-in-out infinite alternate}
.aura{animation:aura 10s ease-in-out infinite}
.speck{fill:{speck};opacity:{speckOp};animation:twinkle 5s ease-in-out infinite alternate}
.stain{opacity:1}
.script{fill:none;stroke:{script};stroke-width:1.3;opacity:{scriptOp}}
.initial{fill:{rubric};opacity:{initialOp}}.initial-ink{fill:none;stroke:{initialInk};stroke-width:4;opacity:{initialOp}}
.sk{fill:{sk};opacity:.55}
{SWING}
@keyframes turn{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes unturn{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes skin{from{opacity:0}to{opacity:.9}}
@keyframes bob{from{transform:translate(-3px,-5px)}to{transform:translate(3px,5px)}}
@keyframes aura{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes twinkle{from{opacity:{speckLo}}to{opacity:{speckOp}}}`

const grad = (n: number) =>
  `<radialGradient id="g${n}" cx=".38" cy=".34" r=".7"><stop offset="0" class="g${n}a"/><stop offset="1" class="g${n}b"/></radialGradient>`

const DEFS = `<radialGradient id="bg" cx=".67" cy=".44" r=".9"><stop offset="0" class="bg-a"/><stop offset=".55" class="bg-b"/><stop offset="1" class="bg-c"/></radialGradient>
<radialGradient id="aura"><stop offset="0" class="aura-a"/><stop offset="1" class="aura-b"/></radialGradient>
<radialGradient id="stain"><stop offset="0" class="st-a"/><stop offset=".7" class="st-a"/><stop offset="1" class="st-b"/></radialGradient>
<linearGradient id="tent" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="1090"><stop offset="0" class="tent-a"/><stop offset="1" class="tent-b"/></linearGradient>
${[1, 2, 3, 4, 5].map(grad).join('')}`

const BODY = `<rect width="1600" height="1000" fill="url(#bg)"/>
${stains()}${margin()}
${specks()}
<circle class="aura" cx="${CX}" cy="${CY}" r="560" fill="url(#aura)" style="transform-origin:${CX}px ${CY}px"/>
${STAR}${rings()}
${globes()}
<g fill="url(#tent)">${TENT}</g>`

function gate(p: Record<string, string | number>) {
  return svg(fill(TPL.replace('{SWING}', SWING), p), DEFS, BODY)
}

export const SCENE = gate({
  bgA: '#f1e7cf', bgB: '#e6d8b8', bgC: '#cdb88e', aura: '#b8892f', auraOp: 0.12, stain: '#9c7a3e', stainOp: 0.08,
  tentA: '#6b5236', tentB: '#3f2e1c', sk: '#c2a87a',
  g1a: '#f4ead2', g1b: '#a9906a', g2a: '#f6ead0', g2b: '#b48a5a', g3a: '#f2e6cc', g3b: '#9a7f66', g4a: '#efe6d0', g4b: '#8d8370', g5a: '#f6ecd2', g5b: '#a3925f',
  ring: '#3b2a1a', ringOp: 0.6, glyph: '#3b2a1a', glyphOp: 0.75, rubric: '#9a2b1c', sign: '#9a2b1c', signOp: 0.35,
  globeLine: '#3b2a1a', globeLineW: 1.3, shine: '#fffaf0', shineOp: 0.7, speck: '#5a4128', speckOp: 0.3, speckLo: 0.3,
  script: '#3b2a1a', scriptOp: 0.28, initialOp: 0.75, initialInk: '#f1e7cf',
})
