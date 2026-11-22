// Innsmouth — Devil Reef. A crooked harbor town of gambrel roofs on a hill, the Order of Dagon's hall among them,
// a lighthouse whose beam sweeps the bay, and out on the reef, figures that rise from the water and sink again.
// After The Shadow over Innsmouth, Dredge's dark pastels and Bloodborne's Fishing Hamlet.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
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

const HORIZON = 640

// ---- The town on its hill ------------------------------------------------------------------------------------------
const hill = (x: number) => 560 + (x / 700) * 150 // ground rises to the left

function house(rand: () => number, x: number, w: number, base: number, cls: string, winCls: string, wins: string[]) {
  const h = 46 + rand() * 50
  const top = base - h
  const roofH = 30 + rand() * 26
  const gambrel = rand() < 0.65
  const lean = r1((rand() - 0.5) * 7)
  let roof: string
  if (gambrel) {
    const k = w * 0.22
    roof = `M${x - 4} ${r1(top)} L${r1(x + k * 0.4)} ${r1(top - roofH * 0.6)} L${r1(x + w / 2)} ${r1(top - roofH)} L${r1(x + w - k * 0.4)} ${r1(top - roofH * 0.6)} L${x + w + 4} ${r1(top)} Z`
  } else {
    roof = `M${x - 5} ${r1(top)} L${r1(x + w / 2)} ${r1(top - roofH)} L${x + w + 5} ${r1(top)} Z`
  }
  let s = `<path d="M${x} ${base + 40} L${x} ${r1(top)} L${x + w} ${r1(top)} L${x + w} ${base + 40} Z ${roof}"/>`
  if (rand() < 0.7) {
    const cx = r1(x + w * (0.2 + rand() * 0.6))
    s += `<rect x="${cx}" y="${r1(top - roofH * 0.9)}" width="9" height="${r1(roofH * 0.6)}"/>`
  }
  // windows
  const rows = h > 70 ? 2 : 1
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < Math.floor(w / 26); c++) {
      if (rand() < 0.45) {
        const wx = r1(x + 8 + c * 26)
        const wy = r1(top + 12 + r * 30)
        const lit = rand() < 0.5
        wins.push(
          lit
            ? `<rect class="${winCls}" x="${wx}" y="${wy}" width="8" height="12" style="animation-duration:${r1(7 + rand() * 9)}s;animation-delay:-${r1(rand() * 12)}s"/>`
            : `<rect class="dark-win" x="${wx}" y="${wy}" width="8" height="12"/>`,
        )
      }
    }
  }
  return `<g class="${cls}" transform="skewX(${lean})" style="transform-origin:${Math.max(x, 0)}px ${base}px">${s}</g>`
}

function town() {
  const rand = seeded(91)
  const back: string[] = []
  const front: string[] = []
  const wins: string[] = []
  let x = -20
  while (x < 640) {
    const w = 46 + rand() * 46
    back.push(house(rand, Math.round(x), Math.round(w), Math.round(hill(x) - 70), 'town2', 'win', wins))
    x += w + 4 + rand() * 18
  }
  x = -10
  while (x < 700) {
    const w = 54 + rand() * 50
    if (x > 250 && x < 330) {
      x = 360 // leave room for the hall
      continue
    }
    front.push(house(rand, Math.round(x), Math.round(w), Math.round(hill(x)), 'town', 'win', wins))
    x += w + 6 + rand() * 24
  }
  // The Esoteric Order of Dagon: a columned hall with a leaning steeple.
  const hb = Math.round(hill(290))
  const hall = `<g class="town"><path d="M248 ${hb + 40} L248 ${hb - 80} L352 ${hb - 80} L352 ${hb + 40} Z M240 ${hb - 80} L300 ${hb - 118} L360 ${hb - 80} Z"/>
<g transform="skewX(-4)" style="transform-origin:300px ${hb - 110}px"><rect x="284" y="${hb - 200}" width="32" height="96"/><path d="M280 ${hb - 200} L300 ${hb - 290} L320 ${hb - 200} Z"/></g></g>
<rect class="col" x="258" y="${hb - 70}" width="6" height="70"/><rect class="col" x="278" y="${hb - 70}" width="6" height="70"/><rect class="col" x="316" y="${hb - 70}" width="6" height="70"/><rect class="col" x="336" y="${hb - 70}" width="6" height="70"/>
<rect class="win" x="294" y="${hb - 176}" width="12" height="20" style="animation-duration:11s;animation-delay:-4s"/>`
  const ground = `<path class="town" d="M0 ${hill(0) + 10} L700 ${hill(700) + 10} L770 772 L600 800 L300 814 L0 822 Z"/>`
  return `${back.join('')}${front.join('')}${hall}${ground}${wins.join('')}`
}

// ---- Sea, reef, lighthouse -----------------------------------------------------------------------------------------
const LX = 1215
const LY = 470

function waves() {
  const rand = seeded(7)
  const rows: string[] = []
  for (let i = 0; i < 26; i++) {
    const y = HORIZON + 8 + Math.pow(i / 26, 1.6) * 340
    const len = 20 + (y - HORIZON) * 0.35
    let d = ''
    for (let j = 0; j < 9; j++) {
      const x = rand() * 1600
      d += `M${r1(x)} ${r1(y + rand() * 6)} h${r1(len * (0.5 + rand()))}`
    }
    rows.push(`<path class="wave" d="${d}" style="animation-duration:${r1(6 + rand() * 6)}s;animation-delay:-${r1(rand() * 6)}s"/>`)
  }
  return rows.join('')
}

function glint() {
  const rand = seeded(13)
  let s = ''
  for (let i = 0; i < 30; i++) {
    const y = HORIZON + 6 + i * 11
    const w = 10 + i * 3 + rand() * 20
    s += `<rect class="glint" x="${r1(990 - w / 2 + (rand() - 0.5) * 30)}" y="${y}" width="${r1(w)}" height="2" style="animation-duration:${r1(2 + rand() * 3)}s;animation-delay:-${r1(rand() * 3)}s"/>`
  }
  return s
}

const REEF = `<path class="reef" d="M1290 ${HORIZON + 2} L1300 ${HORIZON - 6} L1322 ${HORIZON - 9} L1336 ${HORIZON - 4} L1360 ${HORIZON - 12} L1388 ${HORIZON - 7} L1420 ${HORIZON - 10} L1450 ${HORIZON - 3} L1488 ${HORIZON - 8} L1520 ${HORIZON - 2} L1540 ${HORIZON + 4} Z"/>`

// The deep ones: hunched head-and-shoulders that rise above the reef and sink back.
function deepOnes() {
  const at: [number, number, number][] = [[1318, 31, 0], [1352, 27, 9], [1404, 35, 17], [1466, 29, 5], [1500, 33, 23]]
  return at
    .map(([x, dur, delay]) => {
      const y = HORIZON - 4
      const d = `M${x - 9} ${y + 2} C${x - 9} ${y - 8} ${x - 6} ${y - 11} ${x - 3} ${y - 12} C${x - 5} ${y - 18} ${x - 2} ${y - 22} ${x + 1} ${y - 22} C${x + 5} ${y - 22} ${x + 6} ${y - 17} ${x + 4} ${y - 12} C${x + 8} ${y - 11} ${x + 10} ${y - 8} ${x + 10} ${y + 2} Z`
      return `<path class="deep" d="${d}" style="animation-duration:${dur}s;animation-delay:-${delay}s"/><circle class="deep-eye" cx="${x + 2}" cy="${y - 18}" r="1.2" style="animation-duration:${dur}s;animation-delay:-${delay}s"/>`
    })
    .join('')
}

const LIGHTHOUSE = `<path class="rock" d="M1120 ${HORIZON + 40} C1140 ${HORIZON + 6} 1180 ${HORIZON - 2} 1215 ${HORIZON} C1250 ${HORIZON - 4} 1300 ${HORIZON + 10} 1330 ${HORIZON + 44} Z"/>
<path class="lh" d="M${LX - 20} ${HORIZON + 4} L${LX - 13} ${LY + 18} L${LX + 13} ${LY + 18} L${LX + 20} ${HORIZON + 4} Z"/>
<path class="lh-band" d="M${LX - 18.4} ${HORIZON - 30} L${LX - 17.3} ${HORIZON - 54} L${LX + 17.3} ${HORIZON - 54} L${LX + 18.4} ${HORIZON - 30} Z M${LX - 15.8} ${HORIZON - 96} L${LX - 14.8} ${HORIZON - 118} L${LX + 14.8} ${HORIZON - 118} L${LX + 15.8} ${HORIZON - 96} Z"/>
<rect class="lh" x="${LX - 18}" y="${LY + 14}" width="36" height="5"/>
<rect class="lamp" x="${LX - 10}" y="${LY - 6}" width="20" height="20"/>
<path class="lh" d="M${LX - 13} ${LY - 6} L${LX} ${LY - 20} L${LX + 13} ${LY - 6} Z"/><rect class="lh" x="${LX - 1}" y="${LY - 28}" width="2" height="9"/>`

// A beam that turns: scaled through zero in x, so it seems to swing toward the viewer and away.
const BEAM = `<g class="beam" style="transform-origin:${LX}px ${LY + 4}px"><polygon points="${LX},${LY} ${LX - 900},${LY - 60} ${LX - 900},${LY + 90} ${LX},${LY + 8}" fill="url(#beam)"/></g>
<circle class="flash" cx="${LX}" cy="${LY + 4}" r="60" fill="url(#flash)" style="transform-origin:${LX}px ${LY + 4}px"/>`

// ---- Pier, dory, lantern -------------------------------------------------------------------------------------------
const PIER = (() => {
  let s = `<rect class="pier" x="0" y="842" width="560" height="14"/><rect class="pier" x="0" y="856" width="560" height="5" opacity=".7"/>`
  for (let x = 14; x < 560; x += 62) s += `<rect class="pier" x="${x}" y="850" width="12" height="160"/>`
  s += `<rect class="pier" x="520" y="790" width="10" height="60"/><rect class="pier" x="480" y="796" width="56" height="5"/>`
  // the lantern hangs from the arm and sways
  s += `<g class="sway" style="transform-origin:490px 801px;animation-duration:4.4s"><rect class="pier" x="489" y="801" width="2" height="16"/><rect class="pier" x="483" y="816" width="14" height="4"/><rect class="lantern" x="485" y="820" width="10" height="13"/><circle class="lantern-glow" cx="490" cy="826" r="34" fill="url(#lgl)"/></g>`
  return s
})()

const DORY = `<g class="bob" style="transform-origin:690px 905px;animation-duration:6s"><path class="pier" d="M630 896 L750 896 C742 914 726 920 690 920 C656 920 640 914 630 896 Z"/><path class="pier" d="M690 896 L690 850" stroke-width="3"/><path class="rope" d="M630 898 C600 910 570 890 545 856"/></g>`

const TENTACLES: TentacleSpec[] = [
  { x: 1480, y: 1070, flip: true, length: 560, width: 110, joints: 10, period: 6.4, baseDeg: 2, tipDeg: 10, lag: 0.6, delay: 0 },
  { x: 1300, y: 1080, flip: false, length: 300, width: 56, joints: 8, period: 5, baseDeg: 2.5, tipDeg: 13, lag: 0.5, delay: 2.4 },
  { x: 860, y: 1085, flip: true, length: 220, width: 42, joints: 7, period: 4.6, baseDeg: 3, tipDeg: 14, lag: 0.45, delay: 1.1 },
]
const { markup: TENT, style: SWING } = tentacles(TENTACLES)

function clouds() {
  const rand = seeded(29)
  let s = ''
  for (let i = 0; i < 9; i++) {
    const y = 60 + rand() * 380
    const x = rand() * 1600
    const w = 220 + rand() * 360
    s += `<g class="cloud" style="animation-duration:${r1(70 + rand() * 60)}s;animation-delay:-${r1(rand() * 80)}s"><ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(w / 2)}" ry="${r1(14 + rand() * 18)}"/><ellipse cx="${r1(x + w * 0.15)}" cy="${r1(y - 10)}" rx="${r1(w / 3)}" ry="${r1(12 + rand() * 12)}"/></g>`
  }
  return s
}

function fog() {
  const rand = seeded(43)
  let s = ''
  for (let i = 0; i < 7; i++) {
    const y = HORIZON - 40 + i * 50 + rand() * 30
    s += `<ellipse class="fog" fill="url(#fogg)" cx="${r1(rand() * 1600)}" cy="${r1(y)}" rx="${r1(420 + rand() * 360)}" ry="${r1(22 + rand() * 26)}" style="animation-duration:${r1(40 + rand() * 30)}s;animation-delay:-${r1(rand() * 40)}s"/>`
  }
  return s
}

const TPL = `
.sky-a{stop-color:{skyA}}.sky-b{stop-color:{skyB}}.sky-c{stop-color:{skyC}}
.sea-a{stop-color:{seaA}}.sea-b{stop-color:{seaB}}
.halo-a{stop-color:{moon};stop-opacity:{haloOp}}.halo-b{stop-color:{moon};stop-opacity:0}
.beam-a{stop-color:{beam};stop-opacity:{beamOp}}.beam-b{stop-color:{beam};stop-opacity:0}
.lgl-a{stop-color:{win};stop-opacity:{lglOp}}.lgl-b{stop-color:{win};stop-opacity:0}
.tent-a{stop-color:{tentA}}.tent-b{stop-color:{tentB}}
.moon{fill:{moon}}
.cloud{fill:{cloud};opacity:{cloudOp};animation:drift 90s ease-in-out infinite alternate}
.town2{fill:{town2}}.town{fill:{town}}.col{fill:{col}}
.win{fill:{win};opacity:0;animation:flicker 9s ease-in-out infinite}.dark-win{fill:{darkWin}}
.wave{stroke:{wave};stroke-width:1.4;fill:none;opacity:{waveOp};animation:lap 8s ease-in-out infinite alternate}
.glint{fill:{moon};opacity:0;animation:glint 3s ease-in-out infinite}
.reef{fill:{reef}}.rock{fill:{rock}}
.deep{fill:{reef};animation:surface 30s ease-in-out infinite}
.deep-eye{fill:{eye};opacity:0;animation:deepeye 30s ease-in-out infinite}
.lh{fill:{lh}}.lh-band{fill:{band}}.lamp{fill:{beam};opacity:{lampOp}}
.beam{animation:sweep 12s linear infinite}
.flash{opacity:0;animation:flash 12s linear infinite}
.fog-a{stop-color:{fog};stop-opacity:{fogOp}}.fog-b{stop-color:{fog};stop-opacity:0}.fog{animation:drift 50s ease-in-out infinite alternate}
.pier{fill:{pier};stroke:{pier}}.rope{fill:none;stroke:{pier};stroke-width:1.5}
.lantern{fill:{win};opacity:{lanternOp}}
.sway{animation:sway 4s ease-in-out infinite alternate}
.bob{animation:bob 6s ease-in-out infinite alternate}
.sk{fill:{sk};opacity:.5}
{SWING}
@keyframes drift{from{transform:translate(-90px,0)}to{transform:translate(90px,0)}}
@keyframes lap{from{transform:translate(-14px,0)}to{transform:translate(14px,2px)}}
@keyframes flicker{0%,35%,100%{opacity:{winLo}}50%{opacity:{winHi}}58%{opacity:{winMid}}66%{opacity:{winHi}}}
@keyframes glint{0%,100%{opacity:0}50%{opacity:{glintOp}}}
@keyframes surface{0%,30%,100%{transform:translate(0,22px)}42%,62%{transform:translate(0,0)}74%{transform:translate(0,22px)}}
@keyframes deepeye{0%,44%,60%,100%{opacity:0}48%,56%{opacity:.9}}
@keyframes sweep{0%{transform:scale(1,1);opacity:.9}25%{transform:scale(.02,1);opacity:1}50%{transform:scale(-1,1);opacity:.5}75%{transform:scale(-.02,1);opacity:0}100%{transform:scale(1,1);opacity:.9}}
@keyframes flash{0%,18%,32%,100%{opacity:0;transform:scale(.6)}25%{opacity:{flashOp};transform:scale(1.4)}}
@keyframes sway{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
@keyframes bob{from{transform:translate(0,-3px) rotate(-2deg)}to{transform:translate(0,3px) rotate(2deg)}}`

const DEFS = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".6" class="sky-b"/><stop offset="1" class="sky-c"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sea-a"/><stop offset="1" class="sea-b"/></linearGradient>
<radialGradient id="halo"><stop offset="0" class="halo-a"/><stop offset="1" class="halo-b"/></radialGradient>
<linearGradient id="beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" class="beam-a"/><stop offset="1" class="beam-b"/></linearGradient>
<radialGradient id="flash"><stop offset="0" class="beam-a"/><stop offset="1" class="beam-b"/></radialGradient>
<radialGradient id="fogg"><stop offset="0" class="fog-a"/><stop offset=".6" class="fog-a"/><stop offset="1" class="fog-b"/></radialGradient>
<radialGradient id="lgl"><stop offset="0" class="lgl-a"/><stop offset="1" class="lgl-b"/></radialGradient>
<linearGradient id="tent" gradientUnits="userSpaceOnUse" x1="0" y1="500" x2="0" y2="1080"><stop offset="0" class="tent-a"/><stop offset="1" class="tent-b"/></linearGradient>`

const BODY = `<rect width="1600" height="1000" fill="url(#sky)"/>
<circle cx="990" cy="210" r="240" fill="url(#halo)"/><circle class="moon" cx="990" cy="210" r="44"/>
${clouds()}
<rect y="${HORIZON}" width="1600" height="${1000 - HORIZON}" fill="url(#sea)"/>
${glint()}${waves()}
${deepOnes()}${REEF}
${BEAM}${LIGHTHOUSE}
${fog()}
${town()}
<g fill="url(#tent)">${TENT}</g>
${DORY}${PIER}`

export function innsmouth(p: Record<string, string | number>) {
  return svg(fill(TPL.replace('{SWING}', SWING), p), DEFS, BODY)
}

export const SCENE_NIGHT = innsmouth({
  skyA: '#0b1418', skyB: '#14262a', skyC: '#1d3533', seaA: '#122624', seaB: '#050c0c',
  moon: '#d8e6c4', haloOp: 0.22, beam: '#f3e7a6', beamOp: 0.34, lglOp: 0.5, win: '#d9c45a',
  tentA: '#1d3a34', tentB: '#071311', cloud: '#2a3c3c', cloudOp: 0.55,
  town2: '#0d1a1b', town: '#060d0e', col: '#0b1617', darkWin: '#0a1415',
  wave: '#5c8a80', waveOp: 0.35, reef: '#03090a', rock: '#040a0b', eye: '#b6f26a',
  lh: '#0a1213', band: '#14201f', lampOp: 0.9, fog: '#5f7f78', fogOp: 0.12, pier: '#030707', lanternOp: 0.95,
  sk: '#2f5c52', winLo: 0.25, winHi: 0.9, winMid: 0.4, glintOp: 0.5, flashOp: 0.9,
})

export const SCENE_FOG = innsmouth({
  skyA: '#b9c0b5', skyB: '#cfd3c6', skyC: '#dcdccd', seaA: '#a9b1a6', seaB: '#8b968e',
  moon: '#f4f1e2', haloOp: 0.55, beam: '#fff6cf', beamOp: 0.28, lglOp: 0.25, win: '#c49a3a',
  tentA: '#7d8b84', tentB: '#5d6a65', cloud: '#e7e7da', cloudOp: 0.6,
  town2: '#9aa49c', town: '#6f7a74', col: '#8a948d', darkWin: '#58625d',
  wave: '#eef0e4', waveOp: 0.5, reef: '#6b746f', rock: '#6a746f', eye: '#c7a43a',
  lh: '#646e69', band: '#9a5a4a', lampOp: 0.6, fog: '#eceee2', fogOp: 0.6, pier: '#4f5853', lanternOp: 0.7,
  sk: '#a5b1aa', winLo: 0.1, winHi: 0.55, winMid: 0.2, glintOp: 0.55, flashOp: 0.6,
})
