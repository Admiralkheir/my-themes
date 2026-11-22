// The Geofront. The great hollow under Tokyo-3: the city's towers hang upside down from its roof, light is piped
// down in shafts onto a forest and a lake, and in the middle stands NERV's black pyramid. In the dark window the
// alert is on and red lamps pulse along its edges; in the light one the shafts pour daylight onto the trees.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg } from '../eva.js'

const PX = 820
const PB = 700
const PT = 360
const PW = 270

// The roof: a shallow dome with the towers of the city above hanging down from it.
function roof() {
  const rand = seeded(17)
  const ceil = (x: number) => 150 - Math.sin((x / 1600) * Math.PI) * 110
  let d = `M-20 -20 L1620 -20 L1620 ${r1(ceil(1620))}`
  for (let x = 1620; x >= -20; x -= 40) d += ` L${x} ${r1(ceil(x))}`
  d += ' Z'
  let towers = ''
  let lit = ''
  let x = -10
  while (x < 1610) {
    const w = 22 + rand() * 46
    const top = ceil(x + w / 2) - 6
    const h = 40 + rand() * 170 * Math.sin(((x + w / 2) / 1600) * Math.PI)
    towers += `M${r1(x)} ${r1(top)} L${r1(x)} ${r1(top + h)} L${r1(x + w * 0.2)} ${r1(top + h + 10)} L${r1(x + w * 0.8)} ${r1(top + h + 10)} L${r1(x + w)} ${r1(top + h)} L${r1(x + w)} ${r1(top)} Z`
    for (let wy = top + 8; wy < top + h - 4; wy += 10) if (rand() < 0.3) lit += `M${r1(x + 4)} ${r1(wy)}h${r1(w - 8)}v2h${r1(-(w - 8))}z`
    x += w + 4 + rand() * 20
  }
  return `<path class="roof" d="${d}"/><path class="hang" d="${towers}"/><path class="hang-lit" d="${lit}"/>`
}

// Shafts of light piped down through the roof.
function shafts() {
  const at: [number, number, number, number][] = [[260, 120, 220, 0], [560, 60, 160, 3], [1120, 56, 200, 6], [1400, 110, 240, 1.5], [880, 44, 120, 4.5]]
  return at
    .map(
      ([x, top, w, delay]) =>
        `<path class="shaft" d="M${x - 14} ${top} L${x + 14} ${top} L${x + w / 2} 760 L${x - w / 2} 760 Z" fill="url(#gshaft)" style="animation-delay:-${delay}s"/>`,
    )
    .join('')
}

function motes() {
  const rand = seeded(23)
  let s = ''
  for (let i = 0; i < 40; i++) {
    const x = rand() * 1600
    const y = 200 + rand() * 500
    s += `<circle class="mote" cx="${r1(x)}" cy="${r1(y)}" r="${r1(1 + rand() * 1.8)}" style="animation-duration:${r1(14 + rand() * 14)}s;animation-delay:-${r1(rand() * 20)}s"/>`
  }
  return s
}

// Forest: rows of rounded crowns, darker toward the front.
function forest(seed: number, y: number, size: number, cls: string, from = -40, to = 1640) {
  const rand = seeded(seed)
  let d = ''
  for (let x = from; x < to; x += size * (0.7 + rand() * 0.5)) {
    const r = size * (0.6 + rand() * 0.5)
    const cy = y - rand() * size * 0.4
    d += `M${r1(x - r)} ${r1(cy)} a${r1(r)} ${r1(r)} 0 0 1 ${r1(r * 2)} 0 Z`
  }
  return `<path class="${cls}" d="${d}"/><rect class="${cls}" x="${from}" y="${y - 1}" width="${to - from}" height="${1000 - y}"/>`
}

const PYRAMID = `<path class="pyr" d="M${PX - PW} ${PB} L${PX} ${PT} L${PX + PW} ${PB} Z"/>
<path class="pyr-sh" d="M${PX} ${PT} L${PX + PW} ${PB} L${PX + 40} ${PB} Z"/>
<path class="pyr-band" d="M${r1(PX - PW * 0.62)} ${r1(PB - (PB - PT) * 0.38)} L${r1(PX + PW * 0.62)} ${r1(PB - (PB - PT) * 0.38)} L${r1(PX + PW * 0.66)} ${r1(PB - (PB - PT) * 0.34)} L${r1(PX - PW * 0.66)} ${r1(PB - (PB - PT) * 0.34)} Z"/>
<path class="pyr-line" d="M${PX - PW} ${PB} L${PX} ${PT} L${PX + PW} ${PB}"/>
${[0.18, 0.36, 0.54, 0.72, 0.9]
  .map((t, i) => {
    const y = r1(PT + (PB - PT) * t)
    const dx = PW * t
    return `<circle class="alert" cx="${r1(PX - dx)}" cy="${y}" r="4" style="animation-delay:-${i * 0.3}s"/><circle class="alert" cx="${r1(PX + dx)}" cy="${y}" r="4" style="animation-delay:-${i * 0.3 + 0.15}s"/>`
  })
  .join('')}
<path class="annex" d="M${PX + 300} ${PB} L${PX + 300} ${PB - 60} L${PX + 380} ${PB - 80} L${PX + 380} ${PB} Z M${PX - 380} ${PB} L${PX - 380} ${PB - 40} L${PX - 320} ${PB - 52} L${PX - 320} ${PB} Z"/>`

const LAKE = `<path class="lake" d="M-40 760 C100 730 300 720 480 742 C560 752 580 790 520 820 C420 870 160 880 -40 870 Z"/>
<g class="glint"><path class="glint-l" d="M60 770 h120 M220 790 h90 M40 812 h160 M260 828 h120 M100 850 h90"/></g>`

const TPL = `
.cave-a{stop-color:{caveA}}.cave-b{stop-color:{caveB}}
.roof{fill:{roof}}.hang{fill:{hang}}.hang-lit{fill:{lit};opacity:{litOp};animation:hum 6s ease-in-out infinite}
.sh-a{stop-color:{shaft};stop-opacity:{shaftOp}}.sh-b{stop-color:{shaft};stop-opacity:0}
.shaft{animation:shaft 9s ease-in-out infinite}
.mote{fill:{shaft};opacity:.6;animation:mote 20s linear infinite}
.wall{fill:{wall}}
.f3{fill:{f3}}.f2{fill:{f2}}.f1{fill:{f1}}
.pyr{fill:{pyr}}.pyr-sh{fill:{pyrSh}}.pyr-band{fill:{band};opacity:{bandOp}}.pyr-line{fill:none;stroke:{pyrLine};stroke-width:2;opacity:.7}
.annex{fill:{pyrSh}}
.alert{fill:{alert};opacity:{alertOp};animation:alert 1.4s ease-in-out infinite}
.wash{fill:{alert};opacity:0;animation:wash 4s ease-in-out infinite}
.lake{fill:{lake}}.glint-l{fill:none;stroke:{shaft};stroke-width:2;opacity:{glintOp}}.glint{animation:glint 7s ease-in-out infinite alternate}
@keyframes hum{0%,100%{opacity:{litOp}}50%{opacity:{litOp2}}}
@keyframes shaft{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes mote{from{transform:translate(0,0)}to{transform:translate(60px,-140px)}}
@keyframes alert{0%,100%{opacity:{alertOp}}50%{opacity:.1}}
@keyframes wash{0%,100%{opacity:0}50%{opacity:{washOp}}}
@keyframes glint{from{transform:translate(-14px,0)}to{transform:translate(14px,0)}}`

const DEFS = `<linearGradient id="gcave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="cave-a"/><stop offset="1" class="cave-b"/></linearGradient>
<linearGradient id="gshaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sh-a"/><stop offset="1" class="sh-b"/></linearGradient>`

const BODY = `<rect width="1600" height="1000" fill="url(#gcave)"/>
<path class="wall" d="M-20 300 C200 420 300 560 380 700 L-20 700 Z M1620 300 C1400 420 1300 560 1220 700 L1620 700 Z"/>
${shafts()}
${roof()}
${forest(3, 700, 26, 'f3')}
${PYRAMID}
${forest(5, 760, 36, 'f2')}
${LAKE}
${forest(9, 880, 60, 'f1', 560, 1640)}
${motes()}
<rect class="wash" width="1600" height="1000"/>`

export function geofront(p: Record<string, string | number>) {
  return svg(fill(TPL, p), DEFS, BODY)
}

export const SCENE_ALERT = geofront({
  caveA: '#07090c', caveB: '#141a1c', roof: '#0b0e12', hang: '#151a21', lit: '#ffb66a', litOp: 0.5, litOp2: 0.25,
  shaft: '#ffd7a0', shaftOp: 0.16, wall: '#0d1214', f3: '#14211c', f2: '#0e1914', f1: '#08100c',
  pyr: '#050506', pyrSh: '#0c0d10', band: '#ff3a2a', bandOp: 0.35, pyrLine: '#3a3f46',
  alert: '#ff2a1e', alertOp: 0.95, washOp: 0.07, lake: '#0e1b26', glintOp: 0.3,
})

export const SCENE_DAY = geofront({
  caveA: '#9aa3a8', caveB: '#e6e3d6', roof: '#7e878d', hang: '#a9b2b8', lit: '#ffffff', litOp: 0.55, litOp2: 0.35,
  shaft: '#fffbea', shaftOp: 0.75, wall: '#b6b9b0', f3: '#8fae84', f2: '#6e9461', f1: '#4f7446',
  pyr: '#16181d', pyrSh: '#2b2f37', band: '#c9a35a', bandOp: 0.6, pyrLine: '#5a6170',
  alert: '#e0322a', alertOp: 0, washOp: 0, lake: '#7fb2cf', glintOp: 0.8,
})
