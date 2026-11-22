// NERV, Central Dogma. The command deck's screens when an Angel is on its way: a honeycomb of EMERGENCY panels
// flashing, the three MAGI arguing their verdict, sync waveforms and a crawling alarm band, in the compressed
// serif of the title cards and the all-caps grotesk of NERV's own screens. Black and orange for dark windows;
// the title cards' white, black and red for light ones.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, fill, svg, hex } from '../eva.js'

const SERIF = `'Times New Roman',Times,'Hiragino Mincho ProN','Yu Mincho',serif`
const SANS = `'Helvetica Neue',Helvetica,Arial,'Hiragino Sans',sans-serif`

function grid() {
  const r = 30
  const w = r * 1.5
  const h = r * Math.sqrt(3)
  let d = ''
  for (let c = -1; c * w < 1640; c++)
    for (let row = -1; row * h < 1040; row++) d += hex(c * w, row * h + (c % 2 ? h / 2 : 0), r)
  return `<path class="grid" d="${d}"/>`
}

// The honeycomb of EMERGENCY panels, flashing out of step.
function honeycomb(cx: number, cy: number) {
  const r = 62
  const w = r * 1.5
  const h = r * Math.sqrt(3)
  const cells: [number, number][] = [[0, 0], [0, -1], [0, 1], [1, -0.5], [1, 0.5], [-1, -0.5], [-1, 0.5], [2, 0], [2, -1], [1, 1.5], [-1, 1.5], [0, 2], [2, 1], [1, -1.5]]
  return cells
    .map(([c, rr], i) => {
      const x = r1(cx + c * w)
      const y = r1(cy + rr * h)
      const delay = ((i * 0.37) % 1.6).toFixed(2)
      return `<g class="cell" style="animation-delay:-${delay}s"><path class="cell-f" d="${hex(x, y, r - 4)}"/><path class="cell-s" d="${hex(x, y, r - 10)}"/><text class="cell-t" x="${x}" y="${r1(y + 7)}" textLength="88" lengthAdjust="spacingAndGlyphs">EMERGENCY</text></g>`
    })
    .join('')
}

// The MAGI: three panels about a centre, each voting, the verdicts turning over.
function magi(x: number, y: number) {
  const panel = (px: number, py: number, w: number, h: number, name: string, delay: number) =>
    `<g><rect class="magi-f" x="${px}" y="${py}" width="${w}" height="${h}"/><rect class="magi-v" x="${px}" y="${py}" width="${w}" height="${h}" style="animation-delay:-${delay}s"/><text class="magi-t" x="${px + 14}" y="${py + 30}">${name}</text></g>`
  return `<g>
<path class="frame" d="M${x - 10} ${y - 40} h420 v300 h-420 z"/>
<text class="label" x="${x}" y="${y - 52}">MAGI SYSTEM · 提訴</text>
${panel(x + 130, y - 20, 150, 90, 'MELCHIOR·1', 0)}
${panel(x + 10, y + 110, 150, 120, 'BALTHASAR·2', 2.3)}
${panel(x + 250, y + 110, 150, 120, 'CASPER·3', 4.1)}
<text class="verdict" x="${x + 205}" y="${y + 160}" text-anchor="middle">審議中</text>
</g>`
}

// Sync ratio: waves that swell and settle.
function waves(x: number, y: number) {
  const wave = (amp: number, len: number, phase: number) => {
    let d = `M${x} ${y}`
    for (let i = 0; i < 520; i += 4) d += ` L${x + i} ${r1(y + Math.sin((i + phase) / len) * amp * Math.sin(i / 160))}`
    return d
  }
  return `<path class="frame" d="M${x - 10} ${y - 80} h540 v160 h-540 z"/>
<path class="axis" d="M${x} ${y} h520 M${x} ${y - 60} v120"/>
<g class="wave" style="transform-origin:${x}px ${y}px"><path class="wave-a" d="${wave(46, 14, 0)}"/></g>
<g class="wave" style="transform-origin:${x}px ${y}px;animation-delay:-1.3s;animation-duration:3.1s"><path class="wave-b" d="${wave(30, 9, 40)}"/></g>
<rect class="scan" x="${x}" y="${y - 70}" width="3" height="140" style="transform-origin:${x}px ${y}px"/>
<text class="label" x="${x}" y="${y - 92}">SYNCHRO RATIO · EVA-01</text>
<text class="num" x="${x + 520}" y="${y - 92}" text-anchor="end">41.3%</text>`
}

// The alarm band that crawls across the top: one run of words drawn twice so the loop never shows its seam.
function band(y: number) {
  const run = Array(8).fill('EMERGENCY · 非常事態 · PATTERN BLUE · ').join('')
  return `<rect class="band" x="0" y="${y}" width="1600" height="34"/><g class="crawl"><text class="band-t" x="0" y="${y + 24}" textLength="2400" lengthAdjust="spacingAndGlyphs">${run}</text><text class="band-t" x="2400" y="${y + 24}" textLength="2400" lengthAdjust="spacingAndGlyphs">${run}</text></g>`
}

const TPL = `
.bg{fill:{bg}}.glow-a{stop-color:{glow};stop-opacity:{glowOp}}.glow-b{stop-color:{glow};stop-opacity:0}
.grid{fill:none;stroke:{line};stroke-width:1;opacity:{gridOp}}
.cell{animation:cell 1.6s steps(1) infinite}.cell-f{fill:{alarm}}.cell-s{fill:none;stroke:{alarmInk};stroke-width:2;opacity:.6}
.cell-t{font-family:${SANS};font-weight:700;font-size:20px;fill:{alarmInk};text-anchor:middle}
.title{font-family:${SERIF};font-weight:900;fill:{ink}}
.title-s{font-family:${SERIF};font-weight:900;fill:{ink};opacity:.75}
.label{font-family:${SANS};font-weight:700;font-size:15px;letter-spacing:2px;fill:{line}}
.num{font-family:${SANS};font-weight:700;font-size:28px;fill:{ink}}
.frame{fill:{panel};stroke:{line};stroke-width:1.5;opacity:.9}.axis{fill:none;stroke:{line};opacity:.4}
.magi-f{fill:{magi}}.magi-v{fill:{alarm};opacity:0;animation:vote 7s steps(1) infinite}
.magi-t{font-family:${SANS};font-weight:700;font-size:16px;letter-spacing:1px;fill:{magiInk}}
.verdict{font-family:${SERIF};font-weight:900;font-size:30px;fill:{ink};animation:blink 1.2s steps(1) infinite}
.wave{animation:swell 2.4s ease-in-out infinite alternate}.wave-a{fill:none;stroke:{waveA};stroke-width:2.5}.wave-b{fill:none;stroke:{waveB};stroke-width:2}
.scan{fill:{waveA};opacity:.7;animation:scan 4s linear infinite}
.band{fill:{alarm}}.band-t{font-family:${SANS};font-weight:700;font-size:20px;letter-spacing:3px;fill:{alarmInk}}
.crawl{animation:crawl 40s linear infinite}
.colon{animation:blink 1s steps(1) infinite}
@keyframes cell{0%{opacity:1}50%{opacity:{cellLo}}}
@keyframes vote{0%{opacity:0}40%{opacity:.85}70%{opacity:0}}
@keyframes blink{0%{opacity:1}50%{opacity:.2}}
@keyframes swell{from{transform:scale(1,.35)}to{transform:scale(1,1)}}
@keyframes scan{from{transform:translate(0,0)}to{transform:translate(520px,0)}}
@keyframes crawl{from{transform:translate(0,0)}to{transform:translate(-2400px,0)}}`

const DEFS = `<radialGradient id="nvglow" cx=".8" cy=".45" r=".6"><stop offset="0" class="glow-a"/><stop offset="1" class="glow-b"/></radialGradient>`

const BODY = `<rect class="bg" width="1600" height="1000"/>
<rect width="1600" height="1000" fill="url(#nvglow)"/>
${grid()}
${band(40)}
<text class="title" x="70" y="230" font-size="150" textLength="560" lengthAdjust="spacingAndGlyphs">使徒、接近</text>
<text class="title-s" x="74" y="300" font-size="54" textLength="440" lengthAdjust="spacingAndGlyphs">PATTERN BLUE</text>
<text class="label" x="76" y="340">第3新東京市 · 第一種戦闘配置</text>
${honeycomb(1250, 400)}
${magi(80, 640)}
${waves(620, 880)}
<text class="label" x="1180" y="830">ACTIVE TIME REMAINING</text>
<text class="num" x="1180" y="880" font-size="56">04<tspan class="colon">:</tspan>59<tspan class="colon">:</tspan>12</text>
<text class="label" x="1180" y="920">INTERNAL · UMBILICAL CABLE OK</text>`

export function nerv(p: Record<string, string | number>) {
  return svg(fill(TPL, p), DEFS, BODY)
}

export const SCENE_ALERT = nerv({
  bg: '#08060a', glow: '#ff6a1a', glowOp: 0.18, line: '#ff8a2a', gridOp: 0.12,
  alarm: '#e8361e', alarmInk: '#1a0604', ink: '#ffe9d6', panel: '#140c0a', magi: '#3a2410', magiInk: '#ffb36a',
  waveA: '#ff9a3a', waveB: '#7fd35a', cellLo: 0.25,
})

export const SCENE_BRIEFING = nerv({
  bg: '#eeefed', glow: '#d81e1e', glowOp: 0.08, line: '#1a1a1a', gridOp: 0.07,
  alarm: '#d4171e', alarmInk: '#ffffff', ink: '#0d0d0d', panel: '#f7f7f5', magi: '#d9dcd8', magiInk: '#111111',
  waveA: '#d4171e', waveB: '#2a2a2a', cellLo: 0.35,
})
