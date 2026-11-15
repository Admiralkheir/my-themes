// The drowned city: an abyss with tentacles that writhe, rising bubbles,
// a sunken skyline of wrong angles and, now and then, an eye that opens.
//
// Built only from what the app's own example themes use, since the desktop app
// ran their scenes and not this one while it used anything else: one still SVG
// string whose motion is all CSS keyframes with literal values (transform and
// opacity), `transform-origin` in positive px, `animation-duration` and
// `animation-delay` set inline, and no `@media` but the examples' reduced-motion
// rule. So: no SMIL, no `transform-box`, no `var()` inside a keyframe, and no
// light-mode or narrow-screen `@media` (the scene is the same dark abyss in both
// modes; the app's own colors still follow the mode).
//
// Each tentacle is a chain of joints, every joint a group that turns about its
// own point, nested so the turns add up toward the tip; each joint starts a
// little later than the one below it, so a bend travels up the limb.

const r1 = (n: number) => Math.round(n * 10) / 10

type TentacleSpec = {
  x: number
  y: number
  flip: boolean
  length: number
  width: number
  joints: number
  period: number // seconds for one swing, out and back is twice this
  baseDeg: number // swing of the lowest joint
  tipDeg: number // swing of the last joint
  lag: number // seconds each joint trails the one below
  delay: number
}

const TENTACLES: TentacleSpec[] = [
  { x: 110, y: 1045, flip: false, length: 760, width: 150, joints: 10, period: 5.5, baseDeg: 2, tipDeg: 11, lag: 0.55, delay: 0 },
  { x: 265, y: 1055, flip: true, length: 520, width: 90, joints: 9, period: 4.6, baseDeg: 2.5, tipDeg: 13, lag: 0.45, delay: 2.1 },
  { x: 1490, y: 1045, flip: true, length: 800, width: 160, joints: 10, period: 6.2, baseDeg: 2, tipDeg: 10, lag: 0.6, delay: 3.4 },
  { x: 1340, y: 1065, flip: false, length: 560, width: 95, joints: 9, period: 5, baseDeg: 2.5, tipDeg: 12, lag: 0.5, delay: 1.2 },
]

// One keyframe per swing, its degrees written out: a joint's swing rounds to a
// half degree and names its class and keyframe (`j35` swings 3.5 degrees each way).
const swings = new Set<number>()
const swingName = (deg: number) => `j${Math.round(deg * 10)}`

// Drawn in the scene's own coordinates, with no transform on any group around
// it, so every joint turns about a positive point, as in the examples.
function tentacle(t: TentacleSpec): string {
  const seg = t.length / t.joints
  const half = (k: number) => (t.width * Math.pow(1 - k / t.joints, 0.9) + 4) / 2
  const s = t.flip ? -1 : 1
  const X = (dx: number) => r1(t.x + s * dx)
  const Y = (y: number) => r1(y)

  // Innermost first: the tip, then wrap each lower joint around what is above it.
  let inner = ''
  for (let k = t.joints - 1; k >= 0; k--) {
    const y0 = t.y - k * seg
    const y1 = t.y - (k + 1) * seg
    const w0 = half(k)
    const w1 = half(k + 1)
    // A slightly overlapping tapered piece, with a round joint that hides the seam as it turns.
    let piece = `<path d="M${X(-w0)} ${Y(y0 + 2)} L${X(-w1)} ${Y(y1 - 2)} L${X(w1)} ${Y(y1 - 2)} L${X(w0)} ${Y(y0 + 2)} Z"/>`
    piece += `<circle cx="${X(0)}" cy="${Y(y0)}" r="${r1(w0)}"/>`
    if (k === t.joints - 1) {
      // The tip: a small hook that curls over.
      piece += `<path d="M${X(-w1)} ${Y(y1)} C${X(-w1)} ${Y(y1 - seg * 0.5)} ${X(seg * 0.5)} ${Y(y1 - seg * 0.55)} ${X(seg * 0.45)} ${Y(y1 - seg * 0.15)} C${X(seg * 0.35)} ${Y(y1)} ${X(w1)} ${Y(y1 - seg * 0.15)} ${X(w1)} ${Y(y1)} Z"/>`
    }
    // Suckers along one side, two to a piece.
    for (const f of [0.3, 0.75]) {
      const y = y0 - seg * f
      const w = w0 + (w1 - w0) * f
      if (k < t.joints - 1 || f < 0.5) {
        piece += `<circle class="sk" cx="${X(-w * 0.45)}" cy="${Y(y)}" r="${r1(w * 0.32)}"/>`
      }
    }
    const deg = Math.round((t.baseDeg + ((t.tipDeg - t.baseDeg) * k) / (t.joints - 1)) * 2) / 2
    swings.add(deg)
    const delay = r1(t.delay + k * t.lag)
    inner =
      `<g class="${swingName(deg)}" style="transform-origin:${X(0)}px ${Y(y0)}px;` +
      `animation-duration:${t.period}s;animation-delay:-${delay}s">${piece}${inner}</g>`
  }
  return `<g>${inner}</g>`
}

const TENTACLE_MARKUP = TENTACLES.map(tentacle).join('')

const SWING_STYLE = [...swings]
  .sort((a, b) => a - b)
  .map(deg => {
    const name = swingName(deg)
    return `.${name}{animation:${name} 5s ease-in-out infinite alternate}@keyframes ${name}{from{transform:rotate(-${deg}deg)}to{transform:rotate(${deg}deg)}}`
  })
  .join('\n')

const BUBBLES: [x: number, seconds: number, offset: number, r: number][] = [
  [120, 16, 0, 5], [260, 22, 6, 3], [410, 19, 11, 4], [1180, 18, 2, 6],
  [1330, 24, 9, 3], [1470, 20, 4, 5], [700, 26, 14, 2], [920, 21, 7, 3],
  [1050, 28, 17, 4], [560, 23, 3, 2], [1250, 17, 12, 3], [330, 25, 19, 6],
]

const bubbles = BUBBLES.map(
  ([x, seconds, offset, r]) =>
    `<circle class="bubble" cx="${x}" cy="1040" r="${r}" style="animation-duration:${seconds}s;animation-delay:-${offset}s"/>`,
).join('')

const STYLE = `
.sky-a{stop-color:#0c2523}.sky-b{stop-color:#061110}.sky-c{stop-color:#020605}
.glow-a{stop-color:#2fb5a3;stop-opacity:.22}.glow-b{stop-color:#2fb5a3;stop-opacity:0}
.tent-a{stop-color:#1a3d38}.tent-b{stop-color:#08181a}
.city{fill:#020807}.city2{fill:#051210}
.window{fill:#3fd9bf;opacity:0;animation:flicker 9s ease-in-out infinite}
.sk{fill:#2a5a52;opacity:.55}
.shaft{fill:#9ff0e0;opacity:.02;animation:shaft 14s ease-in-out infinite}
.bubble{fill:none;stroke:#8fe3d4;stroke-width:1.6;opacity:0;animation:rise 20s linear infinite}
.eye-glow{fill:#7dffb0}.eye-slit{fill:#020605}
.eye{opacity:0;animation:blink 23s ease-in-out infinite}
.pulse{animation:pulse 8s ease-in-out infinite}
${SWING_STYLE}
@keyframes rise{0%{transform:translate(0,0);opacity:0}10%{opacity:.55}50%{transform:translate(14px,-550px)}90%{opacity:.45}100%{transform:translate(0,-1100px);opacity:0}}
@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes shaft{0%,100%{opacity:.01}50%{opacity:.032}}
@keyframes flicker{0%,40%,100%{opacity:0}50%{opacity:.55}60%{opacity:.1}}
@keyframes blink{0%,78%,100%{transform:scale(1,.04);opacity:0}82%,94%{transform:scale(1,1);opacity:.8}88%{transform:scale(1,.85);opacity:.9}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`

const DEFS = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset=".55" class="sky-b"/><stop offset="1" class="sky-c"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" class="glow-a"/><stop offset="1" class="glow-b"/></radialGradient>
<linearGradient id="tent" gradientUnits="userSpaceOnUse" x1="0" y1="240" x2="0" y2="1060"><stop offset="0" class="tent-a"/><stop offset="1" class="tent-b"/></linearGradient>`

// R'lyeh: a skyline whose angles are wrong.
const CITY = `<path class="city2" d="M0 1000 L0 880 L70 870 L95 790 L150 805 L170 860 L250 845 L280 740 L330 770 L345 850 L430 830 L470 700 L540 720 L520 820 L610 810 L640 760 L700 790 L720 850 L820 835 L860 690 L900 650 L960 700 L940 820 L1040 815 L1080 730 L1130 760 L1150 840 L1240 825 L1270 760 L1330 720 L1350 830 L1440 820 L1480 760 L1540 790 L1600 770 L1600 1000 Z"/>
<path class="city" d="M0 1000 L0 930 L110 915 L130 860 L180 850 L200 920 L330 905 L360 820 L420 860 L410 925 L560 910 L600 840 L650 800 L690 860 L680 920 L780 915 L800 780 L835 740 L880 790 L870 905 L1000 900 L1030 830 L1100 845 L1090 910 L1210 905 L1250 820 L1310 870 L1300 915 L1420 905 L1450 850 L1510 830 L1530 910 L1600 900 L1600 1000 Z"/>
<g transform="skewX(-12)"><rect class="window" x="826" y="790" width="6" height="14"/></g>
<g transform="skewX(8)"><rect class="window" style="animation-delay:-3s" x="640" y="855" width="5" height="11"/></g>
<g transform="skewX(-6)"><rect class="window" style="animation-delay:-6s" x="1262" y="860" width="5" height="12"/></g>`

// Something vast, far above and to the right, sometimes looks back.
const EYE = `<g class="eye" style="transform-origin:1360px 190px"><ellipse class="eye-glow" cx="1360" cy="190" rx="46" ry="15"/><ellipse class="eye-slit" cx="1360" cy="190" rx="5" ry="13"/></g>
<g class="eye" style="transform-origin:1480px 170px"><ellipse class="eye-glow" cx="1480" cy="170" rx="38" ry="12"/><ellipse class="eye-slit" cx="1480" cy="170" rx="4" ry="11"/></g>`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><style>${STYLE}</style><defs>${DEFS}</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<polygon class="shaft" points="380,0 520,0 760,1000 470,1000"/>
<polygon class="shaft" style="animation-delay:-5s" points="900,0 980,0 1180,1000 1010,1000"/>
<polygon class="shaft" style="animation-delay:-9s" points="1260,0 1320,0 1420,1000 1300,1000"/>
<ellipse class="pulse" cx="800" cy="930" rx="760" ry="300" fill="url(#glow)"/>
${CITY}
<g>${bubbles}</g>
${EYE}
<g fill="url(#tent)">${TENTACLE_MARKUP}</g>
</svg>`
