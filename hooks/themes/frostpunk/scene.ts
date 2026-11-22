// The last city, at night in a blizzard: a crater in the ice with the city laid in
// rings around its great generator. A low cloud deck glows from beneath with the
// city's light; the furnace core breathes, smoke and embers roll from the stack
// and lean away on the wind, warm windows spill light onto the snow, gusts sweep
// across the bowl and, now and then, a steam walker strides along the far rim.
//
// Made for a dark window: a steel-blue night where the only warmth is the
// furnace's amber. Depth comes from haze laid between the layers, so far things
// fade toward the horizon's grey as they would in falling snow.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS
// keyframes with literal values, `transform-origin` in positive px, durations and
// delays inline, no SMIL, no filters, no masks, no `var()` in a keyframe and no
// `@media` but the reduced-motion rule.

const r1 = (n: number) => Math.round(n * 10) / 10
const P = (x: number, y: number) => `${r1(x)} ${r1(y)}`

// A fixed sequence in place of Math.random, so the scene is the same string every time.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seeded(1886)

// A smooth wobble around a ring, so the crater's terraces are not drawn with a compass.
function wobble(seed: number) {
  const r = seeded(seed)
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28]
  return (a: number) => Math.sin(a * 3 + ph[0]!) * 0.5 + Math.sin(a * 7 + ph[1]!) * 0.3 + Math.sin(a * 13 + ph[2]!) * 0.2
}

const GX = 800 // the generator's axis
const GY = 725 // the crater's center, where the generator stands

// ---- Sky ---------------------------------------------------------------------------------------------------------
// A low overcast lit from below by the city, and bands of cloud drifting across it.

const CLOUDS: [cx: number, cy: number, rx: number, ry: number, fill: string, period: number, delay: number][] = [
  [300, 120, 700, 90, 'cl-d', 90, 0], [1250, 90, 760, 100, 'cl-d', 110, 30], [820, 210, 820, 80, 'cl-w', 80, 50],
  [200, 300, 600, 60, 'cl-w', 100, 15], [1350, 280, 620, 70, 'cl-w', 95, 65], [760, 40, 900, 70, 'cl-d', 120, 40],
]
const clouds = CLOUDS.map(
  ([cx, cy, rx, ry, fill, period, delay]) =>
    `<ellipse class="cloud" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${fill})" style="animation-duration:${period}s;animation-delay:-${delay}s"/>`,
).join('')

const SKY = `<rect width="1600" height="1000" fill="url(#sky)"/>
<ellipse cx="${GX}" cy="300" rx="1000" ry="420" fill="url(#cityglow)"/>
<g>${clouds}</g>
<ellipse cx="800" cy="500" rx="1100" ry="150" fill="url(#horizon)"/>`

// ---- Mountains ----------------------------------------------------------------------------------------------------
// A ridge of peaks, each with its lee face in shadow and snow along the crest; the far range sits behind haze.

function range(seed: number, base: number, top: number, step: number, fill: string, shade: string, crest: string): string {
  const r = seeded(seed)
  const pts: [number, number][] = []
  for (let x = -40; x <= 1640; x += step * (0.6 + r() * 0.8)) {
    pts.push([x, top + r() * (base - top) * 0.85])
  }
  const ridge = `M-40 ${base + 40} L${pts.map(([x, y]) => P(x, y)).join(' L')} L1640 ${base + 40} Z`
  let shadows = ''
  let crests = ''
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i]!
    const [vx, vy] = pts[i + 1]!
    const [lx, ly] = pts[i - 1]!
    if (py < ly && py < vy) {
      // A peak: its right face falls into shadow, down to a fold below the peak.
      const fx = px + (vx - px) * 0.18
      const fy = py + (base - py) * 0.75
      shadows += `M${P(px, py)} L${P(vx, vy)} L${P(vx, base + 40)} L${P(fx, base + 40)} L${P(fx, fy)} Z`
      crests += `M${P(px + (lx - px) * 0.35, py + (ly - py) * 0.35)} L${P(px, py)} L${P(px + (vx - px) * 0.25, py + (vy - py) * 0.25)}`
    }
  }
  return `<path fill="${fill}" d="${ridge}"/><path fill="${shade}" d="${shadows}"/><path class="crest" stroke="${crest}" d="${crests}"/>`
}

const MOUNTAINS = `${range(7, 500, 340, 80, '#2c3d50', '#223143', '#5d7891')}
<rect y="300" width="1600" height="230" fill="url(#hazeband)"/>
${range(11, 525, 440, 70, '#25354a', '#1b2838', '#4f6982')}
<rect class="plateau" y="512" width="1600" height="488"/>
<path class="drift" d="M0 530 C200 522 380 536 560 528 M1040 528 C1220 520 1400 534 1600 524 M60 548 C240 540 420 552 600 546 M1000 546 C1180 538 1360 550 1560 542"/>`

// ---- The crater -----------------------------------------------------------------------------------------------------
// Terraces stepping down to the floor, each a wobbling ring with a snow lip and, under it on the far side, rock
// showing through where the wall is too steep for snow to hold.

const TERRACES: [rx: number, ry: number, fill: string][] = [
  [900, 215, '#3a4d61'], [770, 182, '#324458'], [640, 150, '#2d3e51'],
  [510, 120, '#29384a'], [380, 90, '#263445'], [250, 60, '#243141'],
]

const crater = TERRACES.map(([rx, ry, fill], t) => {
  const n = wobble(100 + t)
  const at = (a: number): [number, number] => [
    GX + rx * (1 + 0.022 * n(a)) * Math.cos(a),
    GY + ry * (1 + 0.05 * n(a)) * Math.sin(a),
  ]
  const ring: string[] = []
  const lip: string[] = []
  for (let k = 0; k <= 64; k++) {
    const a = (k / 64) * Math.PI * 2
    const [x, y] = at(a)
    const pt = `${Math.round(x)} ${Math.round(y)}`
    ring.push(pt)
    if (a >= Math.PI) {
      lip.push(pt)
    }
  }
  let rocks = ''
  const r = seeded(300 + t)
  for (let k = 0; k < (t < 3 ? 34 : 0); k++) {
    const [x, y] = at(Math.PI * (1.04 + r() * 0.92))
    const len = (4 + r() * 12) * (ry / 215 + 0.4)
    const lean = ((GX - x) / rx) * len * 0.5
    rocks += `M${Math.round(x)} ${Math.round(y + 3)}l${Math.round(lean)} ${Math.round(len)}`
  }
  return `<path fill="${fill}" d="M${ring.join(' L')} Z"/><path class="rock" d="${rocks}"/><path class="lip" d="M${lip.join(' L')}"/>`
}).join('')

// ---- The city ----------------------------------------------------------------------------------------------------
// Rings of cabins around the generator, broken by six streets. Each cabin is seen from three-quarters: a gable
// end toward the viewer, a long wall toward the generator that its light warms, and a roof deep in snow.

const RINGS: [rx: number, ry: number][] = [
  [205, 50], [330, 80], [455, 109], [580, 139], [705, 168],
]
const STREETS = [30, 90, 150, 210, 270, 330] // degrees, where no cabin stands

type House = { x: number; y: number; s: number; side: 1 | -1; lit: boolean; flicker: number; chimney: boolean }
const houses: House[] = []
RINGS.forEach(([rx, ry], ring) => {
  const count = Math.round(rx / 15)
  for (let i = 0; i < count; i++) {
    const deg = (i / count) * 360 + ring * 7
    if (STREETS.some(s => Math.abs(((deg - s + 540) % 360) - 180) < 8)) {
      continue
    }
    const a = (deg * Math.PI) / 180
    const x = GX + rx * Math.cos(a) + (rand() - 0.5) * 6
    const y = GY + ry * Math.sin(a) - 4
    if (x < -30 || x > 1630) {
      continue
    }
    houses.push({
      x,
      y,
      s: 0.5 + (y - 520) / 440,
      side: x < GX ? 1 : -1,
      lit: rand() < 0.8,
      flicker: rand() < 0.16 ? rand() * 12 : -1,
      chimney: rand() < 0.35,
    })
  }
})

// Where a cabin's chimney stands, so its smoke can rise from there.
const chimneyAt = (h: House): [number, number] => {
  const dx = 11 * h.s * h.side
  return [h.x + dx * 0.6, h.y - 9 * h.s - 3.5 * h.s - 5 * h.s * 0.6]
}

function house(h: House): string {
  const { x, y, s, side } = h
  const w = 15 * s // gable end
  const dx = 11 * s * side // the long wall recedes toward the generator
  const dy = -5 * s
  const wh = 9 * s
  const rh = 7 * s
  const x0 = x - w / 2
  const x1 = x + w / 2
  const xe = side > 0 ? x1 : x0 // the corner where the long wall starts
  const yt = y - wh
  const ov = 1.6 * s * side
  const front = `M${P(x0, y)} L${P(x1, y)} L${P(x1, yt)} L${P(x, yt - rh)} L${P(x0, yt)} Z`
  const wall = `M${P(xe, y)} L${P(xe + dx, y + dy)} L${P(xe + dx, yt + dy)} L${P(xe, yt)} Z`
  const roof = `M${P(x, yt - rh)} L${P(x + dx, yt - rh + dy)} L${P(xe + dx + ov, yt + dy + 1.2 * s)} L${P(xe + ov, yt + 1.2 * s)} Z`
  const eave = `M${P(xe + ov, yt + 1.2 * s)} L${P(xe + dx + ov, yt + dy + 1.2 * s)}`
  const gable = `M${P(x0 - 0.8 * s, yt + 0.6 * s)} L${P(x, yt - rh - 0.6 * s)} L${P(x1 + 0.8 * s, yt + 0.6 * s)}`
  let out = '<g>'
  if (h.lit) {
    out += `<ellipse class="pool" cx="${r1(x)}" cy="${r1(y + 3 * s)}" rx="${r1(16 * s)}" ry="${r1(5 * s)}"/>`
  }
  out += `<path class="hf" d="${front}"/><path class="hw" d="${wall}"/>`
  if (h.chimney) {
    const [cx, cy] = chimneyAt(h)
    out += `<rect class="hf" x="${r1(cx - 1.4 * s)}" y="${r1(cy - 3 * s)}" width="${r1(2.8 * s)}" height="${r1(6 * s)}"/>`
  }
  out += `<path class="hr" d="${roof}"/><path class="he" d="${eave}"/><path class="hc hg" d="${gable}"/>`
  if (h.lit) {
    const ww = 3.4 * s
    const cls = h.flicker >= 0 ? 'win flick' : 'win'
    const delay = h.flicker >= 0 ? ` style="animation-delay:-${r1(h.flicker)}s"` : ''
    out += `<rect class="${cls}"${delay} x="${r1(x - ww / 2)}" y="${r1(y - wh * 0.72)}" width="${r1(ww)}" height="${r1(ww * 1.2)}"/>`
  }
  return `${out}</g>`
}

const byDepth = (a: House, b: House) => a.y - b.y
const HOUSES_FAR = houses.filter(h => h.y < GY - 4).sort(byDepth).map(house).join('')
const HOUSES_NEAR = houses.filter(h => h.y >= GY - 4).sort(byDepth).map(house).join('')

// Smoke from a few cabin chimneys: thin wisps, all on one keyframe.
const wisps = houses
  .filter(h => h.chimney && h.lit)
  .filter((_, i) => i % 3 === 0)
  .map((h, i) => {
    const [cx, cy] = chimneyAt(h)
    const x = r1(cx)
    const y = r1(cy - 4 * h.s)
    return `<circle class="wisp" cx="${x}" cy="${y}" r="${r1(3 * h.s)}" fill="url(#steam)" style="transform-origin:${x}px ${y}px;animation-duration:${7 + (i % 4)}s;animation-delay:-${r1((i * 1.7) % 9)}s"/>`
  })
  .join('')

// The streets run out from the generator, warm from the heat pipes beneath them.
const streets = STREETS.map(deg => {
  const a = (deg * Math.PI) / 180
  const [rx, ry] = RINGS[RINGS.length - 1]!
  return `M${GX} ${GY} L${P(GX + (rx + 60) * Math.cos(a), GY + (ry + 15) * Math.sin(a))}`
}).join(' ')
const ringRoads = RINGS.map(([rx, ry]) => `<ellipse cx="${GX}" cy="${GY + 2}" rx="${rx + 14}" ry="${ry + 4}"/>`).join('')

// ---- The generator -------------------------------------------------------------------------------------------------
// Iron shaded as a round tower, lit warm from its own core below and cold from the sky above.

const STRUTS_FAR = `<path class="strut" d="M${GX - 30} 430 L${GX - 112} 700 M${GX + 30} 430 L${GX + 112} 700"/>`
const STRUTS_NEAR = `<path class="strut" d="M${GX - 44} 480 L${GX - 178} 742 M${GX + 44} 480 L${GX + 178} 742"/>
<path class="strut-hi" d="M${GX - 40} 482 L${GX - 173} 742 M${GX + 48} 482 L${GX + 182} 742"/>
<path class="snow-edge" d="M${GX - 44} 478 L${GX - 178} 740 M${GX + 44} 478 L${GX + 178} 740" style="opacity:.35"/>`

const BANDS = [530, 470, 412, 356, 300]
const halfAt = (y: number) => 42 + ((y - 300) / 230) * 10 // the shaft narrows upward
let lattice = ''
for (let i = 0; i < BANDS.length - 1; i++) {
  const y0 = BANDS[i]!
  const y1 = BANDS[i + 1]!
  lattice += ` M${P(GX - halfAt(y0), y0)} L${P(GX + halfAt(y1), y1)} M${P(GX + halfAt(y0), y0)} L${P(GX - halfAt(y1), y1)}`
}
// Catwalks around the shaft: a deck, a rail and posts, the front half drawn over the shaft.
const catwalks = [470, 356]
  .map(y => {
    const rx = halfAt(y) + 16
    const posts = [-0.9, -0.5, 0, 0.5, 0.9].map(f => `M${P(GX + rx * f, y + 6 * Math.sqrt(1 - f * f))} l0 -9`).join(' ')
    return (
      `<path class="deck" d="M${P(GX - rx, y)} A${r1(rx)} 6 0 0 0 ${P(GX + rx, y)} L${P(GX + rx, y + 3)} A${r1(rx)} 6 0 0 1 ${P(GX - rx, y + 3)} Z"/>` +
      `<path class="rail" d="M${P(GX - rx, y - 9)} A${r1(rx)} 6 0 0 0 ${P(GX + rx, y - 9)} ${posts}"/>` +
      `<path class="snow-edge" d="M${P(GX - rx, y - 0.5)} A${r1(rx)} 6 0 0 0 ${P(GX + rx, y - 0.5)}" style="opacity:.6"/>`
    )
  })
  .join('')
const bands = BANDS.map(y => `M${P(GX - halfAt(y) - 3, y)} L${P(GX + halfAt(y) + 3, y)}`).join(' ')
const bandSnow = BANDS.map(y => `M${P(GX - halfAt(y) - 3, y - 2)} L${P(GX + halfAt(y) + 3, y - 2)}`).join(' ')
const rivets = BANDS.flatMap(y => [-0.75, -0.4, 0, 0.4, 0.75].map(f => `M${P(GX + halfAt(y) * f, y + 4)}h.1`)).join('')

const LAMPS: [x: number, y: number, delay: number][] = [
  [GX - 30, 500, 0], [GX + 30, 444, 1.3], [GX - 26, 386, 2.4], [GX + 26, 330, 0.7], [GX, 268, 1.9],
]
const lamps = LAMPS.map(([x, y, d]) => `<circle class="lamp" cx="${x}" cy="${y}" r="2.4" style="animation-delay:-${d}s"/>`).join('')

// Portholes along the base, lit from the furnace inside.
const portholes = [-74, -50, 50, 74].map(dx => `<circle class="port" cx="${GX + dx}" cy="712" r="4"/>`).join('')

// Pipes from the base out along the streets, frosted on top.
const PIPES = `<path class="pipe" d="M${GX - 120} 730 C${GX - 200} 736 ${GX - 260} 748 ${GX - 330} 770 M${GX + 120} 730 C${GX + 200} 736 ${GX + 260} 748 ${GX + 330} 770"/>
<path class="pipe-top" d="M${GX - 120} 727 C${GX - 200} 733 ${GX - 260} 745 ${GX - 330} 767 M${GX + 120} 727 C${GX + 200} 733 ${GX + 260} 745 ${GX + 330} 767"/>`

const CORE_Y = 615
const grille = [0, 30, 60, 90, 120, 150]
  .map(deg => {
    const a = (deg * Math.PI) / 180
    const dx = Math.cos(a) * 34
    const dy = Math.sin(a) * 34
    return `M${P(GX - dx, CORE_Y - dy)} L${P(GX + dx, CORE_Y + dy)}`
  })
  .join(' ')

const BODY = `M${GX - 88} 690 L${GX - 72} 530 L${GX + 72} 530 L${GX + 88} 690 Z`

const GENERATOR = `${STRUTS_FAR}
<ellipse class="core-glow" cx="${GX}" cy="745" rx="260" ry="46" fill="url(#coreglow)"/>
<path fill="url(#ironcyl)" d="M${GX - 140} 744 L${GX - 112} 690 L${GX + 112} 690 L${GX + 140} 744 Z"/>
<path class="steps" d="M${GX - 30} 744 L${GX - 24} 726 L${GX + 24} 726 L${GX + 30} 744 M${GX - 28} 738 L${GX + 28} 738 M${GX - 26} 732 L${GX + 26} 732"/>
<ellipse class="plate" cx="${GX}" cy="690" rx="112" ry="9"/>
<path class="snow-edge" d="M${GX - 112} 689 A112 9 0 0 1 ${GX + 112} 689"/>
${portholes}
<path fill="url(#ironcyl)" d="${BODY}"/>
<path fill="url(#warmface)" d="${BODY}"/>
<path class="rib" d="M${GX - 60} 690 L${GX - 50} 530 M${GX - 30} 690 L${GX - 25} 530 M${GX + 30} 690 L${GX + 25} 530 M${GX + 60} 690 L${GX + 50} 530"/>
<path fill="url(#ironcyl)" d="M${GX - 52} 530 L${GX - 42} 300 L${GX + 42} 300 L${GX + 52} 530 Z"/>
<path class="rib" d="${lattice}"/>
<path class="band" d="${bands}"/>
<path class="rivet" d="${rivets}"/>
<path class="snow-edge" d="${bandSnow}"/>
${catwalks}
<path fill="url(#ironcyl)" d="M${GX - 70} 300 L${GX + 70} 300 L${GX + 58} 284 L${GX - 58} 284 Z"/>
<path fill="url(#ironcyl)" d="M${GX - 38} 284 L${GX - 30} 232 L${GX + 30} 232 L${GX + 38} 284 Z"/>
<rect class="iron-d" x="${GX - 40}" y="222" width="80" height="11"/>
<path class="snow-edge" d="M${GX - 70} 299 L${GX + 70} 299 M${GX - 58} 283.5 L${GX + 58} 283.5 M${GX - 40} 221.5 L${GX + 40} 221.5"/>
<circle class="core-glow" cx="${GX}" cy="${CORE_Y}" r="220" fill="url(#coreglow)"/>
<circle class="iron-d" cx="${GX}" cy="${CORE_Y}" r="52"/>
<circle class="core" cx="${GX}" cy="${CORE_Y}" r="37" fill="url(#core)"/>
<circle class="core-hot" cx="${GX}" cy="${CORE_Y}" r="19"/>
<path class="grille" d="${grille}"/>
<circle class="ring" cx="${GX}" cy="${CORE_Y}" r="44"/>
<path class="ring-hi" d="M${GX - 44} ${CORE_Y} A44 44 0 0 1 ${GX + 44} ${CORE_Y}"/>
${lamps}
${STRUTS_NEAR}`

const STACK_GLOW = `<ellipse class="stack-glow" cx="${GX}" cy="216" rx="110" ry="56" fill="url(#coreglow)"/>`

// ---- Smoke and embers -------------------------------------------------------------------------------------------------
// Puffs rise from a stack, swell and lean away on the wind, then fade. Each stream names its keyframe with its
// distance written out, so every keyframe holds only literal values.

const smokeStyles: string[] = []
function smoke(name: string, x: number, y: number, r: number, count: number, period: number, dx: number, dy: number, grow: number, peak: number, fill = 'smoke'): string {
  smokeStyles.push(
    `.${name}{opacity:0;animation:${name} 10s linear infinite}` +
      `@keyframes ${name}{0%{transform:translate(0,0) scale(.45);opacity:0}8%{opacity:${peak}}` +
      `60%{opacity:${r1(peak * 0.6)}}100%{transform:translate(${dx}px,${dy}px) scale(${grow});opacity:0}}`,
  )
  let out = ''
  for (let i = 0; i < count; i++) {
    const j = 1 + ((i * 7) % 5) / 10 // puffs of a few sizes, so the column billows
    out += `<circle class="${name}" cx="${x}" cy="${y}" r="${r1(r * j)}" fill="url(#${fill})" style="transform-origin:${x}px ${y}px;animation-duration:${period}s;animation-delay:-${r1((i * period) / count)}s"/>`
  }
  return out
}

// The main column is the city's own smoke, lit from beneath by its glow, so it reads against the night sky.
const SMOKE_MAIN =
  smoke('rise0', GX, 214, 50, 20, 30, 600, -380, 4.4, 0.95, 'smokelit') +
  // The column's foot, lit by the fire in the stack, fading as it leaves the light.
  smoke('rise6', GX, 214, 30, 6, 7, 120, -110, 2.4, 0.75, 'smokewarm')
const SMOKE_FACTORIES =
  smoke('rise1', 352, 512, 15, 6, 14, 190, -160, 3.2, 0.85) +
  smoke('rise2', 1268, 520, 14, 6, 13, 180, -150, 3.2, 0.85) +
  smoke('rise3', 1306, 530, 11, 5, 12, 150, -130, 3, 0.75)
const STEAM =
  smoke('rise4', GX - 100, 690, 10, 4, 6, -60, -90, 2.6, 0.35, 'steam') +
  smoke('rise5', GX + 100, 690, 10, 4, 7, 50, -100, 2.6, 0.35, 'steam')

const EMBERS = Array.from({ length: 10 }, (_, i) => {
  const x = GX - 14 + ((i * 11) % 28)
  return `<circle class="ember" cx="${x}" cy="222" r="${i % 3 === 0 ? 1.8 : 1.2}" style="animation-duration:${r1(3.2 + (i % 4) * 0.7)}s;animation-delay:-${r1(i * 0.53)}s"/>`
}).join('')

// ---- Industry on the crater's edge ----------------------------------------------------------------------------------

const FACTORIES = `<ellipse class="pool" cx="340" cy="598" rx="70" ry="8"/><ellipse class="pool" cx="1276" cy="606" rx="70" ry="8"/>
<path class="bldg" d="M290 596 L290 556 L310 544 L310 556 L330 544 L330 556 L350 544 L350 556 L370 544 L370 556 L392 544 L392 596 Z"/>
<rect class="bldg" x="344" y="512" width="16" height="50"/>
<rect class="win" x="300" y="572" width="5" height="6"/><rect class="win flick" style="animation-delay:-4s" x="322" y="572" width="5" height="6"/><rect class="win" x="366" y="572" width="5" height="6"/>
<path class="hc" style="stroke-width:1.5" d="M290 556 L310 544 M310 556 L330 544 M330 556 L350 544 M350 556 L370 544 M370 556 L392 544 M344 512 L360 512"/>
<path class="bldg" d="M1214 604 L1214 560 L1290 560 L1290 548 L1340 548 L1340 604 Z"/>
<rect class="bldg" x="1261" y="520" width="14" height="44"/><rect class="bldg" x="1300" y="530" width="12" height="22"/>
<rect class="win" x="1226" y="576" width="5" height="7"/><rect class="win" x="1244" y="576" width="5" height="7"/><rect class="win flick" style="animation-delay:-8s" x="1318" y="568" width="5" height="7"/>
<path class="hc" style="stroke-width:1.5" d="M1214 560 L1290 560 M1290 548 L1340 548 M1261 520 L1275 520"/>`

// ---- The walker --------------------------------------------------------------------------------------------------------
// A steam automaton on four long legs, small with distance, walking the far rim from right to left with its lamp
// thrown on the snow ahead. Every leg swings about its hip, the pairs half a stride apart.

const WX = 1720
const WY = 520 // where its feet fall
const HIP_Y = WY - 34
const leg = (hx: number, out: number, d: number, cls: string) =>
  `<path class="${cls}" style="transform-origin:${hx}px ${HIP_Y}px;animation-delay:-${d}s" d="M${hx} ${HIP_Y} L${hx + out} ${HIP_Y + 12} L${hx + out * 0.4} ${WY}"/>`
const WALKER = `<g class="walk" style="animation-duration:150s;animation-delay:-40s">
<path class="beam" d="M${WX - 13} ${HIP_Y - 6} L${WX - 70} ${WY + 4} L${WX - 30} ${WY + 6} Z"/>
${leg(WX - 10, -9, 0, 'leg leg-far')}${leg(WX + 10, 9, 0.9, 'leg leg-far')}
<rect class="w-body" x="${WX - 17}" y="${HIP_Y - 13}" width="34" height="15" rx="3"/>
<rect class="w-body" x="${WX + 6}" y="${HIP_Y - 22}" width="5" height="10"/>
<path class="hc" style="stroke-width:1.4" d="M${WX - 16} ${HIP_Y - 13.5} L${WX + 16} ${HIP_Y - 13.5}"/>
<circle class="w-eye" cx="${WX - 13}" cy="${HIP_Y - 6}" r="2.2"/>
<circle class="w-beam" cx="${WX - 13}" cy="${HIP_Y - 6}" r="12" fill="url(#lampglow)"/>
${leg(WX - 12, -11, 0.9, 'leg')}${leg(WX + 12, 11, 0, 'leg')}
</g>`

// ---- Snow ----------------------------------------------------------------------------------------------------------------
// Three layers of flakes streaked by the wind, each one path, and a copy above it, falling slantwise and
// starting over seamlessly.

function snowLayer(count: number, len: number, cls: string): string {
  let tile = ''
  for (let i = 0; i < count; i++) {
    const l = len * (0.5 + rand())
    tile += `M${Math.round(rand() * 2200)} ${Math.round(rand() * 1000)}l${r1(-l * 0.6)} ${r1(l)}`
  }
  return `<g class="snow ${cls}"><path d="${tile}"/><path transform="translate(600 -1000)" d="${tile}"/></g>`
}
const SNOW_FAR = snowLayer(280, 2.5, 'snow-far')
const SNOW_MID = snowLayer(140, 5, 'snow-mid')
const SNOW_NEAR = snowLayer(40, 9, 'snow-near')

const GUSTS: [cx: number, cy: number, rx: number, ry: number, period: number, delay: number][] = [
  [900, 640, 520, 26, 17, 0], [600, 760, 640, 34, 21, 7], [1100, 470, 560, 30, 25, 14],
  [700, 880, 700, 40, 19, 4], [1000, 320, 600, 36, 29, 19], [400, 560, 500, 24, 23, 11],
]
const gusts = GUSTS.map(
  ([cx, cy, rx, ry, period, delay]) =>
    `<ellipse class="gust" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#gust)" style="animation-duration:${period}s;animation-delay:-${delay}s"/>`,
).join('')

// ---- The near snowbanks ------------------------------------------------------------------------------------------------

const BANKS = `<path fill="url(#bank)" d="M0 1000 L0 840 C90 820 180 850 260 900 C320 936 380 962 470 1000 Z"/>
<path fill="url(#bank)" d="M1600 1000 L1600 820 C1500 806 1410 840 1340 890 C1280 930 1220 960 1120 1000 Z"/>
<path class="sastrugi" d="M20 880 C90 866 160 880 220 912 M40 930 C120 914 200 930 270 966 M1580 862 C1500 852 1430 872 1380 904 M1560 920 C1480 908 1400 930 1340 970"/>
<path class="bank-lip" d="M0 840 C90 820 180 850 260 900 C320 936 380 962 470 1000 M1600 820 C1500 806 1410 840 1340 890 C1280 930 1220 960 1120 1000"/>
<path class="post" style="stroke-width:5" d="M1430 850 L1428 812 M1478 836 L1477 800 M1526 826 L1526 792"/>
<path class="hc" style="stroke-width:4" d="M1427 811 L1431 811 M1475 799 L1480 799 M1523 791 L1529 791"/>
<path class="rope" d="M1428 818 Q1453 830 1477 806 Q1502 818 1526 798"/>`

const LAMPPOST = `<ellipse class="lamp-glow" cx="214" cy="900" rx="150" ry="30" fill="url(#lampglow)"/>
<path class="post" d="M176 912 L176 770 L178 762 L214 762"/>
<path class="iron-d" d="M204 762 L224 762 L228 774 L200 774 Z"/>
<path class="hc" style="stroke-width:2.4" d="M203 761 L225 761"/>
<circle class="lamp-glow" cx="214" cy="780" r="90" fill="url(#lampglow)"/>
<circle class="lamp-flame" cx="214" cy="779" r="4"/>`

// ---- Assembly ------------------------------------------------------------------------------------------------------------

const STYLE = `
.sky-a{stop-color:#070b12}.sky-b{stop-color:#131e2b}.sky-c{stop-color:#2a3a4b}
.cg-sky-a{stop-color:#8a5a3c;stop-opacity:.42}.cg-sky-b{stop-color:#5a3f36;stop-opacity:.18}.cg-sky-c{stop-color:#3a3038;stop-opacity:0}
.cl-d-a{stop-color:#0c1219;stop-opacity:.8}.cl-d-b{stop-color:#0c1219;stop-opacity:0}
.cl-w-a{stop-color:#6b5148;stop-opacity:.45}.cl-w-b{stop-color:#3c3a42;stop-opacity:.2}.cl-w-c{stop-color:#3c3a42;stop-opacity:0}
.hz-a{stop-color:#8aa3bb;stop-opacity:.38}.hz-b{stop-color:#8aa3bb;stop-opacity:0}
.hb-a{stop-color:#5c7590;stop-opacity:0}.hb-b{stop-color:#5c7590;stop-opacity:.55}
.core-a{stop-color:#fff4cf}.core-b{stop-color:#ffb24a}.core-c{stop-color:#d4501a}
.cg-a{stop-color:#ff9a3c;stop-opacity:.5}.cg-b{stop-color:#ff7a2a;stop-opacity:.15}.cg-c{stop-color:#ff7a2a;stop-opacity:0}
.heat-a{stop-color:#ff8f3a;stop-opacity:.26}.heat-b{stop-color:#ff8f3a;stop-opacity:0}
.sm-a{stop-color:#1e2228;stop-opacity:.95}.sm-b{stop-color:#272b31;stop-opacity:.78}.sm-c{stop-color:#272b31;stop-opacity:0}
.sl-a{stop-color:#5e5650;stop-opacity:.95}.sl-b{stop-color:#423f42;stop-opacity:.75}.sl-c{stop-color:#423f42;stop-opacity:0}
.smw-a{stop-color:#a0704c;stop-opacity:.85}.smw-b{stop-color:#5a4a44;stop-opacity:.6}.smw-c{stop-color:#5a4a44;stop-opacity:0}
.st-a{stop-color:#dfe9f2;stop-opacity:.85}.st-b{stop-color:#dfe9f2;stop-opacity:0}
.gu-a{stop-color:#c9d9e8;stop-opacity:.2}.gu-b{stop-color:#c9d9e8;stop-opacity:0}
.lg-a{stop-color:#ffc070;stop-opacity:.48}.lg-b{stop-color:#ffc070;stop-opacity:0}
.pl-a{stop-color:#ffaa55;stop-opacity:.42}.pl-b{stop-color:#ffaa55;stop-opacity:0}
.bk-a{stop-color:#8197ad}.bk-b{stop-color:#3f5266}
.ic-a{stop-color:#090d13}.ic-b{stop-color:#1b2531}.ic-c{stop-color:#2b3644}.ic-d{stop-color:#141c26}.ic-e{stop-color:#070a0f}
.wf-a{stop-color:#ff8a3a;stop-opacity:0}.wf-b{stop-color:#ff8a3a;stop-opacity:.2}
.vg-a{stop-color:#04070b;stop-opacity:0}.vg-b{stop-color:#04070b;stop-opacity:.72}
.cloud{animation:cloud 100s ease-in-out infinite alternate}
.crest{fill:none;stroke-width:1.6;stroke-linejoin:round;opacity:.55}
.plateau{fill:#2f4155}.drift{fill:none;stroke:#5f7890;stroke-width:1.2;opacity:.35}
.rock{fill:none;stroke:#18212c;stroke-width:3;stroke-linecap:round;opacity:.3}
.lip{fill:none;stroke:#7a92a8;stroke-width:1.8;stroke-linejoin:round;opacity:.5}
.pool{fill:url(#pool)}
.hf{fill:#151c25}.hw{fill:#3a2a24}.hr{fill:#a9bbcc}.he{fill:none;stroke:#5a2a20;stroke-width:1.1}.hg{stroke-width:1.4}.hc{fill:none;stroke:#c3d2df;stroke-linecap:round;stroke-linejoin:round}
.win{fill:#ffb455}
.flick{animation:flick 9s ease-in-out infinite}
.wisp{opacity:0;animation:wisp 8s linear infinite}
.streets{fill:none;stroke:#ff9a45;stroke-width:5;opacity:.12;stroke-linecap:round}
.ringroads{fill:none;stroke:#ff9a45;stroke-width:3;opacity:.08}
.iron-d{fill:#0e141c}.plate{fill:#1a232e}
.rib{fill:none;stroke:#2c3948;stroke-width:2.2}.band{fill:none;stroke:#090d13;stroke-width:4.5}
.rivet{fill:none;stroke:#3e4c5c;stroke-width:2;stroke-linecap:round}
.steps{fill:#121921;stroke:#2c3846;stroke-width:1}
.deck{fill:#0c1118}.rail{fill:none;stroke:#2a3644;stroke-width:1.4}
.snow-edge{fill:none;stroke:#b4c6d6;stroke-width:1.8;stroke-linecap:round;opacity:.8}
.strut{fill:none;stroke:#10161e;stroke-width:9;stroke-linecap:round}.strut-hi{fill:none;stroke:#6a4a36;stroke-width:1.4;opacity:.8}
.ring{fill:none;stroke:#2a3644;stroke-width:3}.ring-hi{fill:none;stroke:#536273;stroke-width:1.4}
.grille{fill:none;stroke:#3a1a0c;stroke-width:2.6;opacity:.75}
.port{fill:#ff9a40;opacity:.85;animation:breathe 4.8s ease-in-out infinite}
.pipe{fill:none;stroke:#0f151d;stroke-width:7;stroke-linecap:round}.pipe-top{fill:none;stroke:#8fa3b6;stroke-width:1.6;opacity:.6}
.core{animation:breathe 4.8s ease-in-out infinite}
.core-hot{fill:#fff6da;opacity:.6;animation:breathe 4.8s ease-in-out infinite}
.core-glow{animation:glow 4.8s ease-in-out infinite}
.stack-glow{opacity:.7;animation:glow 3.6s ease-in-out infinite}
.lamp{fill:#ffcf7a;animation:lamp 3.2s ease-in-out infinite}
.ember{fill:#ffb05a;opacity:0;animation:ember 4s ease-out infinite}
.bldg{fill:#121a23}
.walk{animation:walk 150s linear infinite}
.leg{fill:none;stroke:#0d131a;stroke-width:2.6;stroke-linejoin:round;animation:stride .9s ease-in-out infinite alternate}
.leg-far{stroke:#1a2430}
.w-body{fill:#0d131a}.w-eye{fill:#ffd88a}.w-beam{opacity:.8}.beam{fill:#ffd08a;opacity:.07}
.snow{fill:none;stroke:#e3ecf4;stroke-linecap:round;animation:fall 8s linear infinite}
.snow-far{stroke-width:1.4;opacity:.35;animation-duration:10s}.snow-mid{stroke-width:2.4;opacity:.45;animation-duration:6.5s}.snow-near{stroke-width:4.2;opacity:.35;animation-duration:3.6s}
.gust{opacity:0;animation:gust 20s linear infinite}
.sastrugi{fill:none;stroke:#a7bbcd;stroke-width:1.4;opacity:.35}
.bank-lip{fill:none;stroke:#c6d6e4;stroke-width:2.5;opacity:.65}
.post{fill:none;stroke:#0f151d;stroke-width:6;stroke-linecap:round}.rope{fill:none;stroke:#0f151d;stroke-width:1.2}
.lamp-flame{fill:#ffe2a6;animation:candle 2.3s ease-in-out infinite}
.lamp-glow{animation:candle 2.3s ease-in-out infinite}
${smokeStyles.join('\n')}
@keyframes cloud{from{transform:translate(-70px,0)}to{transform:translate(70px,4px)}}
@keyframes breathe{0%,100%{opacity:.82}50%{opacity:1}}
@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes lamp{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes flick{0%,100%{opacity:1}42%{opacity:1}46%{opacity:.25}50%{opacity:.9}54%{opacity:.4}58%{opacity:1}}
@keyframes wisp{0%{transform:translate(0,0) scale(.5);opacity:0}15%{opacity:.5}100%{transform:translate(26px,-30px) scale(2.6);opacity:0}}
@keyframes ember{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(150px,-170px);opacity:0}}
@keyframes candle{0%,100%{opacity:.9}20%{opacity:.7}35%{opacity:1}60%{opacity:.78}80%{opacity:.95}}
@keyframes walk{from{transform:translate(0,0)}to{transform:translate(-1920px,0)}}
@keyframes stride{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes fall{from{transform:translate(0,0)}to{transform:translate(-600px,1000px)}}
@keyframes gust{0%{transform:translate(500px,0);opacity:0}25%{opacity:1}75%{opacity:.8}100%{transform:translate(-600px,0);opacity:0}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`

const radial = (id: string, stops: [offset: number, cls: string][], cy = 0.5, r = 0.5) =>
  `<radialGradient id="${id}" cx=".5" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" class="${c}"/>`).join('')}</radialGradient>`

const DEFS = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".36" class="sky-b"/><stop offset=".54" class="sky-c"/></linearGradient>
<linearGradient id="hazeband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="hb-a"/><stop offset="1" class="hb-b"/></linearGradient>
<linearGradient id="ironcyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="ic-a"/><stop offset=".3" class="ic-b"/><stop offset=".45" class="ic-c"/><stop offset=".75" class="ic-d"/><stop offset="1" class="ic-e"/></linearGradient>
<linearGradient id="warmface" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="wf-a"/><stop offset="1" class="wf-b"/></linearGradient>
<linearGradient id="bank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="bk-a"/><stop offset="1" class="bk-b"/></linearGradient>
${radial('cityglow', [[0, 'cg-sky-a'], [0.45, 'cg-sky-b'], [1, 'cg-sky-c']])}
${radial('cl-d', [[0, 'cl-d-a'], [1, 'cl-d-b']])}
${radial('cl-w', [[0, 'cl-w-a'], [0.5, 'cl-w-b'], [1, 'cl-w-c']])}
${radial('horizon', [[0, 'hz-a'], [1, 'hz-b']])}
${radial('core', [[0, 'core-a'], [0.55, 'core-b'], [1, 'core-c']])}
${radial('coreglow', [[0, 'cg-a'], [0.35, 'cg-b'], [1, 'cg-c']])}
${radial('heat', [[0, 'heat-a'], [1, 'heat-b']])}
${radial('smoke', [[0, 'sm-a'], [0.6, 'sm-b'], [1, 'sm-c']])}
${radial('smokelit', [[0, 'sl-a'], [0.6, 'sl-b'], [1, 'sl-c']])}
${radial('smokewarm', [[0, 'smw-a'], [0.6, 'smw-b'], [1, 'smw-c']])}
${radial('steam', [[0, 'st-a'], [1, 'st-b']])}
${radial('gust', [[0, 'gu-a'], [1, 'gu-b']])}
${radial('lampglow', [[0, 'lg-a'], [1, 'lg-b']])}
${radial('pool', [[0, 'pl-a'], [1, 'pl-b']])}
${radial('vignette', [[0.55, 'vg-a'], [1, 'vg-b']], 0.55, 0.75)}`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${STYLE}</style><defs>${DEFS}</defs>
${SKY}
${MOUNTAINS}
${WALKER}
${crater}
<ellipse cx="${GX}" cy="${GY}" rx="660" ry="180" fill="url(#heat)"/>
<path class="streets" d="${streets}"/>
<g class="ringroads">${ringRoads}</g>
${FACTORIES}
${SMOKE_FACTORIES}
${HOUSES_FAR}
<rect y="500" width="1600" height="120" fill="url(#hazeband)" opacity=".35"/>
${PIPES}
${GENERATOR}
${STEAM}
${HOUSES_NEAR}
${wisps}
${STACK_GLOW}
${SMOKE_MAIN}
${EMBERS}
<g>${gusts}</g>
${SNOW_FAR}
${BANKS}
${LAMPPOST}
${SNOW_MID}
<rect width="1600" height="1000" fill="url(#vignette)"/>
${SNOW_NEAR}
</svg>`
