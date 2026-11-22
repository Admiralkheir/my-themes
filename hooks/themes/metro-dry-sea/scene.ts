// The Dry Sea. Where a sea drew back: a rusted ship keeled over on cracked, salt-streaked seabed, a trawler half
// sunk in sand behind it, the posts of an old pier walking out to nothing and an oil derrick burning its flare on
// the mesas. Dust runs on the wind, a tumbleweed rolls through and a bird circles. Light windows get the white heat
// of noon; dark windows get the desert night, stars and moon, a lantern on the bridge and a fire under the bow.
//
// Built from the same constructs as the other scenes (see the cthulhu scene): CSS keyframes with literal values,
// transform and opacity only, `transform-origin` in positive px, durations and delays inline, no SMIL, filters,
// masks or clip paths, no `var()` in a keyframe and no `@media` but the reduced-motion rule.

import { r1, seeded, fill, svg, timing, person, type Palette } from '../metro.js'

const HZ = 600

function stars(rand: () => number) {
  let a = ''
  let b = ''
  for (let i = 0; i < 120; i++) {
    const x = rand() * 1600
    const y = rand() * 540
    const r = 0.6 + rand() * 1.3
    const d = `M${r1(x + r)} ${r1(y)} A${r1(r)} ${r1(r)} 0 1 0 ${r1(x - r)} ${r1(y)} A${r1(r)} ${r1(r)} 0 1 0 ${r1(x + r)} ${r1(y)} Z `
    if (i % 2) a += d
    else b += d
  }
  return `<path class="stars" d="${a}" style="${timing(5, 0)}"/><path class="stars" d="${b}" style="${timing(7, 3)}"/>
<g class="meteor" style="${timing(19, 6)}"><line class="trail" x1="900" y1="90" x2="1010" y2="40"/></g>`
}

function mesas() {
  return `<path class="far2" d="M0 ${HZ - 20} L0 ${HZ - 66} L90 ${HZ - 70} L130 ${HZ - 104} L360 ${HZ - 108} L392 ${HZ - 70} L640 ${HZ - 60} L700 ${HZ - 50} L1600 ${HZ - 44} L1600 ${HZ - 20} Z"/>
<path class="far1" d="M0 ${HZ + 10} L0 ${HZ - 36} L200 ${HZ - 40} L240 ${HZ - 24} L840 ${HZ - 30} L890 ${HZ - 66} L1120 ${HZ - 70} L1160 ${HZ - 32} L1600 ${HZ - 26} L1600 ${HZ + 10} Z"/>`
}

// The derrick on the mesa, its flare burning.
function derrick(x: number, base: number) {
  const top = base - 210
  let d = `M${x - 34} ${base} L${x - 4} ${top} M${x + 34} ${base} L${x + 4} ${top} `
  for (let y = base; y > top + 20; y -= 30) {
    const w = 34 * ((y - top) / (base - top))
    const w2 = 34 * ((y - 30 - top) / (base - top))
    d += `M${r1(x - w)} ${y} L${r1(x + w2)} ${y - 30} M${r1(x + w)} ${y} L${r1(x - w2)} ${y - 30} M${r1(x - w)} ${y} L${r1(x + w)} ${y} `
  }
  const fx = x + 70
  const fy = base - 130
  return `<path class="lattice" d="${d}"/><path class="lattice" d="M${x} ${base - 40} L${fx} ${base - 40} L${fx} ${fy}"/>
<circle cx="${fx}" cy="${fy - 16}" r="90" fill="url(#dflare)" class="flare" style="transform-origin:${fx}px ${fy}px;${timing(1.3, 0.2)}"/>
<path class="flame" style="transform-origin:${fx}px ${fy}px;${timing(0.9, 0.4)}" d="M${fx - 9} ${fy} Q${fx - 12} ${fy - 20} ${fx} ${fy - 42} Q${fx + 12} ${fy - 20} ${fx + 9} ${fy} Z"/>`
}

// The seabed: cracked into plates that shrink toward the horizon, salt pale in the hollows.
function seabed(rand: () => number) {
  let cracks = ''
  let salt = ''
  for (let row = 0; row < 14; row++) {
    const t = row / 14
    const y = HZ + 12 + Math.pow(t, 1.5) * 400
    const cell = 40 + t * 150
    for (let x = -rand() * cell; x < 1600; x += cell * (0.7 + rand() * 0.6)) {
      const h = cell * 0.32
      cracks += `M${r1(x)} ${r1(y)} l${r1(cell * 0.5)} ${r1((rand() - 0.5) * h * 0.4)} l${r1(cell * 0.45)} ${r1((rand() - 0.5) * h * 0.4)} M${r1(x + cell * 0.5)} ${r1(y)} l${r1((rand() - 0.5) * cell * 0.3)} ${r1(h)} `
    }
    if (rand() > 0.4) salt += `<ellipse cx="${r1(rand() * 1600)}" cy="${r1(y + 6)}" rx="${r1(cell * (1 + rand() * 2))}" ry="${r1(3 + t * 14)}"/>`
  }
  return `<rect y="${HZ}" width="1600" height="${1000 - HZ}" fill="url(#dbed)"/><g class="salt">${salt}</g><path class="crack" d="${cracks}"/>`
}

// The old pier: posts in two rows walking out toward the horizon.
function pier() {
  let d = ''
  for (let i = 0; i < 16; i++) {
    const t = i / 15
    const x = 1560 - t * 360
    const y = HZ + 70 - t * 58
    const h = 46 - t * 32
    const w = 7 - t * 4
    d += `M${r1(x)} ${r1(y)} h${r1(w)} v${r1(-h)} h${r1(-w)} Z M${r1(x - 30 + t * 18)} ${r1(y + 10 - t * 6)} h${r1(w)} v${r1(-h)} h${r1(-w)} Z `
    if (i % 3 === 0 && i < 12) d += `M${r1(x - 30 + t * 18)} ${r1(y - h + 8)} L${r1(x + w)} ${r1(y - h + 4)} L${r1(x + w)} ${r1(y - h + 7)} L${r1(x - 30 + t * 18)} ${r1(y - h + 11)} Z `
  }
  return `<path class="post" d="${d}"/>`
}

// A ship in profile, bow to the left, keel at y; k scales it.
function hull(x: number, y: number, k: number) {
  const P = (dx: number, dy: number) => `${r1(x + dx * k)} ${r1(y + dy * k)}`
  return `M${P(0, -150)} L${P(70, -4)} Q${P(90, 10)} ${P(140, 10)} L${P(700, 10)} Q${P(740, 8)} ${P(752, -40)} L${P(770, -150)} Z`
}

function ship(rand: () => number, night: boolean) {
  const x = 700
  const y = 790
  let s = `<g transform="rotate(-7 1100 720)">`
  s += `<path class="hull" d="${hull(x, y, 1)}"/>`
  // the old antifouling band below, and the rust running down from the deck
  s += `<path class="band" d="M${x + 44} ${y - 50} L${x + 760} ${y - 50} L${x + 752} ${y - 40} Q${x + 740} ${y + 8} ${x + 700} ${y + 10} L${x + 140} ${y + 10} Q${x + 90} ${y + 10} ${x + 70} ${y - 4} Z"/>`
  let rust = ''
  for (let rx = x + 30; rx < x + 750; rx += 22 + rand() * 26) rust += `M${r1(rx)} ${y - 148} l${r1((rand() - 0.5) * 6)} ${r1(30 + rand() * 80)} `
  s += `<path class="rust" d="${rust}"/>`
  let ports = ''
  for (let px = x + 120; px < x + 720; px += 42) ports += `M${px + 6} ${y - 110} A6 6 0 1 0 ${px - 6} ${y - 110} A6 6 0 1 0 ${px + 6} ${y - 110} Z `
  s += `<path class="port" d="${ports}"/>`
  s += `<path class="rail" d="M${x} ${y - 150} L${x + 770} ${y - 150} M${x + 10} ${y - 170} L${x + 760} ${y - 170} ${Array.from({ length: 26 }, (_, i) => `M${x + 10 + i * 30} ${y - 170} v20`).join(' ')}"/>`
  // anchor hawse at the bow
  s += `<circle class="port" cx="${x + 46}" cy="${y - 120}" r="10"/><path class="rail" d="M${x + 46} ${y - 110} q-6 60 14 90"/>`
  // superstructure
  const sx = x + 470
  const sy = y - 150
  s += `<path class="deck" d="M${sx} ${sy} v-70 h230 v70 Z M${sx + 40} ${sy - 70} v-60 h160 v60 Z M${sx + 30} ${sy - 130} h184 v-10 h-184 Z"/>`
  let w1 = ''
  for (let wx = sx + 14; wx < sx + 220; wx += 30) w1 += `M${wx} ${sy - 54} h18 v16 h-18 Z `
  s += `<path class="window" d="${w1}"/>`
  for (let i = 0; i < 5; i++) {
    const wx = sx + 52 + i * 28
    const lit = night && i === 2
    s += `<rect class="${lit ? 'lantern' : 'window'}" x="${wx}" y="${sy - 116}" width="20" height="22"${lit ? ` style="${timing(3, 1)}"` : ''}/>`
  }
  // funnel
  s += `<path class="funnel" d="M${sx + 236} ${sy - 70} L${sx + 252} ${sy - 170} L${sx + 300} ${sy - 170} L${sx + 300} ${sy - 70} Z"/><path class="fband" d="M${sx + 246} ${sy - 140} L${sx + 300} ${sy - 140} L${sx + 300} ${sy - 124} L${sx + 249} ${sy - 124} Z"/>`
  // masts and rigging
  const mx = x + 250
  s += `<path class="mast" d="M${mx - 4} ${sy} h8 v-250 h-8 Z M${mx - 60} ${sy - 190} h120 v6 h-120 Z M${sx + 120} ${sy - 140} h6 v-110 h-6 Z"/>`
  s += `<path class="rig" d="M${mx} ${sy - 250} L${x + 20} ${sy} M${mx} ${sy - 250} L${sx + 123} ${sy - 250} M${mx} ${sy - 250} L${sx + 40} ${sy - 130} M${mx - 60} ${sy - 187} L${mx - 120} ${sy} M${mx + 60} ${sy - 187} L${mx + 130} ${sy}"/>`
  // the lifeboat, hanging from one fall, swinging
  const dx = sx + 210
  const dy = sy - 150
  s += `<path class="mast" d="M${dx} ${sy - 130} q0 -30 30 -24 l-2 6 q-22 -4 -22 18 Z"/>`
  s += `<g class="swing" style="transform-origin:${dx + 30}px ${dy + 2}px;${timing(6, 1)}"><line class="rig" x1="${dx + 30}" y1="${dy + 2}" x2="${dx + 30}" y2="${dy + 90}"/><path class="boat" d="M${dx - 10} ${dy + 90} h80 q-6 26 -40 26 q-34 0 -40 -26 Z"/></g>`
  s += `</g>`
  return s
}

// A smaller trawler, far off, sunk to its rail in sand.
function trawler(x: number, y: number) {
  const k = 0.34
  return `<g transform="rotate(5 ${x} ${y})"><path class="far-ship" d="${hull(x, y, k)} M${r1(x + 150 * k)} ${r1(y - 150 * k)} v${r1(-90 * k)} h${r1(160 * k)} v${r1(90 * k)} Z M${r1(x + 330 * k)} ${r1(y - 150 * k)} h${r1(10 * k)} v${r1(-220 * k)} h${r1(-10 * k)} Z"/></g>
<path class="dune-far" d="M${x - 60} ${y + 20} Q${x + 60} ${y - 30} ${x + 160} ${y - 34} Q${x + 260} ${y - 20} ${x + 330} ${y + 20} Z"/>`
}

// Camp under the bow: the fire, two figures sitting, an awning flapping from the hull.
function camp(rand: () => number, night: boolean) {
  let s = `<path class="pole" d="M520 900 L520 790 M690 920 L690 800"/>`
  s += `<g class="flapcloth" style="transform-origin:600px 790px;${timing(2.6, 0.5)}"><path class="cloth" d="M514 790 L692 802 L792 762 L630 752 Z"/><path class="pole" d="M514 790 L692 802" opacity=".6"/></g>`
  if (night) {
    s += `<circle cx="610" cy="900" r="230" fill="url(#dfire)" class="fire" style="transform-origin:610px 900px;${timing(1.3, 0.1)}"/>`
    s += `<path class="flame" style="transform-origin:610px 912px;${timing(0.8, 0.3)}" d="M592 912 Q594 884 606 868 Q610 886 616 878 Q630 896 628 912 Z"/>`
    for (let i = 0; i < 10; i++) s += `<circle class="spark" style="${timing(2 + rand() * 2, rand() * 4)}" cx="${r1(600 + rand() * 20)}" cy="900" r="${r1(1.2 + rand() * 1.4)}"/>`
  } else {
    s += `<path class="ash" d="M590 914 h40 l-6 -8 h-28 Z"/>`
  }
  s += `<path class="sit" d="${person(540, 918, 74)}"/><path class="sit" d="${person(690, 924, 80)}"/>`
  s += `<path class="crate" d="M740 930 h50 v-36 h-50 Z M752 894 h30 v-22 h-30 Z"/>`
  return s
}

function dunes() {
  let ripples = ''
  for (let i = 0; i < 9; i++) {
    const y = 850 + i * 18
    ripples += `M${-20 + i * 30} ${y} Q${200 + i * 20} ${y - 14} ${420 + i * 10} ${y + 4} T${860} ${y + 2} `
  }
  return `<path class="dune" d="M0 1000 L0 830 Q240 770 520 818 Q760 862 980 806 Q1260 734 1600 796 L1600 1000 Z"/>
<path class="dune-sh" d="M0 912 Q300 872 620 932 L620 1000 L0 1000 Z" opacity=".55"/>
<path class="ripple" d="${ripples}"/>`
}

function tumbleweed() {
  let d = ''
  for (let i = 0; i < 9; i++) {
    const a = (i * Math.PI) / 9
    d += `M${r1(Math.cos(a) * 26)} ${r1(Math.sin(a) * 26)} L${r1(-Math.cos(a) * 26)} ${r1(-Math.sin(a) * 26)} `
  }
  return `<g class="roll" style="${timing(26, 8)}"><g class="tumble" style="transform-origin:0px 0px"><circle class="weed" cx="0" cy="0" r="26"/><circle class="weed" cx="0" cy="0" r="16"/><path class="weed" d="${d}"/></g></g>`
}

function dust(rand: () => number) {
  let s = ''
  for (let i = 0; i < 18; i++) s += `<ellipse class="dust" style="${timing(8 + rand() * 7, rand() * 14)}" cx="${r1(rand() * 600)}" cy="${r1(620 + rand() * 360)}" rx="${r1(90 + rand() * 220)}" ry="${r1(5 + rand() * 7)}" fill="url(#ddust)"/>`
  return s
}

const TPL = `
.sa{stop-color:{skyA}}.sb{stop-color:{skyB}}.sc{stop-color:{skyC}}
.ea{stop-color:{bedA}}.eb{stop-color:{bedB}}
.oa{stop-color:{orb};stop-opacity:{orbGlow}}.ob{stop-color:{orb};stop-opacity:0}
.ha{stop-color:{heat};stop-opacity:{heatOp}}.hb{stop-color:{heat};stop-opacity:0}
.xa{stop-color:#ffc060;stop-opacity:.85}.xm{stop-color:#ff7a24;stop-opacity:.3}.xb{stop-color:#ff5010;stop-opacity:0}
.fa{stop-color:#ffb040;stop-opacity:{flareOp}}.fb{stop-color:#ff6a10;stop-opacity:0}
.ua{stop-color:{dust};stop-opacity:{dustOp}}.ub{stop-color:{dust};stop-opacity:0}
.orb{fill:{orb}}
.stars{fill:{star};opacity:{starOp};animation:tw 6s ease-in-out infinite alternate}
.meteor{animation:meteor 19s linear infinite;opacity:0}.trail{stroke:{star};stroke-width:2;stroke-linecap:round}
.far1{fill:{far1}}.far2{fill:{far2}}
.lattice{fill:none;stroke:{derrick};stroke-width:4}
.flame{fill:#ffb040;animation:flame 1s ease-in-out infinite}.flare{animation:flare 1.3s ease-in-out infinite}
.salt{fill:{salt};opacity:{saltOp}}.crack{fill:none;stroke:{crack};stroke-width:2;opacity:.8}
.post{fill:{post}}
.far-ship{fill:{farShip}}.dune-far{fill:{bedA}}
.hull{fill:{hull}}.band{fill:{band}}.rust{fill:none;stroke:{rust};stroke-width:5;opacity:.6}
.port{fill:{port}}.rail{fill:none;stroke:{hullDark};stroke-width:3}
.deck{fill:{deck}}.window{fill:{port}}.lantern{fill:#ffb050;animation:lamp 3s ease-in-out infinite}
.funnel{fill:{hullDark}}.fband{fill:{band}}
.mast{fill:{hullDark}}.rig{fill:none;stroke:{hullDark};stroke-width:2;opacity:.8}.boat{fill:{deck}}
.swing{animation:swing 6s ease-in-out infinite}
.pole{fill:none;stroke:{hullDark};stroke-width:5}.cloth{fill:{cloth}}.flapcloth{animation:cloth 2.6s ease-in-out infinite}
.fire{animation:fire 1.3s ease-in-out infinite}.spark{fill:#ffb347;animation:spark 3s linear infinite}
.sit{fill:{figure}}.crate{fill:{crate}}.ash{fill:{hullDark}}
.dune{fill:{dune}}.dune-sh{fill:{duneShade}}.ripple{fill:none;stroke:{ripple};stroke-width:2;opacity:.5}
.dust{animation:dust 10s linear infinite}
.roll{animation:roll 26s linear infinite}.tumble{animation:spin 1.6s linear infinite}.weed{fill:none;stroke:{weed};stroke-width:2.2}
.circle{animation:circle 26s linear infinite;transform-origin:1180px 300px}.bird{fill:{bird}}
.wing{animation:wing 2.4s ease-in-out infinite;transform-origin:1180px 140px}
@keyframes tw{from{opacity:{starOp}}to{opacity:.2}}
@keyframes meteor{0%,86%{transform:translate(0,0);opacity:0}88%{opacity:{meteorOp}}93%{transform:translate(-460px,210px);opacity:0}100%{transform:translate(-460px,210px);opacity:0}}
@keyframes flame{0%,100%{transform:scale(1,1)}30%{transform:scale(.85,1.2)}60%{transform:scale(1.1,.9)}}
@keyframes flare{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.6;transform:scale(.9)}}
@keyframes lamp{0%,100%{opacity:.95}40%{opacity:.55}70%{opacity:.85}}
@keyframes swing{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes cloth{0%,100%{transform:scale(1,1)}50%{transform:scale(1,.8)}}
@keyframes fire{0%,100%{transform:scale(1);opacity:.9}45%{transform:scale(1.12);opacity:1}75%{transform:scale(.92);opacity:.75}}
@keyframes spark{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(40px,-280px);opacity:0}}
@keyframes dust{0%{transform:translate(-520px,0);opacity:0}20%{opacity:1}100%{transform:translate(1300px,-30px);opacity:0}}
@keyframes roll{0%{transform:translate(-80px,950px)}20%{transform:translate(260px,930px)}25%{transform:translate(345px,950px)}50%{transform:translate(800px,944px)}55%{transform:translate(890px,918px)}62%{transform:translate(1010px,950px)}100%{transform:translate(1700px,950px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes circle{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes wing{0%,100%{transform:scale(1,1)}50%{transform:scale(1,.7)}}`

const DEFS = `<linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sa"/><stop offset=".62" class="sb"/><stop offset="1" class="sc"/></linearGradient>
<linearGradient id="dbed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ea"/><stop offset="1" class="eb"/></linearGradient>
<radialGradient id="dorb"><stop offset="0" class="oa"/><stop offset="1" class="ob"/></radialGradient>
<radialGradient id="dheat"><stop offset="0" class="ha"/><stop offset="1" class="hb"/></radialGradient>
<radialGradient id="dfire"><stop offset="0" class="xa"/><stop offset=".35" class="xm"/><stop offset="1" class="xb"/></radialGradient>
<radialGradient id="dflare"><stop offset="0" class="fa"/><stop offset="1" class="fb"/></radialGradient>
<radialGradient id="ddust"><stop offset="0" class="ua"/><stop offset="1" class="ub"/></radialGradient>`

function drySea(p: Palette, night: boolean) {
  const rand = seeded(night ? 127 : 131)
  const body = `<rect width="1600" height="1000" fill="url(#dsky)"/>
${night ? stars(rand) : ''}
<circle cx="${p.orbX}" cy="${p.orbY}" r="${p.orbGlowR}" fill="url(#dorb)"/><circle class="orb" cx="${p.orbX}" cy="${p.orbY}" r="${p.orbR}"/>
<ellipse cx="800" cy="${HZ - 10}" rx="1000" ry="70" fill="url(#dheat)"/>
${mesas()}
${derrick(200, HZ - 36)}
${seabed(rand)}
${pier()}
${trawler(330, 668)}
<g class="circle"><g class="wing"><path class="bird" d="M1180 140 q-20 -14 -38 -2 q16 0 38 9 q22 -9 38 -9 q-18 -12 -38 2 Z"/></g></g>
${ship(rand, night)}
${dunes()}
<g transform="translate(0 -66)">${camp(rand, night)}</g>
${tumbleweed()}
${dust(rand)}`
  return svg(fill(TPL, p), DEFS, body)
}

export const SCENE_NIGHT = drySea(
  {
    skyA: '#06050b', skyB: '#141021', skyC: '#2e2337', bedA: '#2a201b', bedB: '#17110e',
    orb: '#ece4d0', orbGlow: 0.45, orbX: 1300, orbY: 170, orbR: 42, orbGlowR: 210, heat: '#4a3a4a', heatOp: 0.35,
    star: '#ebe4f2', starOp: 0.85, meteorOp: 0.9, far1: '#1d1620', far2: '#251c28', derrick: '#100c10', flareOp: 0.8,
    salt: '#5c5260', saltOp: 0.25, crack: '#120d0b', post: '#0f0b09', farShip: '#120d0b',
    hull: '#150e0b', band: '#1e110d', rust: '#2c1a12', port: '#090605', hullDark: '#0b0706', deck: '#1a120e',
    cloth: '#3a2c22', figure: '#060403', crate: '#120c09', dune: '#1d1612', duneShade: '#130e0b', ripple: '#2c221b',
    dust: '#8a7a90', dustOp: 0.12, weed: '#2e241d', bird: '#0b0808',
  },
  true,
)

export const SCENE_DAY = drySea(
  {
    skyA: '#f2e8d3', skyB: '#ecd9b5', skyC: '#e3c894', bedA: '#ddc59d', bedB: '#cdb084',
    orb: '#fffbf2', orbGlow: 1, orbX: 360, orbY: 220, orbR: 66, orbGlowR: 330, heat: '#fff6e2', heatOp: 0.7,
    star: '#ffffff', starOp: 0, meteorOp: 0, far1: '#d6bc90', far2: '#e0caa2', derrick: '#a88f68', flareOp: 0.45,
    salt: '#f7efe0', saltOp: 0.7, crack: '#b9996b', post: '#7c6248', farShip: '#a07e5c',
    hull: '#7e4b2d', band: '#5c2e20', rust: '#a8663c', port: '#3a2416', hullDark: '#4b2e1d', deck: '#94704f',
    cloth: '#8f7552', figure: '#4c3a2a', crate: '#8a6a48', dune: '#d0b07e', duneShade: '#b9935f', ripple: '#e4cb9c',
    dust: '#fff4dc', dustOp: 0.55, weed: '#8a6e4c', bird: '#4e3c2a',
  },
  false,
)
