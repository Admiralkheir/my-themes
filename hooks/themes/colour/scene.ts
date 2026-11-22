// The Colour Out of Space. A farm west of Arkham gone grey: dead trees whose branches move without wind, a barn and
// a house with dark windows, and in the yard the old well, out of which a colour that is no colour climbs into
// the sky. After Lovecraft's story and Richard Stanley's film, whose colour is magenta, the hue the spectrum lacks.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// `transform-origin` in positive px, durations and delays inline, no SMIL, no filters, no masks, no `var()` in a
// keyframe and no `@media` but the reduced-motion rule.

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

const GROUND = 720
const WX = 900
const WY = 790

// ---- Trees whose branches move -------------------------------------------------------------------------------------
type Swings = Set<number>
const swingName = (deg: number) => `b${Math.round(deg * 10)}`

function limb(x0: number, y0: number, x1: number, y1: number, w0: number, w1: number) {
  const a = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2
  const c = Math.cos(a)
  const s = Math.sin(a)
  return `M${r1(x0 - (c * w0) / 2)} ${r1(y0 - (s * w0) / 2)} L${r1(x1 - (c * w1) / 2)} ${r1(y1 - (s * w1) / 2)} L${r1(x1 + (c * w1) / 2)} ${r1(y1 + (s * w1) / 2)} L${r1(x0 + (c * w0) / 2)} ${r1(y0 + (s * w0) / 2)} Z`
}

function branch(rand: () => number, sw: Swings, x: number, y: number, len: number, ang: number, w: number, depth: number, live: boolean): string {
  // a slight crook halfway along
  const bend = (rand() - 0.5) * 22
  const mx = x + Math.sin(((ang + bend) * Math.PI) / 180) * len * 0.5
  const my = y - Math.cos(((ang + bend) * Math.PI) / 180) * len * 0.5
  const ex = mx + Math.sin((ang * Math.PI) / 180) * len * 0.5
  const ey = my - Math.cos((ang * Math.PI) / 180) * len * 0.5
  const wm = w * 0.82
  const we = Math.max(w * 0.62, 1.2)
  let s = `<path d="${limb(x, y, mx, my, w, wm)} ${limb(mx, my, ex, ey, wm, we)}"/><circle cx="${r1(mx)}" cy="${r1(my)}" r="${r1(wm / 2)}"/>`
  if (depth > 0) {
    const n = depth > 2 && rand() < 0.35 ? 3 : 2
    for (let i = 0; i < n; i++) {
      const spread = 18 + rand() * 30
      const a = ang + (n === 2 ? (i === 0 ? -spread : spread) : (i - 1) * spread * 1.1) + (rand() - 0.5) * 10
      s += branch(rand, sw, ex, ey, len * (0.62 + rand() * 0.16), a, we, depth - 1, live)
    }
  } else {
    // twigs, like claws
    for (let i = 0; i < 2; i++) {
      const a = ((ang + (i ? 30 : -30)) * Math.PI) / 180
      s += `<path d="${limb(ex, ey, ex + Math.sin(a) * 14, ey - Math.cos(a) * 14, 1.6, 0.6)}"/>`
    }
  }
  if (!live) return s
  const deg = Math.round((0.6 + (5 - depth) * 0.45 + rand() * 0.5) * 2) / 2
  const duration = r1(3.5 + rand() * 4)
  const delay = r1(rand() * 6)
  // A limb whose root is off the left edge moves only with the limb it grows from: every origin stays positive.
  if (x < 0) return s
  sw.add(deg)
  return `<g class="${swingName(deg)}" style="transform-origin:${r1(x)}px ${r1(y)}px;animation-duration:${duration}s;animation-delay:-${delay}s">${s}</g>`
}

const swings: Swings = new Set()
const TREES = [
  branch(seeded(5), swings, 120, 1020, 320, 6, 46, 4, true),
  branch(seeded(17), swings, 1490, 1020, 350, -8, 50, 4, true),
  branch(seeded(23), swings, 1230, GROUND + 26, 160, 4, 16, 3, true),
].join('')

function farTrees() {
  const rand = seeded(61)
  const sw: Swings = new Set()
  let s = ''
  for (let x = -20; x < 1640; x += 34 + rand() * 50) {
    if (x > 150 && x < 480) continue // the farm stands here
    const y = GROUND - 22 + rand() * 10
    s += branch(rand, sw, x, y, 46 + rand() * 50, (rand() - 0.5) * 14, 5, 2, false)
  }
  return s
}

const SWING_STYLE = [...swings]
  .sort((a, b) => a - b)
  .map(d => `.${swingName(d)}{animation:${swingName(d)} 5s ease-in-out infinite alternate}@keyframes ${swingName(d)}{from{transform:rotate(-${d}deg)}to{transform:rotate(${d}deg)}}`)
  .join('\n')

// ---- The farm ------------------------------------------------------------------------------------------------------
const FARM = `<g class="farm">
<path d="M170 ${GROUND + 6} L170 ${GROUND - 70} L188 ${GROUND - 112} L232 ${GROUND - 132} L276 ${GROUND - 112} L294 ${GROUND - 70} L294 ${GROUND + 6} Z"/>
<path d="M318 ${GROUND + 8} L318 ${GROUND - 78} L380 ${GROUND - 128} L442 ${GROUND - 78} L442 ${GROUND + 8} Z"/>
<rect x="414" y="${GROUND - 136}" width="12" height="40"/>
<path d="M300 ${GROUND - 34} L460 ${GROUND - 34} L466 ${GROUND - 26} L300 ${GROUND - 26} Z"/>
<rect x="310" y="${GROUND - 26}" width="4" height="30"/><rect x="452" y="${GROUND - 26}" width="4" height="30"/>
</g>
<rect class="farm-win" x="340" y="${GROUND - 70}" width="14" height="20"/><rect class="farm-win" x="404" y="${GROUND - 70}" width="14" height="20"/>
<rect class="farm-win" x="372" y="${GROUND - 112}" width="14" height="18"/>
<rect class="farm-glow" x="404" y="${GROUND - 70}" width="14" height="20"/>
<path class="farm-win" d="M210 ${GROUND + 6} L210 ${GROUND - 40} L254 ${GROUND - 40} L254 ${GROUND + 6} Z"/>
<path class="farm" d="M488 ${GROUND + 8} L488 ${GROUND - 160} L500 ${GROUND - 166} L512 ${GROUND - 160} L512 ${GROUND + 8} Z"/>
<g class="vane" style="transform-origin:500px ${GROUND - 166}px;animation-duration:9s"><path class="farm" d="M500 ${GROUND - 166} L470 ${GROUND - 190} L476 ${GROUND - 166} Z M500 ${GROUND - 166} L530 ${GROUND - 142} L524 ${GROUND - 166} Z M500 ${GROUND - 166} L476 ${GROUND - 136} L500 ${GROUND - 160} Z M500 ${GROUND - 166} L524 ${GROUND - 196} L500 ${GROUND - 172} Z"/></g>`

// ---- The well and what climbs out of it ----------------------------------------------------------------------------
const WELL = `<g class="stone"><path d="M${WX - 46} ${WY} L${WX - 46} ${WY + 46} C${WX - 46} ${WY + 58} ${WX + 46} ${WY + 58} ${WX + 46} ${WY + 46} L${WX + 46} ${WY} Z"/></g>
<path class="stone-line" d="M${WX - 46} ${WY + 14} C${WX - 20} ${WY + 22} ${WX + 20} ${WY + 22} ${WX + 46} ${WY + 14} M${WX - 46} ${WY + 30} C${WX - 20} ${WY + 38} ${WX + 20} ${WY + 38} ${WX + 46} ${WY + 30} M${WX - 30} ${WY + 2} L${WX - 30} ${WY + 18} M${WX + 8} ${WY + 6} L${WX + 8} ${WY + 22} M${WX - 10} ${WY + 22} L${WX - 10} ${WY + 38} M${WX + 30} ${WY + 22} L${WX + 30} ${WY + 38}"/>
<ellipse class="mouth" cx="${WX}" cy="${WY}" rx="46" ry="11"/><ellipse class="mouth-glow" cx="${WX}" cy="${WY}" rx="40" ry="8"/>
<g class="stone"><rect x="${WX - 52}" y="${WY - 92}" width="7" height="96"/><rect x="${WX + 45}" y="${WY - 92}" width="7" height="96"/><rect x="${WX - 58}" y="${WY - 98}" width="116" height="7"/></g>
<path class="rope" d="M${WX + 4} ${WY - 92} L${WX + 4} ${WY - 34}"/><path class="stone" d="M${WX - 6} ${WY - 34} L${WX + 14} ${WY - 34} L${WX + 11} ${WY - 18} L${WX - 3} ${WY - 18} Z"/>`

const COLUMN = `<g class="column" style="transform-origin:${WX}px ${WY}px"><polygon points="${WX - 38},${WY} ${WX + 38},${WY} ${WX + 210},0 ${WX - 210},0" fill="url(#col)"/></g>
<g class="column" style="transform-origin:${WX}px ${WY}px;animation-duration:7s;animation-delay:-3s"><polygon points="${WX - 16},${WY} ${WX + 16},${WY} ${WX + 70},0 ${WX - 70},0" fill="url(#col)"/></g>
<ellipse class="haze" cx="${WX}" cy="${WY - 20}" rx="520" ry="260" fill="url(#haze)" style="transform-origin:${WX}px ${WY - 20}px"/>`

function motes() {
  const rand = seeded(71)
  let s = ''
  for (let i = 0; i < 46; i++) {
    const x = WX + (rand() - 0.5) * 70
    const cls = ['m1', 'm2', 'm3', 'm4'][Math.floor(rand() * 4)]
    const k = rand() < 0.5 ? 'up1' : 'up2'
    s += `<circle class="mote ${cls} ${k}" cx="${r1(x)}" cy="${WY - 4}" r="${r1(1.4 + rand() * 3)}" style="animation-duration:${r1(9 + rand() * 12)}s;animation-delay:-${r1(rand() * 20)}s"/>`
  }
  return s
}

function crystals() {
  const rand = seeded(83)
  let s = ''
  const at = [-150, -112, -84, 70, 96, 128, 172, -196, 220]
  for (const dx of at) {
    const x = WX + dx + (rand() - 0.5) * 10
    const y = WY + 52 + rand() * 30
    const h = 18 + rand() * 34
    const lean = (rand() - 0.5) * 16
    s += `<path class="shard" d="M${r1(x - 6)} ${r1(y)} L${r1(x + lean - 2)} ${r1(y - h)} L${r1(x + lean + 3)} ${r1(y - h - 6)} L${r1(x + 7)} ${r1(y)} Z" style="animation-duration:${r1(4 + rand() * 4)}s;animation-delay:-${r1(rand() * 5)}s"/>`
  }
  return s
}

function grass() {
  const rand = seeded(97)
  let d = ''
  let dl = ''
  for (let i = 0; i < 420; i++) {
    const x = rand() * 1600
    const y = GROUND + 30 + Math.pow(rand(), 0.7) * 270
    const h = 6 + ((y - GROUND) / 280) * 22 * (0.5 + rand())
    const lean = (rand() - 0.5) * h * 0.8
    const seg = `M${r1(x)} ${r1(y)} q${r1(lean * 0.3)} ${r1(-h * 0.6)} ${r1(lean)} ${r1(-h)}`
    if (Math.abs(x - WX) < 260 && Math.abs(y - WY - 50) < 90) dl += seg
    else d += seg
  }
  return `<path class="grass" d="${d}"/><path class="grass-lit" d="${dl}"/>`
}

function stars() {
  const rand = seeded(3)
  let s = ''
  for (let i = 0; i < 70; i++) {
    s += `<circle class="star" cx="${r1(rand() * 1600)}" cy="${r1(rand() * 520)}" r="${r1(0.6 + rand() * 1.2)}" style="animation-duration:${r1(3 + rand() * 5)}s;animation-delay:-${r1(rand() * 6)}s"/>`
  }
  return s
}

function bands() {
  return [0, 1, 2]
    .map(i => {
      const y = 110 + i * 110
      const d = `M-200 ${y + 40} C200 ${y - 40} 500 ${y + 70} 900 ${y} C1200 ${y - 50} 1500 ${y + 50} 1800 ${y - 10} L1800 ${y + 50} C1500 ${y + 110} 1200 ${y + 10} 900 ${y + 60} C500 ${y + 130} 200 ${y + 20} -200 ${y + 100} Z`
      return `<path class="band" d="${d}" fill="url(#band)" style="animation-duration:${30 + i * 11}s;animation-delay:-${i * 9}s"/>`
    })
    .join('')
}

const TPL = `
.sky-a{stop-color:{skyA}}.sky-b{stop-color:{skyB}}.sky-c{stop-color:{skyC}}
.gr-a{stop-color:{grA}}.gr-b{stop-color:{grB}}
.col-a{stop-color:{c};stop-opacity:{colOp}}.col-b{stop-color:{c};stop-opacity:0}
.haze-a{stop-color:{c};stop-opacity:{hazeOp}}.haze-b{stop-color:{c};stop-opacity:0}
.band-a{stop-color:{c};stop-opacity:0}.band-m{stop-color:{c2};stop-opacity:{bandOp}}
.star{fill:{star};opacity:.2;animation:twinkle 5s ease-in-out infinite alternate}
.hill{fill:{hill}}.far{fill:{far}}
.farm{fill:{farm}}.farm-win{fill:{farmWin}}.farm-glow{fill:{c};opacity:0;animation:glow 13s ease-in-out infinite}
.vane{animation:vane 9s ease-in-out infinite alternate}
.tree{fill:{tree}}
.stone{fill:{stone}}.stone-line{fill:none;stroke:{stoneLine};stroke-width:1.5}.rope{stroke:{stone};stroke-width:2}
.mouth{fill:{mouth}}.mouth-glow{fill:{c};animation:pulse 5s ease-in-out infinite}
.column{animation:column 9s ease-in-out infinite}
.haze{animation:haze 12s ease-in-out infinite}
.band{animation:band 30s ease-in-out infinite alternate}
.mote{opacity:0}.m1{fill:{c}}.m2{fill:{c2}}.m3{fill:{c3}}.m4{fill:{c4}}
.up1{animation:up1 14s linear infinite}.up2{animation:up2 14s linear infinite}
.shard{fill:{shard};animation:shard 6s ease-in-out infinite}
.grass{fill:none;stroke:{grass};stroke-width:1.3}.grass-lit{fill:none;stroke:{c};stroke-width:1.3;opacity:{grassLit}}
${'{SWING}'}
@keyframes twinkle{from{opacity:.1}to{opacity:.7}}
@keyframes glow{0%,60%,100%{opacity:0}70%,80%{opacity:{winGlow}}}
@keyframes vane{from{transform:rotate(-40deg)}to{transform:rotate(30deg)}}
@keyframes pulse{0%,100%{opacity:{mouthLo}}50%{opacity:{mouthHi}}}
@keyframes column{0%,100%{opacity:.55;transform:scale(.92,1)}50%{opacity:1;transform:scale(1.08,1)}}
@keyframes haze{0%,100%{opacity:.6;transform:scale(.95)}50%{opacity:1;transform:scale(1.06)}}
@keyframes band{0%{opacity:.2;transform:translate(-80px,0)}50%{opacity:1}100%{opacity:.35;transform:translate(80px,-10px)}}
@keyframes up1{0%{opacity:0;transform:translate(0,0)}8%{opacity:{moteOp}}50%{transform:translate(40px,-380px)}85%{opacity:{moteOp}}100%{opacity:0;transform:translate(-10px,-790px)}}
@keyframes up2{0%{opacity:0;transform:translate(0,0)}8%{opacity:{moteOp}}50%{transform:translate(-50px,-400px)}85%{opacity:{moteOp}}100%{opacity:0;transform:translate(20px,-790px)}}
@keyframes shard{0%,100%{opacity:.55}50%{opacity:1}}`

const DEFS = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".65" class="sky-b"/><stop offset="1" class="sky-c"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="gr-a"/><stop offset="1" class="gr-b"/></linearGradient>
<linearGradient id="col" x1="0" y1="1" x2="0" y2="0"><stop offset="0" class="col-a"/><stop offset="1" class="col-b"/></linearGradient>
<radialGradient id="haze"><stop offset="0" class="haze-a"/><stop offset="1" class="haze-b"/></radialGradient>
<linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="band-a"/><stop offset=".5" class="band-m"/><stop offset="1" class="band-a"/></linearGradient>`

const BODY = `<rect width="1600" height="1000" fill="url(#sky)"/>
${stars()}${bands()}
<path class="hill" d="M0 ${GROUND - 40} C200 ${GROUND - 90} 420 ${GROUND - 70} 640 ${GROUND - 50} C860 ${GROUND - 30} 1100 ${GROUND - 100} 1340 ${GROUND - 80} C1460 ${GROUND - 70} 1540 ${GROUND - 60} 1600 ${GROUND - 66} L1600 ${GROUND + 40} L0 ${GROUND + 40} Z"/>
<g class="far">${farTrees()}</g>
<rect y="${GROUND}" width="1600" height="${1000 - GROUND}" fill="url(#gr)"/>
${FARM}
${grass()}
${COLUMN}
${crystals()}
${WELL}
${motes()}
<g class="tree">${TREES}</g>`

export function colour(p: Record<string, string | number>) {
  return svg(fill(TPL.replace('{SWING}', SWING_STYLE), p), DEFS, BODY)
}

export const SCENE_NIGHT = colour({
  skyA: '#07060c', skyB: '#160d1c', skyC: '#2a1430', grA: '#17121a', grB: '#08070a',
  c: '#ff3fbf', c2: '#c04dff', c3: '#5ff2d0', c4: '#ff9ae0', colOp: 0.5, hazeOp: 0.3, bandOp: 0.16,
  star: '#e7dcff', hill: '#110c15', far: '#0d0a10', farm: '#09070b', farmWin: '#141017', winGlow: 0.7,
  tree: '#050406', stone: '#1c1720', stoneLine: '#0a080c', mouth: '#060507', mouthLo: 0.5, mouthHi: 1,
  shard: '#8a5ca8', grass: '#2a2430', grassLit: 0.6, moteOp: 0.95,
})

export const SCENE_BLIGHT = colour({
  skyA: '#d9d4d9', skyB: '#e6e1e4', skyC: '#efe7ec', grA: '#c4bec2', grB: '#aaa4a9',
  c: '#d81b8c', c2: '#9b3fd1', c3: '#2fa98d', c4: '#e26bb5', colOp: 0.32, hazeOp: 0.16, bandOp: 0.12,
  star: '#ffffff', hill: '#c6c0c5', far: '#a49ea3', farm: '#7c757b', farmWin: '#5e575d', winGlow: 0.5,
  tree: '#5f5860', stone: '#837b82', stoneLine: '#625a61', mouth: '#4b444a', mouthLo: 0.35, mouthHi: 0.8,
  shard: '#b07ac8', grass: '#8f888e', grassLit: 0.55, moteOp: 0.8,
})
