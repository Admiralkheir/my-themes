// Operation Yashima. Ramiel, the blue octahedron, hangs over Tokyo-3 drilling down toward the Geofront, its faces
// turning; on Mount Futago the positron rifle waits on power drawn from all of Japan, so the night is dark from
// coast to coast, and now and then the shot goes out and the Angel's field flares in orange octagons. For light
// windows, the same Angel at noon above the lake, its facets holding the sky.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg, oct } from '../eva.js'

const CX = 1080
const TOP = 120
const BOT = 600
const EQ = 365
const HW = 185
const LAKE = 740

// The faces for one turn of the octahedron: the front vertex slides across the equator as it turns.
function faces(front: number) {
  const T = `${CX} ${TOP}`
  const B = `${CX} ${BOT}`
  const L = `${CX - HW} ${EQ}`
  const R = `${CX + HW} ${EQ}`
  const F = `${r1(front)} ${EQ + 8}`
  return `<path class="f1" d="M${T} L${L} L${F} Z"/><path class="f2" d="M${T} L${F} L${R} Z"/><path class="f3" d="M${B} L${L} L${F} Z"/><path class="f4" d="M${B} L${F} L${R} Z"/><path class="edge" d="M${T} L${F} L${B} M${L} L${F} L${R}"/>`
}

const RAMIEL = `<path class="core" d="M${CX} ${TOP} L${CX + HW} ${EQ} L${CX} ${BOT} L${CX - HW} ${EQ} Z"/>
<g class="turn" style="animation-delay:0s">${faces(CX - 90)}</g>
<g class="turn" style="animation-delay:-8s">${faces(CX + 5)}</g>
<g class="turn" style="animation-delay:-4s">${faces(CX + 100)}</g>
<path class="rim" d="M${CX} ${TOP} L${CX + HW} ${EQ} L${CX} ${BOT} L${CX - HW} ${EQ} Z"/>
<path class="drill" d="M${CX - 3} ${BOT} L${CX} 712 L${CX + 3} ${BOT} Z"/>
<ellipse class="dig" cx="${CX}" cy="712" rx="60" ry="10" style="transform-origin:${CX}px 712px"/>`

// Its likeness in the lake, upside down and broken by ripples.
const MIRROR = (() => {
  const m = (y: number) => r1(712 + (712 - y) * 0.55)
  return `<path class="mirror" d="M${CX} ${m(TOP)} L${CX + HW} ${m(EQ)} L${CX} ${m(BOT)} L${CX - HW} ${m(EQ)} Z"/>`
})()

function ripples() {
  const rand = seeded(7)
  let s = ''
  for (let i = 0; i < 26; i++) {
    const y = LAKE + 6 + Math.pow(i / 26, 1.4) * 250
    const x = rand() * 1600
    const w = 60 + rand() * 260
    s += `<path class="ripple" d="M${r1(x)} ${r1(y)} h${r1(w)}" style="animation-duration:${r1(5 + rand() * 6)}s;animation-delay:-${r1(rand() * 6)}s"/>`
  }
  return s
}

function stars() {
  const rand = seeded(13)
  let d = ''
  for (let i = 0; i < 160; i++) d += `M${r1(rand() * 1600)} ${r1(rand() * 560)}h1.6v1.6h-1.6z`
  return `<path class="stars" d="${d}"/><path class="stars tw" d="${d}" transform="translate(7 3)"/>`
}

// The pylons that carry Japan's power to the rifle, marching up the hill.
function pylons() {
  const at: [number, number, number][] = [[1500, 760, 0.55], [1240, 742, 0.45], [960, 720, 0.38], [700, 690, 0.42], [470, 640, 0.5]]
  let s = ''
  const tops: [number, number][] = []
  for (const [x, y, k] of at) {
    const h = 260 * k
    const w = 40 * k
    s += `<path class="pylon" d="M${r1(x - w)} ${y} L${r1(x - w * 0.2)} ${r1(y - h)} L${r1(x + w * 0.2)} ${r1(y - h)} L${r1(x + w)} ${y} M${r1(x - w * 0.8)} ${r1(y - h * 0.2)} L${r1(x + w * 0.6)} ${r1(y - h * 0.45)} M${r1(x + w * 0.8)} ${r1(y - h * 0.2)} L${r1(x - w * 0.6)} ${r1(y - h * 0.45)} M${r1(x - w * 1.6)} ${r1(y - h * 0.75)} L${r1(x + w * 1.6)} ${r1(y - h * 0.75)} M${r1(x - w * 1.2)} ${r1(y - h * 0.9)} L${r1(x + w * 1.2)} ${r1(y - h * 0.9)}"/>`
    tops.push([x, y - h * 0.75])
  }
  let d = ''
  for (let i = 0; i + 1 < tops.length; i++) {
    const [x1, y1] = tops[i]
    const [x2, y2] = tops[i + 1]
    for (const k of [-1, 1]) d += `M${r1(x1 + k * 20)} ${r1(y1)} Q${r1((x1 + x2) / 2)} ${r1((y1 + y2) / 2 + 30)} ${r1(x2 + k * 16)} ${r1(y2)}`
  }
  return s + `<path class="cable" d="${d}"/>`
}

// The rifle on the summit, the shot and the Angel's field flaring where it strikes.
const RIFLE = `<path class="rifle" d="M300 548 L420 528 L424 536 L304 558 Z M320 556 L330 590 L340 588 L332 554 Z"/>
<circle class="muzzle" cx="424" cy="532" r="20"/>`
const IMPACT: [number, number] = [CX - 150, EQ + 20]
const SHOT = `<g class="shot"><path class="beam-g" d="M424 528 L${IMPACT[0]} ${IMPACT[1] - 14} L${IMPACT[0]} ${IMPACT[1] + 14} L424 538 Z"/><path class="beam-c" d="M424 532 L${IMPACT[0]} ${IMPACT[1]}"/></g>
${[60, 100, 140].map((r, i) => `<path class="field" d="${oct(IMPACT[0], IMPACT[1], r)}" style="transform-origin:${IMPACT[0]}px ${IMPACT[1]}px;animation-delay:${i * 0.12}s"/>`).join('')}`

function town() {
  const rand = seeded(29)
  let d = ''
  let lit = ''
  let x = 560
  while (x < 1600) {
    const w = 14 + rand() * 30
    const h = 20 + rand() * 70
    d += `M${r1(x)} ${LAKE} v${r1(-h)} h${r1(w)} v${r1(h)} z`
    if (rand() < 0.12) lit += `M${r1(x + w / 2)} ${r1(LAKE - h + 6)}h3v4h-3z`
    x += w + 1 + rand() * 6
  }
  return `<path class="town" d="${d}"/><path class="emerg" d="${lit}"/>`
}

const TPL = `
.sky-a{stop-color:{skyA}}.sky-b{stop-color:{skyB}}.lake-a{stop-color:{lakeA}}.lake-b{stop-color:{lakeB}}
.stars{fill:{star};opacity:{starOp}}.tw{animation:tw 5s ease-in-out infinite alternate}
.hill2{fill:{hill2}}.hill1{fill:{hill1}}.town{fill:{town}}.emerg{fill:{emerg};animation:tw 3s steps(1) infinite}
.core{fill:{f2}}.f1{fill:{f1}}.f2{fill:{f2}}.f3{fill:{f3}}.f4{fill:{f4}}
.edge{fill:none;stroke:{edge};stroke-width:2;opacity:.6}.rim{fill:none;stroke:{edge};stroke-width:2.5;opacity:.85}
.turn{opacity:0;animation:turn 12s linear infinite}
.halo-a{stop-color:{halo};stop-opacity:{haloOp}}.halo-b{stop-color:{halo};stop-opacity:0}
.drill{fill:{edge};animation:drill .3s steps(2) infinite}
.dig{fill:{dig};opacity:.7;animation:dig 1.8s ease-in-out infinite}
.mirror{fill:{f3};opacity:{mirrorOp}}
.ripple{fill:none;stroke:{ripple};stroke-width:2;opacity:{rippleOp};animation:ripple 6s ease-in-out infinite alternate}
.pylon{fill:none;stroke:{pylon};stroke-width:2.2}.cable{fill:none;stroke:{pylon};stroke-width:1.2}
.rifle{fill:{pylon}}.muzzle{fill:{beam};opacity:0;animation:muzzle 16s linear infinite}
.shot{opacity:0;animation:shot 16s linear infinite}.beam-g{fill:{beam};opacity:.35}.beam-c{stroke:{beamCore};stroke-width:4}
.field{fill:none;stroke:{field};stroke-width:5;opacity:0;animation:field 16s ease-out infinite}
@keyframes tw{0%{opacity:{starOp}}50%{opacity:.15}}
@keyframes turn{0%{opacity:0}6%,33%{opacity:1}39%,100%{opacity:0}}
@keyframes drill{0%{opacity:1}50%{opacity:.5}}
@keyframes dig{0%,100%{transform:scale(1,1)}50%{transform:scale(1.4,1.3)}}
@keyframes ripple{from{transform:translate(-30px,0)}to{transform:translate(30px,0)}}
@keyframes muzzle{0%,58%,72%,100%{opacity:0}60%{opacity:1}}
@keyframes shot{0%,59%,67%,100%{opacity:0}60%,64%{opacity:{shotOp}}}
@keyframes field{0%,59.5%,100%{opacity:0;transform:scale(.6)}61%{opacity:{fieldOp};transform:scale(1)}72%{opacity:0;transform:scale(1.5)}}`

const DEFS = `<linearGradient id="ysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset="1" class="sky-b"/></linearGradient>
<linearGradient id="ylake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="lake-a"/><stop offset="1" class="lake-b"/></linearGradient>
<radialGradient id="yhalo"><stop offset="0" class="halo-a"/><stop offset="1" class="halo-b"/></radialGradient>`

const BODY = `<rect width="1600" height="1000" fill="url(#ysky)"/>
{STARS}
<circle cx="${CX}" cy="${EQ}" r="420" fill="url(#yhalo)"/>
<path class="hill2" d="M0 700 C200 640 380 660 560 620 C760 580 900 650 1100 660 C1300 670 1440 620 1600 640 L1600 760 L0 760 Z"/>
${town()}
${RAMIEL}
<rect y="${LAKE}" width="1600" height="${1000 - LAKE}" fill="url(#ylake)"/>
${MIRROR}
${ripples()}
<path class="hill1" d="M0 1000 L0 560 C80 520 180 500 300 552 C380 586 470 610 560 660 C640 704 700 760 760 1000 Z"/>
${pylons()}
${RIFLE}
{SHOT}`

export function yashima(p: Record<string, string | number>, opts: { night: boolean }) {
  const body = BODY.replace('{STARS}', opts.night ? stars() : '').replace('{SHOT}', opts.night ? SHOT : '')
  return svg(fill(TPL, p), DEFS, body)
}

export const SCENE_NIGHT = yashima(
  {
    skyA: '#02030a', skyB: '#0d1a33', lakeA: '#08132a', lakeB: '#010205', star: '#cfe0ff', starOp: 0.7,
    hill2: '#070b16', hill1: '#030509', town: '#05080f', emerg: '#ff4030',
    f1: '#2a63ff', f2: '#1946d1', f3: '#0d2a8c', f4: '#0a1f6e', edge: '#a8d4ff', halo: '#3d7bff', haloOp: 0.28,
    dig: '#9fd0ff', mirrorOp: 0.35, ripple: '#7fb0ff', rippleOp: 0.25, pylon: '#010103',
    beam: '#ffd9a0', beamCore: '#ffffff', shotOp: 1, field: '#ff9a2a', fieldOp: 0.95,
  },
  { night: true },
)

export const SCENE_NOON = yashima(
  {
    skyA: '#7fc0ea', skyB: '#e6f3f8', lakeA: '#9fc9dd', lakeB: '#5e95b4', star: '#fff', starOp: 0,
    hill2: '#8aa9a6', hill1: '#4f6e63', town: '#b9c6cc', emerg: '#e0322a',
    f1: '#3d7cff', f2: '#1d4fd6', f3: '#123a9e', f4: '#0d2c7c', edge: '#e8f6ff', halo: '#ffffff', haloOp: 0.5,
    dig: '#ffffff', mirrorOp: 0.45, ripple: '#ffffff', rippleOp: 0.55, pylon: '#2c3336',
    beam: '#fff', beamCore: '#fff', shotOp: 0, field: '#ff8a1a', fieldOp: 0,
  },
  { night: false },
)
