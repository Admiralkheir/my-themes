// The Surface. Moscow twenty years after the bombs: a Stalinist high-rise stepping up to its spire and red star,
// a second one far off, the TV tower's needle, panel blocks broken open, a crane that fell, a burnt trolleybus
// under its wires and, in front, a metro entrance with its red M. Winged things circle the towers. Dark windows
// get a poisoned night lit green at the horizon, spores rising; light windows get the nuclear winter's ash-grey
// day, a weak sun and ash falling.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg, timing, star, quad, type Palette } from '../metro.js'

const STREET = 880

// A stepped high-rise: tiers narrowing to a spire, wings at its feet, windows in rows, a star on top.
function highrise(rand: () => number, cx: number, base: number, k: number, cls: string, win: string, starId: string) {
  const tiers: [number, number][] = [[560, 120], [380, 92], [264, 122], [196, 100], [136, 90], [94, 72], [60, 58], [36, 40]]
  let body = ''
  let wins = ''
  let y = base
  for (const [w0, h0] of tiers) {
    const w = w0 * k
    const h = h0 * k
    body += `M${r1(cx - w / 2)} ${r1(y)} h${r1(w)} v${r1(-h)} h${r1(-w)} Z `
    // corner turrets on the lower tiers
    if (w0 > 200) body += `M${r1(cx - w / 2)} ${r1(y - h)} h${r1(16 * k)} v${r1(-22 * k)} h${r1(-16 * k)} Z M${r1(cx + w / 2 - 16 * k)} ${r1(y - h)} h${r1(16 * k)} v${r1(-22 * k)} h${r1(-16 * k)} Z `
    for (let wx = cx - w / 2 + 12 * k; wx < cx + w / 2 - 10 * k; wx += 17 * k) {
      for (let wy = y - h + 12 * k; wy < y - 10 * k; wy += 22 * k) {
        if (rand() > 0.22) wins += `M${r1(wx)} ${r1(wy)} h${r1(6 * k)} v${r1(11 * k)} h${r1(-6 * k)} Z `
      }
    }
    y -= h
  }
  // the spire and its star
  body += `M${r1(cx - 10 * k)} ${r1(y)} L${r1(cx)} ${r1(y - 200 * k)} L${r1(cx + 10 * k)} ${r1(y)} Z `
  // the side wings with their own small spires
  for (const sx of [-1, 1]) {
    const wx = cx + sx * 370 * k
    body += `M${r1(wx - 46 * k)} ${r1(base)} h${r1(92 * k)} v${r1(-190 * k)} h${r1(-92 * k)} Z M${r1(wx - 30 * k)} ${r1(base - 190 * k)} h${r1(60 * k)} v${r1(-40 * k)} h${r1(-60 * k)} Z M${r1(wx - 7 * k)} ${r1(base - 230 * k)} L${r1(wx)} ${r1(base - 310 * k)} L${r1(wx + 7 * k)} ${r1(base - 230 * k)} Z `
    for (let wy = base - 176 * k; wy < base - 10 * k; wy += 22 * k) for (let c = -2; c <= 2; c++) if (rand() > 0.3) wins += `M${r1(wx + c * 16 * k - 3 * k)} ${r1(wy)} h${r1(6 * k)} v${r1(11 * k)} h${r1(-6 * k)} Z `
  }
  const sy = y - 214 * k
  return `<path class="${cls}" d="${body}"/><path class="${win}" d="${wins}"/>
<circle class="redglow" cx="${r1(cx)}" cy="${r1(sy)}" r="${r1(50 * k)}" fill="url(#${starId})" style="${timing(4.5, rand() * 4)}"/><path class="redstar" d="${star(cx, sy, 16 * k)}"/>`
}

// A five-storey panel block with its top bitten off and the floor slabs showing.
function block(rand: () => number, x: number, w: number, h: number) {
  const top = STREET - h
  let d = `M${x} ${STREET} L${x} ${r1(top)}`
  const steps = 7
  for (let q = 1; q <= steps; q++) {
    const bite = q > steps * 0.45 && q < steps ? rand() * 110 : rand() * 18
    d += ` L${r1(x + (w * q) / steps)} ${r1(top + bite)}`
  }
  d += ` L${x + w} ${STREET} Z`
  let wins = ''
  let slabs = ''
  for (let wy = top + 30; wy < STREET - 20; wy += 34) {
    slabs += `M${x} ${r1(wy - 6)} h${w} `
    for (let wx = x + 12; wx < x + w - 16; wx += 28) if (rand() > 0.08) wins += `M${r1(wx)} ${r1(wy)} h14 v18 h-14 Z `
  }
  return `<path class="mid" d="${d}"/><path class="midwin" d="${wins}"/><path class="slab" d="${slabs}"/>`
}

// The fallen crane: a lattice jib leaning across the blocks.
function crane() {
  const x0 = 1430
  const y0 = STREET
  let d = `M${x0 - 14} ${y0} L${x0 - 14} 520 L${x0 + 14} 520 L${x0 + 14} ${y0} Z `
  let lat = ''
  for (let y = y0; y > 530; y -= 28) lat += `M${x0 - 14} ${y} L${x0 + 14} ${y - 28} M${x0 + 14} ${y} L${x0 - 14} ${y - 28} `
  // the jib, snapped and hanging down to the left
  const ang = (158 * Math.PI) / 180
  const ux = Math.cos(ang)
  const uy = Math.sin(ang)
  const len = 330
  const ax = x0
  const ay = 520
  const bx = ax + ux * len
  const by = ay - uy * len * 0.4
  d += `M${ax} ${ay - 10} L${r1(bx)} ${r1(by - 10)} L${r1(bx)} ${r1(by + 10)} L${ax} ${ay + 10} Z `
  for (let t = 0; t < 1; t += 0.08) {
    const px = ax + (bx - ax) * t
    const py = ay + (by - ay) * t
    lat += `M${r1(px)} ${r1(py - 10)} L${r1(px - 24)} ${r1(py + 10)} `
  }
  d += `M${r1(bx - 4)} ${r1(by)} h8 v120 h-8 Z`
  return `<path class="crane" d="${d}"/><path class="lattice" d="${lat}"/>
<g class="hook" style="transform-origin:${r1(bx)}px ${r1(by + 120)}px;${timing(7, 2)}"><line class="lattice" x1="${r1(bx)}" y1="${r1(by + 120)}" x2="${r1(bx)}" y2="${r1(by + 200)}"/><path class="crane" d="M${r1(bx - 9)} ${r1(by + 200)} h18 v14 h-18 Z"/></g>`
}

// The metro entrance: a squat pavilion with an arched mouth and a red M on a post.
function pavilion(x: number) {
  const top = STREET - 110
  let s = `<path class="near" d="M${x} ${STREET} L${x} ${top} L${x + 260} ${top} L${x + 260} ${STREET} Z M${x - 12} ${top} h284 v-16 h-284 Z M${x + 30} ${top - 16} h200 v-24 h-200 Z"/>`
  s += `<path class="mouth" d="M${x + 90} ${STREET} L${x + 90} ${top + 46} A40 40 0 0 1 ${x + 170} ${top + 46} L${x + 170} ${STREET} Z"/>`
  for (const c of [24, 56, 204, 236]) s += `<rect class="col" x="${x + c - 6}" y="${top + 6}" width="12" height="${STREET - top - 6}"/>`
  // the M on its post
  const mx = x + 310
  const my = top - 40
  s += `<rect class="near" x="${mx - 4}" y="${my}" width="8" height="${STREET - my}"/>`
  s += `<circle class="mglow" cx="${mx}" cy="${my - 30}" r="76" fill="url(#mglow)" style="${timing(9, 3)}"/>`
  s += `<circle class="mring" cx="${mx}" cy="${my - 30}" r="34"/>`
  s += `<path class="msign" style="${timing(9, 3)}" d="M${mx - 22} ${my - 14} L${mx - 22} ${my - 46} L${mx - 14} ${my - 46} L${mx} ${my - 26} L${mx + 14} ${my - 46} L${mx + 22} ${my - 46} L${mx + 22} ${my - 14} L${mx + 15} ${my - 14} L${mx + 15} ${my - 34} L${mx} ${my - 15} L${mx - 15} ${my - 34} L${mx - 15} ${my - 14} Z"/>`
  return s
}

// The trolleybus, burnt out, its poles still up toward the wires.
function trolleybus(x: number) {
  const y = STREET + 30
  let s = `<path class="near" d="M${x} ${y} L${x} ${y - 100} Q${x} ${y - 112} ${x + 14} ${y - 112} L${x + 290} ${y - 112} Q${x + 304} ${y - 112} ${x + 304} ${y - 98} L${x + 304} ${y} Z"/>`
  for (let wx = x + 20; wx < x + 290; wx += 46) s += `<rect class="mouth" x="${wx}" y="${y - 96}" width="34" height="38"/>`
  s += `<circle class="near" cx="${x + 56}" cy="${y}" r="20"/><circle class="near" cx="${x + 250}" cy="${y}" r="20"/>`
  s += `<line class="pole" x1="${x + 210}" y1="${y - 112}" x2="${x + 70}" y2="${y - 200}"/><line class="pole" x1="${x + 230}" y1="${y - 112}" x2="${x + 96}" y2="${y - 196}"/>`
  return s
}

// Wires sagging from pole to pole along the street.
function wires() {
  const poles = [-40, 380, 800, 1220, 1640]
  let s = ''
  for (const x of poles) s += `<rect class="near" x="${x - 5}" y="${STREET - 250}" width="10" height="250"/><rect class="near" x="${x - 40}" y="${STREET - 246}" width="80" height="6"/>`
  let d = ''
  for (let i = 0; i < poles.length - 1; i++) {
    for (const [dx, dy] of [[-34, 0], [34, 0], [-18, 4]] as [number, number][]) {
      const a: [number, number] = [poles[i]! + dx, STREET - 244 + dy]
      const b: [number, number] = [poles[i + 1]! + dx, STREET - 244 + dy]
      const c: [number, number] = [(a[0] + b[0]) / 2, a[1] + 70]
      d += `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]} `
    }
  }
  // one wire snapped, hanging
  const p: [number, number] = [1220 + 34, STREET - 244]
  const [hx, hy] = quad(p, [1340, STREET - 140], [1380, STREET - 20], 1)
  d += `M${p[0]} ${p[1]} Q1340 ${STREET - 140} ${hx} ${hy} `
  return s + `<path class="wire" d="${d}"/>`
}

// Something with wings, crossing the sky.
function flyer(id: string, y: number, k: number, dur: number, delay: number) {
  return `<g class="fly-${id}" style="${timing(dur, delay)}"><g transform="translate(0 ${y}) scale(${k})"><g class="flap" style="animation-delay:-${r1(delay % 1.2)}s"><path class="creature" d="M0 0 C-26 -26 -70 -38 -120 -16 C-96 -12 -82 -4 -70 6 C-58 -2 -44 2 -34 10 C-22 4 -10 4 0 0 Z M0 0 C26 -26 70 -38 120 -16 C96 -12 82 -4 70 6 C58 -2 44 2 34 10 C22 4 10 4 0 0 Z"/></g>
<path class="creature" d="M-8 -6 Q0 -18 8 -6 L10 14 Q0 30 -10 14 Z M-4 26 L0 58 L4 26 Z"/></g></g>`
}

const TPL = `
.sa{stop-color:{skyA}}.sb{stop-color:{skyB}}.sc{stop-color:{skyC}}
.ga{stop-color:{glow};stop-opacity:{glowOp}}.gb{stop-color:{glow};stop-opacity:0}
.ca{stop-color:{cloud};stop-opacity:{cloudOp}}.cb{stop-color:{cloud};stop-opacity:0}
.da{stop-color:{cloudDark};stop-opacity:{cloudDarkOp}}.db{stop-color:{cloudDark};stop-opacity:0}
.ra{stop-color:{red};stop-opacity:{redGlow}}.rb{stop-color:{red};stop-opacity:0}
.fa{stop-color:{fog};stop-opacity:{fogOp}}.fb{stop-color:{fog};stop-opacity:0}
.sun{fill:{sunDisc};opacity:{sunOp}}
.far1{fill:{far1}}.far2{fill:{far2}}.farwin{fill:{farWin}}
.tower{fill:{tower}}.towerwin{fill:{towerWin}}
.mid{fill:{mid}}.midwin{fill:{midWin}}.slab{fill:none;stroke:{slab};stroke-width:3}
.crane{fill:{crane}}.lattice{fill:none;stroke:{crane};stroke-width:3}
.near{fill:{near}}.mouth{fill:{mouth}}.col{fill:{col}}.pole{stroke:{near};stroke-width:4}
.wire{fill:none;stroke:{wire};stroke-width:2}
.ground{fill:{ground}}.rebar{fill:none;stroke:{ground};stroke-width:5}
.redstar{fill:{red}}.redglow{animation:pulse 4s ease-in-out infinite}
.mring{fill:none;stroke:{red};stroke-width:5}.msign{fill:{red};animation:neon 9s linear infinite}.mglow{animation:neon 9s linear infinite}
.tip{fill:{red};animation:blink 2.4s steps(1) infinite}
.creature{fill:{creature}}
.drift1{animation:drift 80s ease-in-out infinite alternate}.drift2{animation:drift 130s ease-in-out infinite alternate-reverse}
.fly-a{animation:flya 30s linear infinite}.fly-b{animation:flyb 44s linear infinite}
.flap{animation:flap 1.2s ease-in-out infinite;transform-origin:0px 0px}
.hook{animation:hook 7s ease-in-out infinite}
.mote{fill:{mote};animation:{moteAnim} 16s linear infinite}
.lit{fill:{lit};animation:fire 1.8s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes neon{0%,8%,11%,60%,100%{opacity:{neonHi}}9%,10%{opacity:{neonLo}}62%,64%{opacity:{neonLo}}63%{opacity:{neonHi}}}
@keyframes blink{0%{opacity:1}50%{opacity:.15}}
@keyframes drift{from{transform:translate(-140px,0)}to{transform:translate(140px,0)}}
@keyframes flya{0%{transform:translate(-300px,300px)}50%{transform:translate(800px,170px)}100%{transform:translate(1900px,240px)}}
@keyframes flyb{0%{transform:translate(1900px,120px)}50%{transform:translate(820px,60px)}100%{transform:translate(-300px,150px)}}
@keyframes flap{0%,100%{transform:scale(1,1)}50%{transform:scale(1,-.4)}}
@keyframes hook{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes rise{0%{transform:translate(0,0);opacity:0}12%{opacity:{moteOp}}100%{transform:translate(150px,-260px);opacity:0}}
@keyframes fall{0%{transform:translate(0,0);opacity:0}12%{opacity:{moteOp}}100%{transform:translate(-90px,560px);opacity:0}}
@keyframes fire{0%,100%{opacity:.9}40%{opacity:.5}70%{opacity:1}}`

const DEFS = `<linearGradient id="usky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sa"/><stop offset=".55" class="sb"/><stop offset=".86" class="sc"/></linearGradient>
<radialGradient id="uglow"><stop offset="0" class="ga"/><stop offset="1" class="gb"/></radialGradient>
<radialGradient id="ucloud"><stop offset="0" class="ca"/><stop offset=".6" class="ca"/><stop offset="1" class="cb"/></radialGradient>
<radialGradient id="ucloudd"><stop offset="0" class="da"/><stop offset=".6" class="da"/><stop offset="1" class="db"/></radialGradient>
<radialGradient id="ustar"><stop offset="0" class="ra"/><stop offset="1" class="rb"/></radialGradient>
<radialGradient id="mglow"><stop offset="0" class="ra"/><stop offset="1" class="rb"/></radialGradient>
<radialGradient id="ufog"><stop offset="0" class="fa"/><stop offset="1" class="fb"/></radialGradient>`

function clouds(rand: () => number) {
  let a = ''
  let b = ''
  for (let i = 0; i < 8; i++) a += `<ellipse cx="${r1(rand() * 1700 - 50)}" cy="${r1(70 + rand() * 300)}" rx="${r1(260 + rand() * 280)}" ry="${r1(38 + rand() * 40)}"/>`
  for (let i = 0; i < 7; i++) b += `<ellipse cx="${r1(rand() * 1700 - 50)}" cy="${r1(160 + rand() * 360)}" rx="${r1(200 + rand() * 260)}" ry="${r1(26 + rand() * 30)}"/>`
  return `<g class="drift1" fill="url(#ucloudd)">${a}</g><g class="drift2" fill="url(#ucloud)">${b}</g>`
}

function skyline(rand: () => number) {
  let d = `M-20 1000`
  let wins = ''
  let x = -20
  while (x < 1640) {
    const w = 40 + rand() * 90
    const h = 50 + rand() * 150
    d += ` L${r1(x)} ${r1(STREET - 70 - h)} L${r1(x + w)} ${r1(STREET - 70 - h)}`
    for (let wy = STREET - 60 - h; wy < STREET - 80; wy += 18) for (let wx = x + 6; wx < x + w - 8; wx += 14) if (rand() > 0.55) wins += `M${r1(wx)} ${r1(wy)} h5 v8 h-5 Z `
    x += w
  }
  return `<path class="far1" d="${d} L1640 1000 Z"/><path class="farwin" d="${wins}"/>`
}

function tvTower() {
  return `<path class="far2" d="M296 ${STREET - 40} L350 ${STREET - 40} L330 470 L327 210 L325 70 L323 210 L320 470 Z M308 372 h36 v26 h-36 Z M314 300 h24 v14 h-24 Z M318 ${STREET - 40} l-30 0 l20 -80 Z M328 ${STREET - 40} l30 0 l-20 -80 Z"/><circle class="tip" cx="325" cy="68" r="4"/>`
}

function ground(rand: () => number) {
  let d = `M0 1000 L0 ${STREET + 40}`
  for (let q = 0; q <= 40; q++) d += ` L${q * 40} ${r1(STREET + 26 + rand() * 54 + (q % 7 === 0 ? -30 : 0))}`
  d += ` L1600 1000 Z`
  return `<path class="ground" d="${d}"/><path class="rebar" d="M1080 ${STREET + 40} l20 -46 m12 46 l30 -74 m14 74 l-6 -52 M240 ${STREET + 50} l-18 -60 m30 60 l10 -40"/>`
}

function particles(rand: () => number, n: number, light: boolean) {
  let s = ''
  for (let i = 0; i < n; i++) {
    const y = light ? rand() * 640 : 380 + rand() * 600
    s += `<circle class="mote" style="${timing(11 + rand() * 12, rand() * 22)}" cx="${r1(rand() * 1600)}" cy="${r1(y)}" r="${r1(1.2 + rand() * 2.2)}"/>`
  }
  return s
}

function surface(p: Palette, light: boolean) {
  const rand = seeded(light ? 71 : 67)
  const body = `<rect width="1600" height="1000" fill="url(#usky)"/>
<circle cx="${p.glowX}" cy="${p.glowY}" r="${p.glowR}" fill="url(#uglow)"/><circle class="sun" cx="${p.glowX}" cy="${p.glowY}" r="48"/>
${clouds(rand)}
${skyline(rand)}
${highrise(rand, 560, STREET - 40, 0.5, 'far2', 'farwin', 'ustar')}
${tvTower()}
${flyer('b', 0, 0.45, 44, 20)}
${highrise(rand, 1060, STREET - 20, 0.86, 'tower', 'towerwin', 'ustar')}
${block(rand, 30, 230, 340)}${block(rand, 700, 190, 250)}${block(rand, 1380, 250, 370)}
${crane()}
${block(rand, 1240, 130, 210)}
${wires()}
${pavilion(250)}
${trolleybus(930)}
<rect class="lit" x="1408" y="${STREET - 200}" width="14" height="18" style="${timing(1.8, 0.6)}"/>
<ellipse cx="800" cy="${STREET + 10}" rx="1100" ry="90" fill="url(#ufog)"/>
${ground(rand)}
${flyer('a', 0, 0.8, 30, 6)}
${particles(rand, light ? 70 : 46, light)}`
  return svg(fill(TPL, p), DEFS, body)
}

export const SCENE_SURFACE = surface(
  {
    skyA: '#040706', skyB: '#0d1914', skyC: '#33442b', glow: '#a8b85e', glowOp: 0.36, glowX: 1220, glowY: 760, glowR: 560,
    sunDisc: '#000000', sunOp: 0, cloud: '#1a2a20', cloudOp: 0.7, cloudDark: '#060a08', cloudDarkOp: 0.85,
    far1: '#101814', far2: '#0c130f', farWin: '#151f19', tower: '#09100c', towerWin: '#16211a',
    mid: '#0c1310', midWin: '#16201a', slab: '#09100c', crane: '#080d0a', near: '#050806', mouth: '#020302', col: '#0a110d',
    wire: '#050806', ground: '#040605', red: '#ff3a22', redGlow: 0.75, fog: '#4b6040', fogOp: 0.35, creature: '#020302',
    neonHi: 1, neonLo: 0.2, mote: '#a9bc7c', moteOp: 0.4, moteAnim: 'rise', lit: '#ff9a40',
  },
  false,
)

export const SCENE_ASH = surface(
  {
    skyA: '#e7e4dd', skyB: '#d6d2ca', skyC: '#c2beb5', glow: '#fbf8ef', glowOp: 0.9, glowX: 1190, glowY: 300, glowR: 380,
    sunDisc: '#fbf9f3', sunOp: 0.9, cloud: '#f4f2ed', cloudOp: 0.6, cloudDark: '#a9a59d', cloudDarkOp: 0.45,
    far1: '#b4b0a8', far2: '#a3a098', farWin: '#9c9890', tower: '#7b7872', towerWin: '#6a6761',
    mid: '#8d8a83', midWin: '#76736c', slab: '#7f7c75', crane: '#6a6762', near: '#57554f', mouth: '#3d3b38', col: '#6c6a64',
    wire: '#5d5b56', ground: '#4f4d49', red: '#b23a28', redGlow: 0.4, fog: '#efede8', fogOp: 0.7, creature: '#46443f',
    neonHi: 0.85, neonLo: 0.35, mote: '#6d6a64', moteOp: 0.55, moteAnim: 'fall', lit: '#c8702e',
  },
  true,
)
