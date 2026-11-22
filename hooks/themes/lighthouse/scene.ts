// The Light. A lighthouse on a bare rock in a monochrome storm: its lens turns, its beam swings toward you and
// away, gulls cross, the sea breaks white on the rock and a limb rises from the swell behind it. After Robert
// Eggers' The Lighthouse, shot on black-and-white stock through a filter that took out the red: no hue at all,
// a vignette and the faint flicker of an old projector.
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

const HORIZON = 610
const TX = 1050 // the tower's axis
const TB = 800 // its foot
const TT = 290 // its top, under the gallery

const TENTACLES: TentacleSpec[] = [
  { x: 1330, y: 1000, flip: true, length: 620, width: 120, joints: 11, period: 7, baseDeg: 2, tipDeg: 10, lag: 0.6, delay: 0 },
  { x: 240, y: 1080, flip: false, length: 420, width: 76, joints: 9, period: 5.6, baseDeg: 2.5, tipDeg: 12, lag: 0.5, delay: 2.2 },
]
const { markup: TENT, style: SWING } = tentacles(TENTACLES)

// ---- The tower -----------------------------------------------------------------------------------------------------
const halfW = (y: number) => 34 + ((y - TT) / (TB - TT)) * 46
const TOWER = (() => {
  let s = `<path class="tower" d="M${TX - halfW(TB)} ${TB} L${TX - halfW(TT)} ${TT} L${TX + halfW(TT)} ${TT} L${TX + halfW(TB)} ${TB} Z"/>`
  // the shaded side
  s += `<path class="tower-sh" d="M${TX + 8} ${TB} L${TX + 4} ${TT} L${TX + halfW(TT)} ${TT} L${TX + halfW(TB)} ${TB} Z"/>`
  // courses of stone
  let lines = ''
  for (let y = TT + 18; y < TB; y += 18) lines += `M${r1(TX - halfW(y))} ${y} L${r1(TX + halfW(y))} ${y}`
  s += `<path class="course" d="${lines}"/>`
  for (const y of [420, 560, 690]) s += `<rect class="slit" x="${TX - 6}" y="${y}" width="12" height="22"/>`
  s += `<path class="slit" d="M${TX - 12} ${TB} L${TX - 12} ${TB - 38} C${TX - 12} ${TB - 50} ${TX + 12} ${TB - 50} ${TX + 12} ${TB - 38} L${TX + 12} ${TB} Z"/>`
  // gallery and railing
  s += `<rect class="iron" x="${TX - 56}" y="${TT - 8}" width="112" height="10"/>`
  let rail = `M${TX - 52} ${TT - 34} L${TX + 52} ${TT - 34}`
  for (let x = TX - 50; x <= TX + 50; x += 10) rail += `M${x} ${TT - 34} L${x} ${TT - 8}`
  s += `<path class="rail" d="${rail}"/>`
  // the lantern room: glass panes with astragals, and a dome
  s += `<rect class="glass" x="${TX - 30}" y="${TT - 92}" width="60" height="84"/>`
  s += `<g class="lens-band"><rect class="lens" x="${TX - 30}" y="${TT - 88}" width="16" height="76"/></g>`
  s += `<circle class="lens-core" cx="${TX}" cy="${TT - 50}" r="12"/>`
  s += `<path class="iron-l" d="M${TX - 30} ${TT - 92} L${TX - 30} ${TT - 8} M${TX - 10} ${TT - 92} L${TX - 10} ${TT - 8} M${TX + 10} ${TT - 92} L${TX + 10} ${TT - 8} M${TX + 30} ${TT - 92} L${TX + 30} ${TT - 8} M${TX - 30} ${TT - 50} L${TX + 30} ${TT - 50}"/>`
  s += `<path class="iron" d="M${TX - 38} ${TT - 92} C${TX - 34} ${TT - 132} ${TX + 34} ${TT - 132} ${TX + 38} ${TT - 92} Z"/><rect class="iron" x="${TX - 2}" y="${TT - 150}" width="4" height="24"/><circle class="iron" cx="${TX}" cy="${TT - 152}" r="5"/>`
  return s
})()

const LAMP_Y = TT - 50
const BEAM = `<g class="beam" style="transform-origin:${TX}px ${LAMP_Y}px"><polygon points="${TX},${LAMP_Y - 6} ${TX - 1100},${LAMP_Y - 120} ${TX - 1100},${LAMP_Y + 140} ${TX},${LAMP_Y + 6}" fill="url(#beam)"/></g>
<g class="beam2" style="transform-origin:${TX}px ${LAMP_Y}px"><polygon points="${TX},${LAMP_Y - 6} ${TX + 900},${LAMP_Y - 110} ${TX + 900},${LAMP_Y + 120} ${TX},${LAMP_Y + 6}" fill="url(#beamr)"/></g>
<circle class="flash" cx="${TX}" cy="${LAMP_Y}" r="150" fill="url(#flash)" style="transform-origin:${TX}px ${LAMP_Y}px"/>`

// The keeper's cottage, leaning into the weather.
const COTTAGE = `<path class="cottage" d="M820 ${TB + 4} L820 ${TB - 60} L870 ${TB - 98} L920 ${TB - 60} L920 ${TB + 4} Z"/><rect class="cottage" x="896" y="${TB - 100}" width="12" height="30"/>
<rect class="win-c" x="842" y="${TB - 46}" width="14" height="18" style="animation-duration:10s"/><rect class="slit" x="880" y="${TB - 40}" width="16" height="44"/>`

const ROCK = `<path class="rock" d="M640 1000 L700 ${TB + 30} C760 ${TB - 6} 820 ${TB - 2} 900 ${TB + 2} C980 ${TB - 6} 1040 ${TB - 4} 1120 ${TB + 2} C1190 ${TB - 2} 1240 ${TB + 18} 1300 ${TB + 44} L1380 1000 Z"/>
<path class="rock-hi" d="M700 ${TB + 30} C760 ${TB - 6} 820 ${TB - 2} 900 ${TB + 2} C980 ${TB - 6} 1040 ${TB - 4} 1120 ${TB + 2} C1190 ${TB - 2} 1240 ${TB + 18} 1300 ${TB + 44} L1290 ${TB + 56} C1220 ${TB + 30} 1100 ${TB + 20} 900 ${TB + 24} C800 ${TB + 18} 740 ${TB + 30} 710 ${TB + 50} Z"/>`

// The sea breaks on the rock: plumes that rise and fall away.
function spray() {
  const at: [number, number, number, number][] = [
    [690, TB + 70, 7, 0], [760, TB + 46, 9, 3.4], [1290, TB + 70, 8, 1.6], [1350, TB + 96, 10, 5.2], [650, TB + 120, 11, 6.1],
  ]
  return at
    .map(([x, y, dur, delay]) => {
      let s = `<g class="spray" fill="url(#spr)" style="transform-origin:${x}px ${y}px;animation-duration:${dur}s;animation-delay:-${delay}s">`
      s += `<ellipse cx="${x}" cy="${y - 40}" rx="70" ry="70"/><ellipse cx="${x - 40}" cy="${y - 6}" rx="56" ry="44"/><ellipse cx="${x + 44}" cy="${y - 10}" rx="50" ry="46"/><ellipse cx="${x + 10}" cy="${y - 110}" rx="44" ry="56"/>`
      for (let k = 0; k < 10; k++) s += `<circle cx="${r1(x + Math.sin(k * 2.4) * 70)}" cy="${r1(y - 60 - Math.cos(k * 1.7) * 60 - k * 6)}" r="${r1(2 + (k % 3))}"/>`
      return s + '</g>'
    })
    .join('')
}

function swell() {
  const rand = seeded(19)
  let s = ''
  for (let i = 0; i < 18; i++) {
    const y = HORIZON + 10 + Math.pow(i / 18, 1.5) * 380
    const amp = 3 + i * 1.2
    const len = 90 + i * 14
    let d = `M-100 ${r1(y)}`
    for (let x = -100; x < 1720; x += len) d += ` q${r1(len / 4)} ${r1(-amp)} ${r1(len / 2)} 0 t${r1(len / 2)} 0`
    s += `<path class="swell" d="${d}" stroke-dasharray="${Math.round(60 + rand() * 200)} ${Math.round(30 + rand() * 120)} ${Math.round(20 + rand() * 80)} ${Math.round(40 + rand() * 90)}" style="animation-duration:${r1(5 + rand() * 5)}s;animation-delay:-${r1(rand() * 5)}s;stroke-width:${r1(1 + i * 0.12)}"/>`
  }
  return s
}

function gulls() {
  const rand = seeded(37)
  let s = ''
  for (let i = 0; i < 6; i++) {
    const y = 160 + rand() * 300
    const size = 8 + rand() * 9
    const x = 20
    const flap = r1(0.5 + rand() * 0.4)
    s += `<g class="gull" style="animation-duration:${r1(26 + rand() * 20)}s;animation-delay:-${r1(rand() * 40)}s"><g class="flap" style="transform-origin:${x}px ${r1(y)}px;animation-duration:${flap}s"><path d="M${r1(x - size)} ${r1(y - size * 0.3)} Q${r1(x - size * 0.5)} ${r1(y - size * 0.7)} ${x} ${r1(y)} Q${r1(x + size * 0.5)} ${r1(y - size * 0.7)} ${r1(x + size)} ${r1(y - size * 0.3)}"/></g></g>`
  }
  return s
}

function rain() {
  const rand = seeded(53)
  let d = ''
  for (let i = 0; i < 260; i++) {
    const x = rand() * 1900
    const y = rand() * 2000 - 1000
    const l = 18 + rand() * 26
    d += `M${r1(x)} ${r1(y)} l${r1(-l * 0.22)} ${r1(l)}`
  }
  return `<g class="rain"><path d="${d}"/></g><g class="rain" style="animation-duration:1.7s;animation-delay:-.6s;opacity:.6"><path d="${d}" transform="translate(37 -23)"/></g>`
}

function clouds() {
  const rand = seeded(11)
  let s = ''
  for (let i = 0; i < 12; i++) {
    const y = 30 + rand() * 400
    const x = rand() * 1700
    const w = 260 + rand() * 420
    const cls = rand() < 0.5 ? 'cl1' : 'cl2'
    s += `<g class="cloud ${cls}" style="animation-duration:${r1(50 + rand() * 40)}s;animation-delay:-${r1(rand() * 50)}s"><ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(w / 2)}" ry="${r1(30 + rand() * 30)}"/><ellipse cx="${r1(x - w * 0.2)}" cy="${r1(y + 12)}" rx="${r1(w / 3)}" ry="${r1(24 + rand() * 20)}"/><ellipse cx="${r1(x + w * 0.22)}" cy="${r1(y - 14)}" rx="${r1(w / 3.2)}" ry="${r1(26 + rand() * 18)}"/></g>`
  }
  return s
}

const TPL = `
.sky-a{stop-color:{skyA}}.sky-b{stop-color:{skyB}}.sea-a{stop-color:{seaA}}.sea-b{stop-color:{seaB}}
.beam-a{stop-color:{beam};stop-opacity:{beamOp}}.beam-b{stop-color:{beam};stop-opacity:0}
.vig-a{stop-color:{vig};stop-opacity:0}.vig-b{stop-color:{vig};stop-opacity:{vigOp}}
.tent-a{stop-color:{tentA}}.tent-b{stop-color:{tentB}}
.cl1{fill:{cl1}}.cl2{fill:{cl2}}.cloud{opacity:{clOp};animation:drift 60s ease-in-out infinite alternate}
.swell{fill:none;stroke:{swell};opacity:{swellOp};animation:swell 7s ease-in-out infinite alternate}
.tower{fill:{tower}}.tower-sh{fill:{towerSh}}.course{fill:none;stroke:{course};stroke-width:1}
.slit{fill:{slit}}.iron{fill:{iron}}.iron-l{fill:none;stroke:{iron};stroke-width:2.5}.rail{fill:none;stroke:{iron};stroke-width:2}
.glass{fill:{glass}}.lens{fill:{beam};opacity:.9}.lens-band{animation:lens 6s linear infinite}
.lens-core{fill:{beam};animation:core 6s ease-in-out infinite}
.beam{animation:sweep 12s linear infinite}.beam2{animation:sweep2 12s linear infinite}
.flash{opacity:0;animation:flash 12s linear infinite}
.cottage{fill:{cottage}}.win-c{fill:{beam};animation:winc 10s ease-in-out infinite}
.rock{fill:{rock}}.rock-hi{fill:{rockHi}}
.spr-a{stop-color:{spray};stop-opacity:.9}.spr-b{stop-color:{spray};stop-opacity:0}.spray{opacity:0;animation:spray 8s ease-out infinite}
.gull{fill:none;stroke:{gull};stroke-width:2.2;stroke-linecap:round;animation:fly 30s linear infinite}
.flap{animation:flap .6s ease-in-out infinite alternate}
.rain{stroke:{rain};stroke-width:1.1;opacity:{rainOp};animation:rain 1.3s linear infinite}
.flick{fill:{flick};opacity:0;animation:flick 4.7s steps(1) infinite}
.sk{fill:{sk};opacity:.55}
{SWING}
@keyframes drift{from{transform:translate(-120px,0)}to{transform:translate(120px,0)}}
@keyframes swell{from{transform:translate(-30px,0)}to{transform:translate(30px,3px)}}
@keyframes lens{from{transform:translate(0,0)}to{transform:translate(44px,0)}}
@keyframes core{0%,100%{opacity:.6}25%{opacity:1}75%{opacity:.4}}
@keyframes sweep{0%{transform:scale(1,1);opacity:.85}25%{transform:scale(.02,1);opacity:1}50%{transform:scale(-1,1);opacity:0}75%{transform:scale(-.02,1);opacity:0}100%{transform:scale(1,1);opacity:.85}}
@keyframes sweep2{0%{transform:scale(-.02,1);opacity:0}25%{transform:scale(-1,1);opacity:0}50%{transform:scale(.02,1);opacity:0}52%{opacity:.7}75%{transform:scale(1,1);opacity:.8}100%{transform:scale(-.02,1);opacity:0}}
@keyframes flash{0%,19%,31%,100%{opacity:0;transform:scale(.5)}25%{opacity:{flashOp};transform:scale(1.3)}}
@keyframes winc{0%,100%{opacity:{winLo}}50%{opacity:{winHi}}}
@keyframes spray{0%{opacity:0;transform:translate(0,40px) scale(.3)}12%{opacity:{sprayOp}}40%{opacity:{sprayOp2};transform:translate(0,-30px) scale(1.15)}70%,100%{opacity:0;transform:translate(10px,10px) scale(1.3)}}
@keyframes fly{from{transform:translate(-120px,0)}50%{transform:translate(780px,-40px)}to{transform:translate(1700px,20px)}}
@keyframes flap{from{transform:scale(1,1)}to{transform:scale(1,-.6)}}
@keyframes rain{from{transform:translate(0,0)}to{transform:translate(-220px,1000px)}}
@keyframes flick{0%{opacity:0}31%{opacity:{flickOp}}33%{opacity:0}62%{opacity:{flickOp2}}64%{opacity:0}88%{opacity:{flickOp}}90%{opacity:0}}`

const DEFS = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset="1" class="sky-b"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sea-a"/><stop offset="1" class="sea-b"/></linearGradient>
<linearGradient id="beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" class="beam-a"/><stop offset="1" class="beam-b"/></linearGradient>
<linearGradient id="beamr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="beam-a"/><stop offset="1" class="beam-b"/></linearGradient>
<radialGradient id="flash"><stop offset="0" class="beam-a"/><stop offset="1" class="beam-b"/></radialGradient>
<radialGradient id="spr"><stop offset=".2" class="spr-a"/><stop offset="1" class="spr-b"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" class="vig-a"/><stop offset="1" class="vig-b"/></radialGradient>
<linearGradient id="tent" gradientUnits="userSpaceOnUse" x1="0" y1="380" x2="0" y2="1000"><stop offset="0" class="tent-a"/><stop offset="1" class="tent-b"/></linearGradient>`

const BODY = `<rect width="1600" height="1000" fill="url(#sky)"/>
${clouds()}
${BEAM}
<rect y="${HORIZON}" width="1600" height="${1000 - HORIZON}" fill="url(#sea)"/>
${swell()}
<g fill="url(#tent)">${TENT}</g>
${ROCK}${COTTAGE}${TOWER}
${spray()}
${gulls()}
${rain()}
<rect width="1600" height="1000" fill="url(#vig)"/>
<rect class="flick" width="1600" height="1000"/>`

export function lighthouse(p: Record<string, string | number>) {
  return svg(fill(TPL.replace('{SWING}', SWING), p), DEFS, BODY)
}

export const SCENE_NIGHT = lighthouse({
  skyA: '#0e0e0e', skyB: '#2b2b2a', seaA: '#1b1b1b', seaB: '#050505', beam: '#f2f2ee', beamOp: 0.3,
  vig: '#000000', vigOp: 0.75, tentA: '#3c3c3a', tentB: '#0b0b0b', cl1: '#2a2a2a', cl2: '#161616', clOp: 0.8,
  swell: '#8a8a8a', swellOp: 0.28, tower: '#3a3a38', towerSh: '#1e1e1d', course: '#121212', slit: '#070707',
  iron: '#454543', glass: '#232323', cottage: '#2a2a29', rock: '#0b0b0b', rockHi: '#1d1d1d', spray: '#d8d8d4',
  gull: '#bdbdb8', rain: '#9a9a96', rainOp: 0.22, flick: '#ffffff', flickOp: 0.035, flickOp2: 0.02, flashOp: 0.95,
  winLo: 0.3, winHi: 0.85, sprayOp: 0.55, sprayOp2: 0.35, sk: '#4a4a48',
})

export const SCENE_DAY = lighthouse({
  skyA: '#a8a8a5', skyB: '#e0e0dc', seaA: '#bdbdb9', seaB: '#8a8a87', beam: '#ffffff', beamOp: 0.55,
  vig: '#5a5a58', vigOp: 0.45, tentA: '#5d5d5b', tentB: '#3a3a39', cl1: '#c9c9c5', cl2: '#9c9c99', clOp: 0.7,
  swell: '#f4f4f0', swellOp: 0.5, tower: '#d6d6d1', towerSh: '#a7a7a3', course: '#8e8e8a', slit: '#2e2e2d',
  iron: '#2a2a29', glass: '#6f6f6c', cottage: '#5c5c5a', rock: '#3d3d3c', rockHi: '#5a5a58', spray: '#ffffff',
  gull: '#2c2c2b', rain: '#5c5c5a', rainOp: 0.18, flick: '#000000', flickOp: 0.03, flickOp2: 0.018, flashOp: 0.8,
  winLo: 0.1, winHi: 0.4, sprayOp: 0.85, sprayOp2: 0.6, sk: '#7a7a78',
})
