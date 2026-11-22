// The Station. A pylon station seen down its central hall, arch after arch to a lit end wall with the station's
// name on it. Dark windows get a station people live in: tents along the platform with lamps inside, strings of
// bulbs between the arches, laundry on a line, a red banner, a fire in a barrel throwing sparks and a lamp on a
// chain swinging overhead. Light windows get Polis, the station of the learned: pale marble, brass chandeliers, a
// green banner, book stalls and a statue on its plinth, with the same swinging lamp.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg, timing, star, person, quad, type Palette } from '../metro.js'

const CX = 800
const CY = 500
const DEPTH = 0.82
const N = 14

function lerp(a: string, b: string, t: number) {
  const A = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16))
  const B = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16))
  return '#' + A.map((v, i) => Math.round(v + (B[i]! - v) * t).toString(16).padStart(2, '0')).join('')
}

// One arch of the hall at depth s: its half width, the floor line, where the curve springs and how high it rises.
const arch = (s: number) => ({ w: 860 * s, bot: CY + 540 * s, spring: CY - 110 * s, rise: 430 * s })
const depth = (i: number) => Math.pow(DEPTH, i)

const TPL = `
.va{stop-color:{vaultTop}}.vb{stop-color:{vaultMid}}
.fa{stop-color:{floorNear}}.fb{stop-color:{floorFar}}
.ea{stop-color:{end};stop-opacity:{endOp}}.eb{stop-color:{end};stop-opacity:0}
.ga{stop-color:{glow};stop-opacity:{glowOp}}.gb{stop-color:{glow};stop-opacity:0}
.xa{stop-color:#ffd27a;stop-opacity:.85}.xm{stop-color:#ff7a20;stop-opacity:.35}.xb{stop-color:#ff5a10;stop-opacity:0}
.ta{stop-color:{tentShade}}.tb{stop-color:{tent}}
.ha{stop-color:{haze};stop-opacity:1}.hb{stop-color:{haze};stop-opacity:0}
.ca{stop-color:{lampLight};stop-opacity:{coneOp}}.cb{stop-color:{lampLight};stop-opacity:0}
.fl{stroke:{floorLine};stroke-width:2;opacity:.55}
.slab{stroke:{floorLine};opacity:.35}
.tw{animation:tw 4s ease-in-out infinite}
.flap{fill:{flap};animation:flick 1.7s ease-in-out infinite}
.fire{animation:fire 1.3s ease-in-out infinite}
.spark{fill:#ffb347;animation:spark 3s linear infinite}
.haze{opacity:{hazeOp};animation:haze 34s ease-in-out infinite alternate}
.banner{animation:sway 7s ease-in-out infinite}
.swing{animation:swing 6.5s ease-in-out infinite}
.wash{animation:wash 5s ease-in-out infinite}
.walk{animation:walk 46s linear infinite}
.mote{fill:{mote};animation:mote 20s linear infinite}
.fig{fill:{figure}}
.plate{fill:{plate}}.letters{fill:{letters};font-family:'PT Sans Narrow','Arial Narrow',Helvetica,sans-serif;font-weight:700;letter-spacing:6px}
@keyframes tw{0%,100%{opacity:1}50%{opacity:{twLo}}}
@keyframes flick{0%,100%{opacity:.95}30%{opacity:.6}55%{opacity:1}80%{opacity:.72}}
@keyframes fire{0%,100%{transform:scale(1);opacity:.9}40%{transform:scale(1.12);opacity:1}70%{transform:scale(.94);opacity:.75}}
@keyframes spark{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(34px,-360px);opacity:0}}
@keyframes haze{from{transform:translate(-90px,0)}to{transform:translate(90px,12px)}}
@keyframes sway{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.4deg)}}
@keyframes swing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes wash{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes walk{0%{transform:translate(0,0);opacity:0}4%{opacity:1}96%{opacity:1}100%{transform:translate(560px,0);opacity:0}}
@keyframes mote{0%{transform:translate(0,0);opacity:0}15%{opacity:{moteOp}}100%{transform:translate(70px,-280px);opacity:0}}`

const DEFS = `<linearGradient id="svault" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="va"/><stop offset=".62" class="vb"/></linearGradient>
<linearGradient id="sfloor" x1="0" y1="1" x2="0" y2="0"><stop offset="0" class="fa"/><stop offset="1" class="fb"/></linearGradient>
<radialGradient id="send"><stop offset="0" class="ea"/><stop offset="1" class="eb"/></radialGradient>
<radialGradient id="sglow"><stop offset="0" class="ga"/><stop offset="1" class="gb"/></radialGradient>
<radialGradient id="sfire"><stop offset="0" class="xa"/><stop offset=".4" class="xm"/><stop offset="1" class="xb"/></radialGradient>
<linearGradient id="stent" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ta"/><stop offset="1" class="tb"/></linearGradient>
<radialGradient id="shaze"><stop offset="0" class="ha"/><stop offset="1" class="hb"/></radialGradient>
<linearGradient id="scone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ca"/><stop offset="1" class="cb"/></linearGradient>`

function hall(p: Palette, night: boolean) {
  const rand = seeded(night ? 37 : 41)
  let s = `<rect width="1600" height="1000" fill="url(#svault)"/>`
  // The end wall, lit, with the station's name.
  const far = arch(depth(N))
  s += `<circle cx="${CX}" cy="${CY - 30}" r="230" fill="url(#send)"/>`
  s += `<rect class="plate" x="${CX - 46}" y="${r1(CY - 36)}" width="92" height="20"/><text class="letters" x="${CX}" y="${r1(CY - 20.5)}" font-size="15" text-anchor="middle">${p.name}</text>`

  // The floor: granite slabs running to the end of the hall.
  s += `<polygon points="-300,1000 1900,1000 ${r1(CX + far.w)},${r1(far.bot)} ${r1(CX - far.w)},${r1(far.bot)}" fill="url(#sfloor)"/>`
  for (let i = -7; i <= 7; i++) s += `<line class="fl" x1="${CX + i * 250}" y1="1000" x2="${r1(CX + i * 250 * (far.w / 860 / 1))}" y2="${r1(far.bot)}"/>`
  for (let i = 1; i < N; i++) {
    const a = arch(depth(i))
    s += `<line class="slab" x1="${r1(CX - a.w * 1.4)}" y1="${r1(a.bot)}" x2="${r1(CX + a.w * 1.4)}" y2="${r1(a.bot)}" stroke-width="${r1(Math.max(0.6, 3 * depth(i)))}"/>`
  }

  // Arches, far to near, with what hangs between them.
  for (let i = N; i >= 0; i--) {
    const k = depth(i)
    const a = arch(k)
    const t = 1 - i / N
    const d = `M${r1(CX - a.w)} ${r1(a.bot)} L${r1(CX - a.w)} ${r1(a.spring)} A${r1(a.w)} ${r1(a.rise)} 0 0 1 ${r1(CX + a.w)} ${r1(a.spring)} L${r1(CX + a.w)} ${r1(a.bot)}`
    s += `<path d="${d}" fill="none" stroke="${lerp(p.archFar as string, p.archEdge as string, t)}" stroke-width="${r1(104 * k)}"/>`
    s += `<path d="${d}" fill="none" stroke="${lerp(p.archFar as string, p.archNear as string, t)}" stroke-width="${r1(88 * k)}"/>`
    s += `<path d="${d}" fill="none" stroke="${lerp(p.archFar as string, p.archLip as string, t)}" stroke-width="${r1(Math.max(0.6, 7 * k))}" transform="translate(0 ${r1(-36 * k)})" opacity=".8"/>`
    // the medallion at the crown
    s += `<circle cx="${CX}" cy="${r1(a.spring - a.rise - 4 * k)}" r="${r1(26 * k)}" fill="${lerp(p.archFar as string, p.medal as string, t)}"/>`
    s += `<path d="${star(CX, a.spring - a.rise - 4 * k, 14 * k)}" fill="${lerp(p.archFar as string, p.medalStar as string, t)}"/>`

    if (night && i > 0 && i < 11) {
      // a string of bulbs from pylon to pylon
      const y0 = a.spring + 34 * k
      const A: [number, number] = [CX - a.w, y0]
      const C: [number, number] = [CX, y0 + 180 * k]
      const B: [number, number] = [CX + a.w, y0]
      s += `<path d="M${r1(A[0])} ${r1(A[1])} Q${r1(C[0])} ${r1(C[1])} ${r1(B[0])} ${r1(B[1])}" fill="none" stroke="#1a110b" stroke-width="${r1(Math.max(1, 2.6 * k))}"/>`
      for (let q = 1; q < 12; q++) {
        const [bx, by] = quad(A, C, B, q / 12)
        s += `<g class="tw" style="${timing(3 + rand() * 3, rand() * 6)}"><circle cx="${r1(bx)}" cy="${r1(by)}" r="${r1(28 * k)}" fill="url(#sglow)"/><circle cx="${r1(bx)}" cy="${r1(by + 3 * k)}" r="${r1(Math.max(1, 5 * k))}" fill="#ffd690"/></g>`
      }
    }
    if (!night && i % 2 === 0 && i > 0 && i < 12) {
      // a brass chandelier under the crown
      const top = a.spring - a.rise + 20 * k
      const y = top + 130 * k
      s += `<line x1="${CX}" y1="${r1(top)}" x2="${CX}" y2="${r1(y)}" stroke="${p.brass}" stroke-width="${r1(Math.max(1, 3 * k))}"/>`
      s += `<circle class="tw" cx="${CX}" cy="${r1(y + 14 * k)}" r="${r1(170 * k)}" fill="url(#sglow)" style="${timing(6, i)}"/>`
      s += `<path d="M${r1(CX - 76 * k)} ${r1(y + 6 * k)} Q${CX} ${r1(y + 46 * k)} ${r1(CX + 76 * k)} ${r1(y + 6 * k)} Z" fill="${p.brass}"/>`
      s += `<rect x="${r1(CX - 3 * k)}" y="${r1(y - 20 * k)}" width="${r1(6 * k)}" height="${r1(26 * k)}" fill="${p.brass}"/>`
      for (let q = -3; q <= 3; q++) {
        const bx = CX + q * 24 * k
        const by = y + (2 - Math.abs(q) * 1.5) * k
        s += `<rect x="${r1(bx - 2 * k)}" y="${r1(by - 10 * k)}" width="${r1(4 * k)}" height="${r1(10 * k)}" fill="${p.brass}"/><circle cx="${r1(bx)}" cy="${r1(by - 14 * k)}" r="${r1(Math.max(1, 6.5 * k))}" fill="#fffaf0"/>`
      }
    }
  }
  return s
}

function life(p: Palette, night: boolean) {
  const rand = seeded(night ? 53 : 59)
  let s = ''
  // The banner under the fourth crown.
  {
    const k = depth(4)
    const a = arch(k)
    const top = a.spring - a.rise + 44 * k
    const w = 150 * k
    const h = 270 * k
    s += `<g class="banner" style="transform-origin:${CX}px ${r1(top)}px"><path d="M${r1(CX - w / 2)} ${r1(top)} h${r1(w)} v${r1(h)} l${r1(-w / 2)} ${r1(44 * k)} l${r1(-w / 2)} ${r1(-44 * k)} Z" fill="${p.banner}"/><rect x="${r1(CX - w / 2)}" y="${r1(top)}" width="${r1(w)}" height="${r1(12 * k)}" fill="${p.trim}"/><path d="${star(CX, top + 104 * k, 38 * k)}" fill="${p.trim}"/><rect x="${r1(CX - w / 2 + 10 * k)}" y="${r1(top + 170 * k)}" width="${r1(w - 20 * k)}" height="${r1(4 * k)}" fill="${p.trim}" opacity=".7"/></g>`
  }
  // The platforms, alternating sides going back.
  const stalls: [number, number][] = [[1, -1], [2, 1], [3, -1], [4, 1], [5, -1], [6, 1], [7, -1], [8, 1], [9, -1]]
  for (const [i, side] of stalls) {
    const k = depth(i)
    const a = arch(k)
    const tx = CX + side * a.w * 0.58
    const by = a.bot - 12 * k
    if (night || i % 3 !== 0) {
      // a tent, its flap lit from inside
      const w = 270 * k
      const h = 215 * k
      const tone = night ? '' : ''
      s += `<path d="M${r1(tx - w / 2)} ${r1(by)} L${r1(tx)} ${r1(by - h)} L${r1(tx + w / 2)} ${r1(by)} Z" fill="url(#stent)"${tone}/>`
      s += `<path d="M${r1(tx)} ${r1(by - h)} L${r1(tx + w * 0.08)} ${r1(by)}" stroke="${p.tentShade}" stroke-width="${r1(Math.max(0.6, 3 * k))}"/>`
      s += `<path class="flap" style="${timing(1.4 + rand(), rand() * 2)}" d="M${r1(tx - w * 0.13)} ${r1(by)} L${r1(tx)} ${r1(by - h * 0.56)} L${r1(tx + w * 0.15)} ${r1(by)} Z"/>`
      // crates beside it
      const cx = tx + side * w * 0.62
      s += `<rect x="${r1(cx - 30 * k)}" y="${r1(by - 50 * k)}" width="${r1(60 * k)}" height="${r1(50 * k)}" fill="${p.crate}"/><rect x="${r1(cx - 20 * k)}" y="${r1(by - 88 * k)}" width="${r1(42 * k)}" height="${r1(38 * k)}" fill="${p.crate}" opacity=".85"/>`
    } else {
      // a book stall under a canopy (Polis)
      const w = 300 * k
      s += `<rect x="${r1(tx - w / 2)}" y="${r1(by - 80 * k)}" width="${r1(w)}" height="${r1(80 * k)}" fill="${p.crate}"/>`
      for (let b = 0; b < 9; b++) {
        const bh = (28 + rand() * 36) * k
        s += `<rect x="${r1(tx - w / 2 + 10 * k + b * 31 * k)}" y="${r1(by - 80 * k - bh)}" width="${r1(24 * k)}" height="${r1(bh)}" fill="${['#7d5a3a', '#4f6a5c', '#8c3c2e', '#6c5f48'][b % 4]}"/>`
      }
      s += `<path d="M${r1(tx - w * 0.6)} ${r1(by - 190 * k)} L${r1(tx + w * 0.6)} ${r1(by - 190 * k)} L${r1(tx + w * 0.5)} ${r1(by - 150 * k)} L${r1(tx - w * 0.5)} ${r1(by - 150 * k)} Z" fill="url(#stent)"/>`
      s += `<line x1="${r1(tx - w * 0.48)}" y1="${r1(by - 150 * k)}" x2="${r1(tx - w * 0.48)}" y2="${r1(by)}" stroke="${p.tentShade}" stroke-width="${r1(4 * k)}"/><line x1="${r1(tx + w * 0.48)}" y1="${r1(by - 150 * k)}" x2="${r1(tx + w * 0.48)}" y2="${r1(by)}" stroke="${p.tentShade}" stroke-width="${r1(4 * k)}"/>`
    }
    if (rand() > 0.3) s += `<path class="fig" d="${person(tx - side * 175 * k, by + 4 * k, 128 * k)}"/>`
    if (rand() > 0.6) s += `<path class="fig" d="${person(tx - side * 215 * k, by + 6 * k, 116 * k)}"/>`
  }

  if (night) {
    // laundry on a line between the second pair of pylons, left side
    const k = depth(2)
    const a = arch(k)
    const y = a.spring + 120 * k
    const x0 = CX - a.w
    const x1 = CX - a.w * 0.2
    s += `<path d="M${r1(x0)} ${r1(y)} Q${r1((x0 + x1) / 2)} ${r1(y + 40 * k)} ${r1(x1)} ${r1(y)}" fill="none" stroke="#120c08" stroke-width="2"/>`
    for (let q = 1; q < 6; q++) {
      const [lx, ly] = quad([x0, y], [(x0 + x1) / 2, y + 40 * k], [x1, y], q / 6)
      const w = (34 + rand() * 26) * k
      const h = (50 + rand() * 50) * k
      const c = ['#4a3a2c', '#5c2a22', '#3a4038', '#6a5a46', '#2e2a30'][q % 5]
      s += `<g class="wash" style="transform-origin:${r1(lx)}px ${r1(ly)}px;${timing(4 + rand() * 3, rand() * 5)}"><rect x="${r1(lx - w / 2)}" y="${r1(ly)}" width="${r1(w)}" height="${r1(h)}" fill="${c}"/></g>`
    }
    // the barrel fire, front left
    s += `<g class="fire" style="transform-origin:230px 880px"><circle cx="230" cy="860" r="280" fill="url(#sfire)"/></g>`
    s += `<rect x="186" y="880" width="88" height="140" rx="6" fill="#120c08"/><rect x="182" y="874" width="96" height="12" fill="#2c1d12"/><rect x="186" y="930" width="88" height="5" fill="#24180f"/><rect x="186" y="975" width="88" height="5" fill="#24180f"/>`
    s += `<path d="M200 876 Q214 830 222 856 Q232 812 244 852 Q254 826 262 876 Z" fill="#ffb347" class="fire" style="transform-origin:230px 876px;animation-duration:.9s"/>`
    for (let i = 0; i < 14; i++) s += `<circle class="spark" style="${timing(2.2 + rand() * 2.2, rand() * 4)}" cx="${r1(205 + rand() * 50)}" cy="872" r="${r1(1.2 + rand() * 1.8)}"/>`
    s += `<path class="fig" d="${person(330, 1010, 230)}"/><path class="fig" d="${person(118, 1016, 250)}"/>`
  } else {
    // a statue on its plinth, right side
    const k = depth(3)
    const a = arch(k)
    const sx = CX + a.w * 0.88
    const by = a.bot - 10 * k
    s += `<rect x="${r1(sx - 50 * k)}" y="${r1(by - 120 * k)}" width="${r1(100 * k)}" height="${r1(120 * k)}" fill="${p.plinth}"/><rect x="${r1(sx - 60 * k)}" y="${r1(by - 130 * k)}" width="${r1(120 * k)}" height="${r1(14 * k)}" fill="${p.plinth}"/>`
    s += `<path d="${person(sx, by - 130 * k, 230 * k)}" fill="${p.bronze}"/><path d="M${r1(sx + 20 * k)} ${r1(by - 300 * k)} l${r1(40 * k)} ${r1(-50 * k)} l${r1(10 * k)} ${r1(6 * k)} l${r1(-38 * k)} ${r1(52 * k)} Z" fill="${p.bronze}"/>`
    s += `<path class="fig" d="${person(1250, 990, 250)}"/><path class="fig" d="${person(1336, 998, 236)}"/><path class="fig" d="${person(214, 1004, 240)}"/>`
  }

  // someone crossing the hall far down
  {
    const k = depth(5)
    const a = arch(k)
    s += `<g class="walk" style="${timing(46, 12)}"><path class="fig" d="${person(CX - 280, a.bot - 4 * k, 120 * k)}"/></g>`
  }

  // haze under the vault and dust in the air
  s += `<g class="haze" fill="url(#shaze)"><ellipse cx="700" cy="230" rx="720" ry="90"/><ellipse cx="1120" cy="320" rx="520" ry="60"/><ellipse cx="420" cy="380" rx="380" ry="40"/></g>`
  for (let i = 0; i < 26; i++) s += `<circle class="mote" style="${timing(14 + rand() * 12, rand() * 26)}" cx="${r1(200 + rand() * 1200)}" cy="${r1(420 + rand() * 520)}" r="${r1(1 + rand() * 1.8)}"/>`

  // the lamp on its chain, swinging over the front of the hall
  s += `<g class="swing" style="transform-origin:1220px 0px"><line x1="1220" y1="0" x2="1220" y2="250" stroke="${p.chain}" stroke-width="3"/>
<path d="M1220 250 L1120 1000 L1320 1000 Z" fill="url(#scone)"/>
<circle cx="1220" cy="292" r="110" fill="url(#sglow)"/>
<path d="M1176 290 Q1220 236 1264 290 Z" fill="${p.shade}"/><rect x="1214" y="246" width="12" height="16" fill="${p.shade}"/><circle cx="1220" cy="292" r="8" fill="#fff4d6"/></g>`
  return s
}

function station(p: Palette, night: boolean) {
  return svg(fill(TPL, p), DEFS, hall(p, night) + life(p, night))
}

export const SCENE_STATION = station(
  {
    name: 'ВДНХ',
    vaultTop: '#090706', vaultMid: '#1c140e', floorNear: '#2c2118', floorFar: '#0d0a08', floorLine: '#3c2d20',
    end: '#ffb565', endOp: 0.5, glow: '#ffc068', glowOp: 0.6, lampLight: '#ffd590', coneOp: 0.14,
    archFar: '#0c0907', archNear: '#5c4532', archEdge: '#2a1e15', archLip: '#7a5e44', medal: '#6a5038', medalStar: '#a8452e',
    tent: '#6e3e1a', tentShade: '#2a170a', flap: '#ffb050', crate: '#2a1d13', figure: '#070504',
    banner: '#7e1c13', trim: '#e3b13c', haze: '#3c2b1e', hazeOp: 0.35, mote: '#e6c890', moteOp: 0.5,
    plate: '#1a120c', letters: '#e9c37a', twLo: 0.35, chain: '#120c08', shade: '#2a2e2a', brass: '#000000', plinth: '#000000', bronze: '#000000',
  },
  true,
)

export const SCENE_POLIS = station(
  {
    name: 'ПОЛИС',
    vaultTop: '#f2ede3', vaultMid: '#e4dccd', floorNear: '#d6cbb6', floorFar: '#efe9de', floorLine: '#bfb29a',
    end: '#ffffff', endOp: 0.95, glow: '#fff3d4', glowOp: 0.75, lampLight: '#fff1cc', coneOp: 0.22,
    archFar: '#e8e1d4', archNear: '#c3b59c', archEdge: '#a8987c', archLip: '#faf7f1', medal: '#b6965c', medalStar: '#f3ead4',
    tent: '#ddd0b4', tentShade: '#b5a27c', flap: '#f7ebd0', crate: '#a88e66', figure: '#7f725c',
    banner: '#2d5b5d', trim: '#c49a52', haze: '#ffffff', hazeOp: 0.5, mote: '#a8946c', moteOp: 0.45,
    plate: '#2d5b5d', letters: '#f3ead4', twLo: 0.78, chain: '#8c7348', shade: '#a98b55', brass: '#a98b55', plinth: '#cfc4b0', bronze: '#6f5a3c',
  },
  false,
)
