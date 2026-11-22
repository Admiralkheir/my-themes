// After the End. The beach after Third Impact: a sea of LCL gone red, white sand, a moon with a smear of blood
// across it, and on the horizon the broken white head of the giant, half sunk, one eye open. Night for dark
// windows; a bleached, rose-white day for light ones, the sea still red.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg } from '../eva.js'

const HZ = 600
const MX = 360
const MY = 230
const MR = 96

// The blood across the moon: a ragged streak corner to corner, kept inside the disc, with drops below it.
const SMEAR = (() => {
  const n = 14
  const ang = (-32 * Math.PI) / 180
  const ux = Math.cos(ang)
  const uy = Math.sin(ang)
  const top: string[] = []
  const bot: string[] = []
  for (let i = 0; i <= n; i++) {
    const t = -0.86 + (1.72 * i) / n
    const cx = MX + t * MR * ux
    const cy = MY + t * MR * uy
    const room = Math.sqrt(1 - t * t) * MR * 0.92
    const w = Math.min(room, 10 + 14 * Math.sin(i * 1.3) ** 2 + 8 * (1 - Math.abs(t)))
    top.push(`${r1(cx + uy * w)} ${r1(cy - ux * w)}`)
    bot.unshift(`${r1(cx - uy * w * 0.8)} ${r1(cy + ux * w * 0.8)}`)
  }
  return 'M' + top.join(' L') + ' L' + bot.join(' L') + ' Z'
})()
const DROPS = [[-20, 30, 5], [10, 22, 3.5], [36, 6, 4], [-46, 46, 3]]
  .map(([dx, dy, r]) => `<circle class="smear" cx="${MX + dx}" cy="${MY + dy}" r="${r}"/>`)
  .join('')

// The head: a half dome of white, its split edge dark, one eye.
const HEAD = `<path class="head" d="M1020 ${HZ + 4} C1010 470 1090 300 1290 262 C1400 244 1490 268 1560 310 L1560 ${HZ + 4} Z"/>
<path class="head-sh" d="M1020 ${HZ + 4} C1012 490 1066 360 1160 300 C1110 390 1094 500 1104 ${HZ + 4} Z"/>
<path class="hollow" d="M1560 310 L1540 360 L1556 410 L1534 470 L1552 520 L1536 ${HZ + 4} L1600 ${HZ + 4} L1600 300 Z"/>
<path class="crack" d="M1290 262 L1300 300 L1286 336 M1430 262 L1420 296 L1432 318"/>
<path class="socket" d="M1250 452 C1290 404 1410 400 1470 440 C1430 486 1300 494 1250 452 Z"/>
<path class="eye" d="M1266 452 C1300 418 1400 414 1456 442 C1420 474 1310 482 1266 452 Z"/>
<circle class="iris" cx="1352" cy="448" r="23" style="transform-origin:1352px 448px"/>
<path class="lid" d="M1258 450 C1300 410 1410 406 1462 440"/>`

// Far off, crosses standing in the shallows.
const CROSSES = [[860, 1], [930, 0.7], [700, 0.55], [1000, 0.45]]
  .map(([x, k]) => `<path class="cross" d="M${x - 3 * k} ${HZ + 10} L${x - 3 * k} ${r1(HZ - 70 * k)} L${r1(x - 24 * k)} ${r1(HZ - 70 * k)} L${r1(x - 24 * k)} ${r1(HZ - 78 * k)} L${x - 3 * k} ${r1(HZ - 78 * k)} L${x - 3 * k} ${r1(HZ - 96 * k)} L${x + 3 * k} ${r1(HZ - 96 * k)} L${x + 3 * k} ${r1(HZ - 78 * k)} L${r1(x + 24 * k)} ${r1(HZ - 78 * k)} L${r1(x + 24 * k)} ${r1(HZ - 70 * k)} L${x + 3 * k} ${r1(HZ - 70 * k)} L${x + 3 * k} ${HZ + 10} Z"/>`)
  .join('')

function swell() {
  const rand = seeded(31)
  let s = ''
  for (let i = 0; i < 16; i++) {
    const y = HZ + 8 + Math.pow(i / 16, 1.6) * 220
    const len = 70 + i * 16
    let d = `M-100 ${r1(y)}`
    for (let x = -100; x < 1720; x += len) d += ` q${r1(len / 4)} ${r1(-(2 + i))} ${r1(len / 2)} 0 t${r1(len / 2)} 0`
    s += `<path class="swell" d="${d}" stroke-dasharray="${Math.round(80 + rand() * 200)} ${Math.round(40 + rand() * 120)}" style="animation-duration:${r1(6 + rand() * 5)}s;animation-delay:-${r1(rand() * 6)}s;stroke-width:${r1(1 + i * 0.15)}"/>`
  }
  return s
}

// Waves that run up the sand and slide back.
function surf() {
  const shore = (dy: number) => `M-40 ${830 + dy} C200 ${812 + dy} 420 ${846 + dy} 700 ${828 + dy} C980 ${810 + dy} 1240 ${842 + dy} 1640 ${822 + dy}`
  return [0, 2.6, 5.2]
    .map(
      delay =>
        `<g class="surf" style="animation-delay:-${delay}s"><path class="wash" d="${shore(0)} L1640 800 L-40 800 Z"/><path class="foam" d="${shore(0)}"/></g>`,
    )
    .join('')
}

function stars() {
  const rand = seeded(43)
  let d = ''
  for (let i = 0; i < 110; i++) d += `M${r1(rand() * 1600)} ${r1(rand() * 520)}h1.5v1.5h-1.5z`
  return `<path class="stars" d="${d}"/>`
}

const TPL = `
.sky-a{stop-color:{skyA}}.sky-b{stop-color:{skyB}}.sky-c{stop-color:{skyC}}
.sea-a{stop-color:{seaA}}.sea-b{stop-color:{seaB}}.sand-a{stop-color:{sandA}}.sand-b{stop-color:{sandB}}
.stars{fill:{star};opacity:{starOp};animation:tw 6s ease-in-out infinite alternate}
.moon{fill:{moon}}.smear{fill:{blood};opacity:.85}.moon-g-a{stop-color:{moon};stop-opacity:{moonGlow}}.moon-g-b{stop-color:{moon};stop-opacity:0}
.head{fill:{head}}.head-sh{fill:{headSh}}.crack{fill:none;stroke:{crack};stroke-width:3}
.socket{fill:{headSh}}.eye{fill:{eye}}.iris{fill:{blood};animation:look 18s ease-in-out infinite}.lid{fill:none;stroke:{crack};stroke-width:3;opacity:.6}.hollow{fill:{crack}}
.cross{fill:{cross}}
.swell{fill:none;stroke:{swell};opacity:{swellOp};animation:swell 8s ease-in-out infinite alternate}
.surf{animation:surf 7.8s ease-in-out infinite}.wash{fill:{seaA};opacity:.5}.foam{fill:none;stroke:{foam};stroke-width:3;opacity:.8}
.mist{fill:{mist};opacity:{mistOp};animation:mist 40s ease-in-out infinite alternate}
@keyframes tw{from{opacity:{starOp}}to{opacity:.2}}
@keyframes look{0%,40%,100%{transform:translate(0,0)}50%,70%{transform:translate(14px,1px)}80%{transform:translate(-6px,0)}}
@keyframes swell{from{transform:translate(-30px,0)}to{transform:translate(30px,2px)}}
@keyframes surf{0%{transform:translate(0,-26px);opacity:0}30%{opacity:1}55%{transform:translate(0,22px);opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
@keyframes mist{from{transform:translate(-80px,0)}to{transform:translate(80px,0)}}`

const DEFS = `<linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".75" class="sky-b"/><stop offset="1" class="sky-c"/></linearGradient>
<linearGradient id="rsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sea-a"/><stop offset="1" class="sea-b"/></linearGradient>
<linearGradient id="rsand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sand-a"/><stop offset="1" class="sand-b"/></linearGradient>
<radialGradient id="rmoon"><stop offset="0" class="moon-g-a"/><stop offset="1" class="moon-g-b"/></radialGradient>`

const BODY = `<rect width="1600" height="1000" fill="url(#rsky)"/>
${stars()}
<circle cx="${MX}" cy="${MY}" r="300" fill="url(#rmoon)"/>
<circle class="moon" cx="${MX}" cy="${MY}" r="${MR}"/>
<path class="smear" d="${SMEAR}"/>${DROPS}
<ellipse class="mist" cx="800" cy="${HZ - 20}" rx="900" ry="40"/>
${HEAD}
<rect y="${HZ}" width="1600" height="${1000 - HZ}" fill="url(#rsea)"/>
${CROSSES}
${swell()}
<path d="M-40 1000 L-40 830 C200 812 420 846 700 828 C980 810 1240 842 1640 822 L1640 1000 Z" fill="url(#rsand)"/>
${surf()}`

export function redsea(p: Record<string, string | number>) {
  return svg(fill(TPL, p), DEFS, BODY)
}

export const SCENE_NIGHT = redsea({
  skyA: '#05030a', skyB: '#2a0c16', skyC: '#5a1420', seaA: '#7a0d16', seaB: '#2a0408', sandA: '#cfc8c4', sandB: '#8d8580',
  star: '#f3e6e6', starOp: 0.6, moon: '#ece6dc', moonGlow: 0.18, blood: '#b3121e',
  head: '#d9d4cf', headSh: '#9c948f', crack: '#2a1418', eye: '#f2efe9', cross: '#1a0a0e',
  swell: '#ff5a5a', swellOp: 0.22, foam: '#f2e6e4', mist: '#7a1a24', mistOp: 0.35,
})

export const SCENE_DAY = redsea({
  skyA: '#d9c9cf', skyB: '#f3e9e8', skyC: '#f6d6d3', seaA: '#c8202c', seaB: '#7d0d16', sandA: '#fbf8f4', sandB: '#ddd5ce',
  star: '#fff', starOp: 0, moon: '#ffffff', moonGlow: 0.5, blood: '#c41a26',
  head: '#f6f3ef', headSh: '#c9c0bb', crack: '#5a3a3e', eye: '#ffffff', cross: '#6d5559',
  swell: '#ffd0d0', swellOp: 0.35, foam: '#ffffff', mist: '#ffffff', mistOp: 0.55,
})
