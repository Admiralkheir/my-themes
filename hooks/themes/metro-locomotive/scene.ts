// Eastbound. An armoured steam locomotive hauling its tender and a turreted wagon east across a truss bridge over
// a frozen river. The girders stream past behind it and the railing in front, the far bank with its pines and
// onion-domed church slides by slowly, the driving wheels turn with their rod, smoke rolls back from the stack
// and the headlamp cuts the snow ahead. Night for dark windows, the firebox and cab windows glowing; an overcast
// day for light ones, black iron against white ice.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg, timing, type Palette } from '../metro.js'

const RAIL = 706
const SHORE = 560

// The far bank, 800 wide so three copies tile while it slides: pines along a low rise, a church with onion domes.
function bank(rand: () => number) {
  let d = `M0 ${SHORE + 40} L0 ${SHORE}`
  for (let x = 0; x <= 800; x += 16) {
    const g = SHORE - 8 - Math.sin((x / 800) * Math.PI * 2) * 10
    const h = 12 + rand() * 26
    d += ` L${x} ${r1(g)} L${x + 8} ${r1(g - h)}`
  }
  d += ` L800 ${SHORE} L800 ${SHORE + 40} Z`
  const cx = 520
  const base = SHORE - 14
  const church = `M${cx - 40} ${base} v-60 h80 v60 Z M${cx - 14} ${base - 60} v-50 h28 v50 Z M${cx} ${base - 150} C${cx - 22} ${base - 128} ${cx - 18} ${base - 112} ${cx - 14} ${base - 110} h28 C${cx + 18} ${base - 112} ${cx + 22} ${base - 128} ${cx} ${base - 150} Z M${cx - 1.5} ${base - 172} h3 v22 h-3 Z M${cx - 8} ${base - 166} h16 v3 h-16 Z
M${cx - 34} ${base - 60} C${cx - 46} ${base - 72} ${cx - 42} ${base - 84} ${cx - 30} ${base - 92} C${cx - 18} ${base - 84} ${cx - 14} ${base - 72} ${cx - 26} ${base - 60} Z M${cx + 26} ${base - 60} C${cx + 14} ${base - 72} ${cx + 18} ${base - 84} ${cx + 30} ${base - 92} C${cx + 42} ${base - 84} ${cx + 46} ${base - 72} ${cx + 34} ${base - 60} Z`
  const one = `<path class="bank" d="${d}"/><path class="church" d="${church}"/>`
  return `<g class="slide">${[-800, 0, 800].map(x => `<g transform="translate(${x} 0)">${one}</g>`).join('')}</g>`
}

// Cracks and drifts on the ice, 800 wide, sliding a little faster than the bank.
function ice(rand: () => number) {
  let d = ''
  let drift = ''
  for (let i = 0; i < 12; i++) {
    const x = rand() * 800
    const y = SHORE + 60 + rand() * 360
    d += `M${r1(x)} ${r1(y)} l${r1(50 + rand() * 120)} ${r1(-6 + rand() * 12)} l${r1(30 + rand() * 80)} ${r1(6 + rand() * 12)} m-40 -6 l14 ${r1(18 + rand() * 20)} `
  }
  for (let i = 0; i < 6; i++) drift += `<ellipse cx="${r1(rand() * 800)}" cy="${r1(SHORE + 70 + rand() * 340)}" rx="${r1(60 + rand() * 120)}" ry="${r1(4 + rand() * 6)}"/>`
  const one = `<path class="crack" d="${d}"/><g class="drift">${drift}</g>`
  return `<g class="slide-ice">${[-800, 0, 800].map(x => `<g transform="translate(${x} 0)">${one}</g>`).join('')}</g>`
}

// The bridge's far truss, one 160 bay repeated, streaming past behind the train.
function truss() {
  let d = ''
  for (let x = -160; x < 1760; x += 160) d += `M${x} ${RAIL - 6} L${x + 80} 470 L${x + 160} ${RAIL - 6} M${x + 80} 470 L${x + 80} ${RAIL - 6} M${x + 40} ${RAIL - 6} L${x + 40} 588 `
  return `<g class="stream"><path class="truss" d="${d}"/><rect class="trussfill" x="-160" y="462" width="1920" height="14"/><rect class="trussfill" x="-160" y="${RAIL - 10}" width="1920" height="10"/></g>`
}

// The near railing and piers: a lattice of 60 with a pier every 240, streaming faster.
function railing() {
  let d = ''
  let piers = ''
  for (let x = -240; x < 1840; x += 60) d += `M${x} 732 L${x + 30} 776 L${x + 60} 732 `
  for (let x = -240; x < 1840; x += 240) piers += `M${x + 100} 780 h56 v220 h-56 Z M${x + 92} 776 h72 v12 h-72 Z `
  return `<g class="rush"><path class="rail" d="${d}"/><rect class="trussfill" x="-240" y="728" width="2080" height="6"/><rect class="trussfill" x="-240" y="774" width="2080" height="8"/><path class="pier" d="${piers}"/></g>`
}

function wheel(x: number, r: number, spokes: number) {
  const cy = RAIL - r
  let sp = ''
  for (let a = 0; a < spokes; a++) {
    const t = (a * 2 * Math.PI) / spokes
    sp += `M${x} ${cy} L${r1(x + r * 0.84 * Math.cos(t))} ${r1(cy + r * 0.84 * Math.sin(t))} `
  }
  return `<g class="wheel" style="transform-origin:${x}px ${cy}px;animation-duration:${r1(0.9 * (r / 50))}s"><circle class="tyre" cx="${x}" cy="${cy}" r="${r}"/><circle class="iron" cx="${x}" cy="${cy}" r="${r1(r * 0.86)}"/><path class="spoke" d="${sp}"/><circle class="hub" cx="${x}" cy="${cy}" r="${r1(r * 0.2)}"/></g>`
}

const rivets = (x0: number, x1: number, y: number, step: number) => {
  let d = ''
  for (let x = x0; x <= x1; x += step) d += `M${x + 2} ${y} A2 2 0 1 0 ${x - 2} ${y} A2 2 0 1 0 ${x + 2} ${y} Z `
  return `<path class="rivet" d="${d}"/>`
}

function locomotive() {
  let s = ''
  // headlamp beam and its glow, under everything
  s += `<path d="M336 504 L-240 360 L-240 780 Z" fill="url(#lbeam)"/>`
  s += `<circle class="fire" cx="840" cy="${RAIL - 10}" r="190" fill="url(#lfire)"/>`
  // plow and buffer beam
  s += `<path class="iron" d="M336 640 L246 ${RAIL + 2} L336 ${RAIL + 2} Z"/><path class="edge" d="M336 640 L246 ${RAIL + 2}"/>`
  s += `<path class="stripe" d="M318 654 l-14 12 M300 668 l-14 12 M282 682 l-14 12 M264 696 l-8 7"/>`
  s += `<rect class="iron" x="326" y="630" width="22" height="64"/>`
  // smokebox, boiler and its armour
  s += `<rect class="iron" x="338" y="516" width="78" height="146" rx="12"/>`
  s += `<rect class="iron" x="404" y="526" width="370" height="126" rx="26"/>`
  s += `<rect class="plate" x="430" y="560" width="320" height="86"/>`
  for (let x = 470; x < 750; x += 56) s += `<line class="seam" x1="${x}" y1="560" x2="${x}" y2="646"/>`
  s += rivets(436, 744, 566, 14) + rivets(436, 744, 640, 14)
  s += `<rect class="edge" x="404" y="526" width="370" height="5" rx="2"/>`
  // stack, domes, whistle
  s += `<path class="iron" d="M362 516 L366 462 L354 448 L410 448 L398 462 L402 516 Z"/><rect class="edge" x="354" y="446" width="56" height="4"/>`
  s += `<path class="iron" d="M528 528 Q528 494 564 494 Q600 494 600 528 Z M632 528 Q632 506 656 506 Q680 506 680 528 Z M712 528 v-26 h8 v26 Z"/>`
  // headlamp
  s += `<rect class="iron" x="326" y="490" width="34" height="28" rx="4"/><circle class="lamp" cx="336" cy="504" r="11"/><circle cx="336" cy="504" r="54" fill="url(#llamp)"/>`
  // running board, cylinder
  s += `<rect class="iron" x="338" y="648" width="580" height="10"/><rect class="edge" x="338" y="648" width="580" height="3"/>`
  s += `<rect class="iron" x="352" y="660" width="80" height="34" rx="6"/>`
  // cab
  s += `<rect class="iron" x="770" y="452" width="156" height="228"/><rect class="iron" x="756" y="440" width="186" height="16" rx="3"/><rect class="edge" x="756" y="440" width="186" height="3"/>`
  s += `<rect class="win" x="790" y="484" width="46" height="52" style="${timing(1.6, 0.4)}"/><rect class="win2" x="852" y="484" width="46" height="52"/>`
  s += `<rect class="seam" x="790" y="560" width="110" height="3"/>` + rivets(780, 916, 600, 14)
  // wheels and the coupling rod
  s += wheel(372, 24, 6) + wheel(432, 24, 6)
  s += [526, 636, 746].map(x => wheel(x, 52, 12)).join('')
  s += wheel(866, 32, 8)
  s += `<g class="rod" style="animation-duration:.94s"><rect class="rodbar" x="520" y="${RAIL - 58}" width="232" height="11" rx="5"/><circle class="hub" cx="526" cy="${RAIL - 52}" r="5"/><circle class="hub" cx="636" cy="${RAIL - 52}" r="5"/><circle class="hub" cx="746" cy="${RAIL - 52}" r="5"/></g>`
  return s
}

function consist(rand: () => number) {
  let s = ''
  // tender
  s += `<rect class="iron" x="944" y="560" width="270" height="124" rx="4"/><path class="coal" d="M952 562 Q1000 520 1060 534 Q1120 516 1206 562 Z"/><rect class="edge" x="944" y="560" width="270" height="3"/>`
  s += rivets(954, 1204, 600, 16) + rivets(954, 1204, 668, 16)
  s += wheel(990, 30, 8) + wheel(1072, 30, 8) + wheel(1160, 30, 8)
  s += `<rect class="iron" x="918" y="650" width="30" height="8"/><rect class="iron" x="1212" y="650" width="22" height="8"/>`
  // the armoured wagon with its turret
  s += `<path class="iron" d="M1232 684 L1232 520 L1250 500 L1590 500 L1608 520 L1608 684 Z"/><rect class="edge" x="1250" y="500" width="340" height="3"/>`
  s += `<path class="iron" d="M1360 500 Q1362 452 1420 448 Q1478 452 1480 500 Z"/><rect class="iron" x="1290" y="462" width="96" height="9"/><circle class="edge2" cx="1420" cy="474" r="4"/>`
  for (let x = 1256; x < 1590; x += 62) {
    const lit = rand() > 0.35
    s += `<rect class="${lit ? 'slot' : 'slotdark'}" x="${x}" y="548" width="34" height="16"${lit ? ` style="${timing(5 + rand() * 6, rand() * 8)}"` : ''}/>`
  }
  s += `<rect class="seam" x="1232" y="600" width="376" height="3"/>` + rivets(1244, 1600, 620, 18) + rivets(1244, 1600, 668, 18)
  s += wheel(1278, 30, 8) + wheel(1350, 30, 8) + wheel(1494, 30, 8) + wheel(1566, 30, 8)
  // the next wagon running off the edge
  s += `<rect class="iron" x="1630" y="510" width="200" height="174"/>`
  return s
}

function smoke(rand: () => number) {
  let s = ''
  for (let i = 0; i < 14; i++) {
    s += `<circle class="puff" style="${timing(5.6, (i * 5.6) / 14)}" cx="382" cy="446" r="${r1(30 + rand() * 22)}" fill="${rand() > 0.5 ? 'url(#lsmokea)' : 'url(#lsmokeb)'}"/>`
  }
  for (let i = 0; i < 12; i++) s += `<circle class="spark" style="${timing(1.6 + rand() * 1.6, rand() * 3)}" cx="${r1(372 + rand() * 20)}" cy="446" r="${r1(1.4 + rand() * 1.6)}"/>`
  // steam bleeding from the cylinder
  for (let i = 0; i < 5; i++) s += `<circle class="steam" style="${timing(2.4, (i * 2.4) / 5)}" cx="380" cy="694" r="${r1(12 + rand() * 8)}"/>`
  return s
}

function snow(rand: () => number) {
  let s = ''
  for (let i = 0; i < 90; i++) {
    const near = rand() > 0.6
    s += `<circle class="${near ? 'flake' : 'flake2'}" style="${timing(near ? 1.6 + rand() : 2.6 + rand() * 2, rand() * 4)}" cx="${r1(-700 + rand() * 2300)}" cy="${r1(-300 + rand() * 1300)}" r="${r1(near ? 2 + rand() * 1.8 : 1 + rand() * 1.2)}"/>`
  }
  return s
}

function stars(rand: () => number) {
  let d = ''
  for (let i = 0; i < 70; i++) {
    const x = rand() * 1600
    const y = rand() * 420
    const r = 0.6 + rand() * 1.2
    d += `M${r1(x + r)} ${r1(y)} A${r1(r)} ${r1(r)} 0 1 0 ${r1(x - r)} ${r1(y)} A${r1(r)} ${r1(r)} 0 1 0 ${r1(x + r)} ${r1(y)} Z `
  }
  return `<path class="stars" d="${d}"/>`
}

const TPL = `
.sa{stop-color:{skyA}}.sb{stop-color:{skyB}}.sc{stop-color:{skyC}}
.ia{stop-color:{iceA}}.ib{stop-color:{iceB}}
.ba{stop-color:#fff2c8;stop-opacity:{beamOp}}.bb{stop-color:#fff2c8;stop-opacity:0}
.la{stop-color:#fff6dc;stop-opacity:{lampOp}}.lb{stop-color:#fff6dc;stop-opacity:0}
.xa{stop-color:#ffb050;stop-opacity:{fireOp}}.xb{stop-color:#ff7020;stop-opacity:0}
.ma{stop-color:{moon};stop-opacity:{moonOp}}.mb{stop-color:{moon};stop-opacity:0}
.pa{stop-color:{smokeA};stop-opacity:.95}.pb{stop-color:{smokeA};stop-opacity:0}
.qa{stop-color:{smokeB};stop-opacity:.9}.qb{stop-color:{smokeB};stop-opacity:0}
.stars{fill:{star};opacity:{starOp};animation:tw 7s ease-in-out infinite alternate}
.bank{fill:{bank}}.church{fill:{church}}
.crack{fill:none;stroke:{crack};stroke-width:1.6;opacity:.7}.drift{fill:{drift};opacity:{driftOp}}
.truss{fill:none;stroke:{truss};stroke-width:10}.trussfill{fill:{truss}}
.rail{fill:none;stroke:{rail};stroke-width:5}.pier{fill:{rail};opacity:.92}
.deck{fill:{deck}}
.iron{fill:{iron}}.plate{fill:{plate}}.edge{fill:{edge};stroke:{edge};stroke-width:2;opacity:.75}.edge2{fill:{edge}}
.seam{stroke:{edge};fill:{edge};opacity:.35}.rivet{fill:{edge};opacity:.55}.stripe{fill:none;stroke:{stripe};stroke-width:5;opacity:.8}
.coal{fill:{coal}}
.lamp{fill:#fff4d0}
.win{fill:{win};opacity:{winOp};animation:flick 1.6s ease-in-out infinite}.win2{fill:{win};opacity:{win2Op}}
.slot{fill:{win};opacity:{winOp};animation:flick 6s ease-in-out infinite}.slotdark{fill:{plate}}
.tyre{fill:{edge}}.spoke{fill:none;stroke:{edge};stroke-width:3}.hub{fill:{edge}}.rodbar{fill:{edge}}
.fire{animation:flick 1.4s ease-in-out infinite}
.wheel{animation:spin .9s linear infinite}
.rod{animation:crank .94s linear infinite}
.stream{animation:stream 1.6s linear infinite}
.rush{animation:rush 2s linear infinite}
.slide{animation:slide 70s linear infinite}
.slide-ice{animation:slide 34s linear infinite}
.puff{animation:puff 5.6s linear infinite;transform-origin:382px 446px}
.spark{fill:#ffb347;animation:spark 2s linear infinite;opacity:0}
.steam{fill:{steam};animation:steam 2.4s linear infinite;transform-origin:380px 694px}
.flake{fill:{flake};animation:snow 2s linear infinite}.flake2{fill:{flake2};animation:snow2 3.5s linear infinite}
@keyframes tw{from{opacity:{starOp}}to{opacity:.15}}
@keyframes flick{0%,100%{opacity:1}35%{opacity:.65}70%{opacity:.88}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes crank{0%{transform:translate(16px,0)}12.5%{transform:translate(11.3px,-11.3px)}25%{transform:translate(0,-16px)}37.5%{transform:translate(-11.3px,-11.3px)}50%{transform:translate(-16px,0)}62.5%{transform:translate(-11.3px,11.3px)}75%{transform:translate(0,16px)}87.5%{transform:translate(11.3px,11.3px)}100%{transform:translate(16px,0)}}
@keyframes stream{from{transform:translate(0,0)}to{transform:translate(160px,0)}}
@keyframes rush{from{transform:translate(0,0)}to{transform:translate(240px,0)}}
@keyframes slide{from{transform:translate(0,0)}to{transform:translate(800px,0)}}
@keyframes puff{0%{transform:translate(0,0) scale(.4);opacity:0}8%{opacity:{puffOp}}100%{transform:translate(1150px,-330px) scale(3.4);opacity:0}}
@keyframes spark{0%{transform:translate(0,0);opacity:0}8%{opacity:{sparkOp}}100%{transform:translate(260px,-260px);opacity:0}}
@keyframes steam{0%{transform:translate(0,0) scale(.5);opacity:0}15%{opacity:.7}100%{transform:translate(120px,-30px) scale(2.2);opacity:0}}
@keyframes snow{from{transform:translate(0,0)}to{transform:translate(760px,300px)}}
@keyframes snow2{from{transform:translate(0,0)}to{transform:translate(520px,260px)}}`

const DEFS = `<linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sa"/><stop offset=".62" class="sb"/><stop offset="1" class="sc"/></linearGradient>
<linearGradient id="lice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ia"/><stop offset="1" class="ib"/></linearGradient>
<linearGradient id="lbeam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" class="ba"/><stop offset="1" class="bb"/></linearGradient>
<radialGradient id="llamp"><stop offset="0" class="la"/><stop offset="1" class="lb"/></radialGradient>
<radialGradient id="lfire"><stop offset="0" class="xa"/><stop offset="1" class="xb"/></radialGradient>
<radialGradient id="lmoon"><stop offset="0" class="ma"/><stop offset="1" class="mb"/></radialGradient>
<radialGradient id="lsmokea"><stop offset="0" class="pa"/><stop offset=".55" class="pa"/><stop offset="1" class="pb"/></radialGradient>
<radialGradient id="lsmokeb"><stop offset="0" class="qa"/><stop offset=".55" class="qa"/><stop offset="1" class="qb"/></radialGradient>`

function eastbound(p: Palette) {
  const rand = seeded(89)
  const body = `<rect width="1600" height="1000" fill="url(#lsky)"/>
${stars(rand)}
<circle cx="1240" cy="170" r="300" fill="url(#lmoon)"/>
${bank(rand)}
<rect y="${SHORE + 30}" width="1600" height="${1000 - SHORE - 30}" fill="url(#lice)"/>
${ice(rand)}
${truss()}
${smoke(rand)}
${locomotive()}
${consist(rand)}
<rect class="deck" y="${RAIL}" width="1600" height="24"/>
${railing()}
${snow(rand)}`
  return svg(fill(TPL, p), DEFS, body)
}

export const SCENE_NIGHT = eastbound({
  skyA: '#04070b', skyB: '#0f1824', skyC: '#24334a', iceA: '#1c2838', iceB: '#0a1018',
  moon: '#c9d6e6', moonOp: 0.22, star: '#e3ecf4', starOp: 0.7,
  bank: '#0a1018', church: '#0c131c', crack: '#4a5e74', drift: '#7d93a9', driftOp: 0.25,
  truss: '#0d141c', rail: '#0b1118', deck: '#070b10',
  iron: '#0e1319', plate: '#141b23', edge: '#3d4d60', stripe: '#8a6a2a', coal: '#05080b',
  win: '#ffb860', winOp: 0.92, win2Op: 0.7, beamOp: 0.36, lampOp: 0.95, fireOp: 0.6,
  smokeA: '#2a2f37', smokeB: '#3d434c', puffOp: 0.9, sparkOp: 1, steam: '#c7d3de',
  flake: '#e3ecf4', flake2: '#9fb0c0',
})

export const SCENE_DAY = eastbound({
  skyA: '#c2ccd5', skyB: '#d8dfe5', skyC: '#ecf0f2', iceA: '#eef2f4', iceB: '#d9e1e7',
  moon: '#ffffff', moonOp: 0.7, star: '#ffffff', starOp: 0,
  bank: '#8f9ba6', church: '#7f8b97', crack: '#b4c0c9', drift: '#ffffff', driftOp: 0.8,
  truss: '#58626d', rail: '#4a535d', deck: '#39414a',
  iron: '#252b32', plate: '#2e353d', edge: '#7a8796', stripe: '#b08a3a', coal: '#15191d',
  win: '#ffc070', winOp: 0.75, win2Op: 0.55, beamOp: 0.16, lampOp: 0.7, fireOp: 0.12,
  smokeA: '#474c53', smokeB: '#8d939a', puffOp: 0.85, sparkOp: 0.5, steam: '#ffffff',
  flake: '#ffffff', flake2: '#97a3ae',
})
