// Tokyo-3. The fortress city at the foot of the Hakone hills: towers that sink into the Geofront and rise again,
// Unit-01 standing among them, and in front of it all the telephone poles and their sagging wires that the series
// cuts to between scenes. Dusk for dark windows; the endless summer noon after Second Impact, with heat haze and
// thunderheads, for light ones.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg, unit01, birds, BIRD_KEYS } from '../eva.js'

const GROUND = 820

function hills() {
  return `<path class="hill2" d="M0 640 C140 560 260 600 380 540 C480 492 560 520 660 560 C760 600 860 520 980 470 C1100 420 1200 480 1300 530 C1400 580 1500 540 1600 520 L1600 800 L0 800 Z"/>
<path class="hill1" d="M0 700 C200 650 300 690 460 640 C600 600 700 660 860 650 C1000 640 1100 600 1240 620 C1380 640 1480 690 1600 660 L1600 800 L0 800 Z"/>`
}

// One row of towers with their windows. Lit windows go into their own path so a palette can light them.
function row(seed: number, base: number, hMin: number, hMax: number, wMin: number, wMax: number, cls: string, litP: number) {
  const rand = seeded(seed)
  let towers = ''
  let lit = ''
  let dark = ''
  let lights = ''
  let x = -20
  while (x < 1640) {
    const w = wMin + rand() * (wMax - wMin)
    const h = hMin + rand() * (hMax - hMin)
    const top = base - h
    towers += `M${r1(x)} ${base} L${r1(x)} ${r1(top)} L${r1(x + w)} ${r1(top)} L${r1(x + w)} ${base} Z`
    if (rand() < 0.35) towers += `M${r1(x + w * 0.3)} ${r1(top)} L${r1(x + w * 0.3)} ${r1(top - 14)} L${r1(x + w * 0.7)} ${r1(top - 14)} L${r1(x + w * 0.7)} ${r1(top)} Z`
    for (let wy = Math.round(top + 10); wy < base - 8; wy += 12)
      for (let wx = Math.round(x + 5); wx < x + w - 6; wx += 10) {
        const r = rand()
        if (r < litP) lit += `M${wx} ${wy}h4v5h-4z`
        else if (r < litP + 0.3) dark += `M${wx} ${wy}h4v5h-4z`
      }
    if (h > hMax * 0.75) lights += `<circle class="beacon" cx="${r1(x + w / 2)}" cy="${r1(top - 18)}" r="3" style="animation-delay:-${r1(rand() * 3)}s"/>`
    x += w + 2 + rand() * 18
  }
  return `<path class="${cls}" d="${towers}"/><path class="wdark" d="${dark}"/><path class="wlit" d="${lit}"/>${lights}`
}

// The towers that go down into the Geofront and come back up, each on its own slow cycle.
function risers() {
  const at: [number, number, number, number][] = [
    [230, 70, 380, 0], [520, 60, 430, 13], [760, 80, 360, 27], [1420, 66, 410, 6], [1000, 54, 330, 33],
  ]
  return at
    .map(([x, w, h, delay]) => {
      const top = 780 - h
      let win = ''
      for (let wy = top + 14; wy < 780; wy += 12) win += `M${x + 6} ${wy}h${w - 12}v3h${-(w - 12)}z`
      return `<g class="riser" style="animation-delay:-${delay}s"><path class="tower-r" d="M${x} 780 L${x} ${top + 20} L${x + 10} ${top} L${x + w - 10} ${top} L${x + w} ${top + 20} L${x + w} 780 Z"/><path class="band" d="${win}"/><circle class="beacon" cx="${x + w / 2}" cy="${top - 6}" r="3.5"/></g>`
    })
    .join('')
}

const EVA = unit01(1180, 470, 1.15)
const EVA_SVG = `<g class="eva"><path class="eva-body" d="${EVA.body}"/><path class="eva-line" d="${EVA.lines}"/><path class="eva-eye" d="${EVA.eyes}"/></g>`

// The poles and the wires between them, the series' own between-scenes shot.
function poles() {
  const P = (x: number, top: number, w: number, bars: number[]) => {
    let s = `<path class="pole" d="M${x - w / 2} 1000 L${x - w * 0.38} ${top} L${x + w * 0.38} ${top} L${x + w / 2} 1000 Z"/>`
    for (const [i, y] of bars.entries()) {
      const half = w * (5 - i * 0.6)
      s += `<rect class="pole" x="${r1(x - half)}" y="${y}" width="${r1(half * 2)}" height="${r1(w * 0.35)}"/>`
      for (const k of [-0.85, -0.45, 0.45, 0.85]) s += `<rect class="pole" x="${r1(x + half * k - w * 0.12)}" y="${r1(y - w * 0.45)}" width="${r1(w * 0.24)}" height="${r1(w * 0.45)}"/>`
    }
    return s
  }
  let s = P(300, 120, 26, [170, 230, 300])
  s += `<rect class="pole" x="276" y="360" width="20" height="54" rx="8"/><rect class="pole" x="304" y="380" width="18" height="46" rx="7"/>`
  s += P(870, 520, 9, [536, 556, 580])
  s += P(1520, 200, 22, [240, 296])
  // wires: from the near pole's bars to the far one and off the edges
  const wire = (x1: number, y1: number, x2: number, y2: number, sag: number) => `M${x1} ${y1} Q${r1((x1 + x2) / 2)} ${r1((y1 + y2) / 2 + sag)} ${x2} ${y2}`
  let d = ''
  for (const [y, fy] of [[166, 532], [226, 552], [296, 576]] as const) {
    for (const k of [-100, -50, 50, 100]) {
      d += wire(300 + k * 1.1, y - 10, 870 + k * 0.1, fy - 3, 60 + Math.abs(k) * 0.2)
      d += wire(300 + k * 1.1, y - 10, -40, y + 120 + k * 0.3, 70)
    }
  }
  for (const [y, fy] of [[532, 236], [552, 292]] as const)
    for (const k of [-0.5, 0.5]) d += wire(870 + k * 30, y - 3, 1520 + k * 90, fy - 10, 120)
  for (const y of [236, 292]) d += wire(1520 - 90, y - 10, 1660, y + 60, 40) + wire(1520 + 90, y - 10, 1660, y + 90, 30)
  return s + `<g class="wires"><path d="${d}"/></g>`
}

// Heat rising off the asphalt: bands that drift and waver, the haze the series lays over every summer street.
function haze() {
  const rand = seeded(5)
  let s = ''
  for (let i = 0; i < 14; i++) {
    const y = 640 + i * 13
    let d = `M-60 ${y}`
    for (let x = -60; x < 1700; x += 80) d += ` q20 ${r1(-2 - rand() * 3)} 40 0 t40 0`
    s += `<path class="haze" d="${d}" style="animation-duration:${r1(3 + rand() * 3)}s;animation-delay:-${r1(rand() * 3)}s"/>`
  }
  return s
}

function clouds() {
  // thunderheads: stacked domes that boil slowly
  const at: [number, number, number][] = [[260, 470, 1.1], [1260, 430, 1.4], [760, 520, 0.7]]
  return at
    .map(([x, y, s], i) => {
      const domes: [number, number, number][] = [[0, 0, 120], [-110, 40, 90], [110, 36, 95], [-50, -90, 85], [60, -110, 90], [0, -200, 80], [-20, -280, 60], [40, -250, 55]]
      let g = `<g class="thunder" style="transform-origin:${x}px ${y}px;animation-delay:-${i * 7}s">`
      for (const [dx, dy, r] of domes) g += `<circle class="cu" cx="${r1(x + dx * s)}" cy="${r1(y + dy * s)}" r="${r1(r * s)}"/>`
      for (const [dx, dy, r] of domes.slice(0, 4)) g += `<circle class="cu-sh" cx="${r1(x + dx * s + 14 * s)}" cy="${r1(y + dy * s + 40 * s)}" r="${r1(r * s * 0.8)}"/>`
      return g + '</g>'
    })
    .join('')
}

const TPL = `
.sky-a{stop-color:{skyA}}.sky-b{stop-color:{skyB}}.sky-c{stop-color:{skyC}}
.sun-a{stop-color:{sun};stop-opacity:{sunOp}}.sun-b{stop-color:{sun};stop-opacity:0}
.hill2{fill:{hill2}}.hill1{fill:{hill1}}
.far{fill:{far}}.mid{fill:{mid}}.near{fill:{near}}.tower-r{fill:{riser}}.band{fill:{band};opacity:.8}
.wlit{fill:{lit};opacity:{litOp};animation:hum 7s ease-in-out infinite}.wdark{fill:{wdark};opacity:{wdarkOp}}
.beacon{fill:{beacon};animation:beacon 2.4s steps(1) infinite}
.riser{animation:rise 46s ease-in-out infinite}
.eva{animation:breathe 9s ease-in-out infinite;transform-origin:1180px 760px}
.eva-body{fill:{eva};stroke:{evaRim};stroke-width:2;stroke-linejoin:round}.eva-line{fill:none;stroke:{evaLine};stroke-width:3;stroke-linejoin:round;opacity:{evaLineOp}}
.eva-eye{fill:{evaEye};animation:eye 14s ease-in-out infinite}
.pole{fill:{pole}}.wires{fill:none;stroke:{pole};stroke-width:1.6;animation:sway 8s ease-in-out infinite alternate}
.ground{fill:{ground}}
.haze{fill:none;stroke:{haze};stroke-width:6;opacity:{hazeOp};animation:haze 4s ease-in-out infinite alternate}
.cu{fill:{cu}}.cu-sh{fill:{cuSh};opacity:.3}.thunder{opacity:{cuOp};animation:boil 30s ease-in-out infinite alternate}
.bird{fill:none;stroke:{pole};stroke-width:2;stroke-linecap:round;animation:fly 40s linear infinite}.flap{animation:flap .6s ease-in-out infinite alternate}
@keyframes hum{0%,100%{opacity:{litOp}}50%{opacity:{litOp2}}}
@keyframes beacon{0%{opacity:1}50%{opacity:.15}}
@keyframes rise{0%,8%{transform:translate(0,0)}22%,58%{transform:translate(0,470px)}72%,100%{transform:translate(0,0)}}
@keyframes breathe{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(0,-3px) rotate(.4deg)}}
@keyframes eye{0%,70%,100%{opacity:{eyeLo}}76%,88%{opacity:1}}
@keyframes sway{from{transform:translate(0,0)}to{transform:translate(0,3px)}}
@keyframes haze{from{transform:translate(-20px,0)}to{transform:translate(20px,-3px)}}
@keyframes boil{from{transform:scale(1,1) translate(0,0)}to{transform:scale(1.04,1.07) translate(30px,-6px)}}
${BIRD_KEYS}`

const DEFS = `<linearGradient id="t3sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".6" class="sky-b"/><stop offset="1" class="sky-c"/></linearGradient>
<radialGradient id="t3sun" cx=".5" cy=".5" r=".5"><stop offset="0" class="sun-a"/><stop offset="1" class="sun-b"/></radialGradient>`

// Risers sit behind the middle row, so the row hides them as they sink; the ground hides the rest.
const BODY = (sunY: number) => `<rect width="1600" height="1000" fill="url(#t3sky)"/>
<circle cx="640" cy="${sunY}" r="520" fill="url(#t3sun)"/>
{CLOUDS}
${hills()}
${row(3, 780, 60, 230, 30, 70, 'far', 0.08)}
${risers()}
${EVA_SVG}
${row(9, GROUND, 120, 290, 40, 90, 'mid', 0.12)}
<rect class="ground" y="${GROUND}" width="1600" height="${1000 - GROUND}"/>
${row(21, 1000, 60, 170, 70, 140, 'near', 0.1)}
{HAZE}
${poles()}
${birds(41, 6, 120, 380)}`

export function tokyo3(p: Record<string, string | number>, opts: { sunY: number; clouds: boolean; haze: boolean }) {
  const body = BODY(opts.sunY).replace('{CLOUDS}', opts.clouds ? clouds() : '').replace('{HAZE}', opts.haze ? haze() : '')
  return svg(fill(TPL, p), DEFS, body)
}

export const SCENE_DUSK = tokyo3(
  {
    skyA: '#120d24', skyB: '#5a2446', skyC: '#e0743a', sun: '#ff9a4a', sunOp: 0.55,
    hill2: '#3a1f3c', hill1: '#2a1730', far: '#2b1a33', mid: '#1a1022', near: '#0e0913', riser: '#22142b', band: '#ffb35c',
    lit: '#ffc46b', litOp: 0.75, litOp2: 0.45, wdark: '#000000', wdarkOp: 0.25, beacon: '#ff3b2f',
    eva: '#2a1a3c', evaRim: '#c0603e', evaLine: '#7fd35a', evaLineOp: 0.75, evaEye: '#c8ff6a', eyeLo: 0.25,
    pole: '#07050a', ground: '#0b0710', haze: '#ffb070', hazeOp: 0, cu: '#000', cuSh: '#000', cuOp: 0,
  },
  { sunY: 720, clouds: false, haze: false },
)

export const SCENE_SUMMER = tokyo3(
  {
    skyA: '#2f7fd0', skyB: '#8cc6ef', skyC: '#e4f2f8', sun: '#ffffff', sunOp: 0.6,
    hill2: '#8eb3b4', hill1: '#77a19c', far: '#c5d3db', mid: '#dfe6ea', near: '#8d9aa4', riser: '#eef2f4', band: '#5b84a8',
    lit: '#6f9cc4', litOp: 0.55, litOp2: 0.4, wdark: '#4f7393', wdarkOp: 0.35, beacon: '#e0322a',
    eva: '#5b3f8c', evaRim: '#3e2a63', evaLine: '#8fdc4c', evaLineOp: 0.95, evaEye: '#f2ff8a', eyeLo: 0.55,
    pole: '#26232a', ground: '#9aa4aa', haze: '#ffffff', hazeOp: 0.22, cu: '#fbfdff', cuSh: '#b9cddd', cuOp: 0.95,
  },
  { sunY: 200, clouds: true, haze: true },
)
