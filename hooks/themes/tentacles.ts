// Tentacles that writhe, shared by the scenes that have them.
//
// Each tentacle is a chain of joints, every joint a group that turns about its
// own point, nested so the turns add up toward the tip; each joint starts a
// little later than the one below it, so a bend travels up the limb.
//
// Drawn in the scene's own coordinates, with no transform on any group around
// it, so every joint turns about a positive point, as in the app's examples.
// Suckers carry the class `sk`, which the scene colors in its own style.

const r1 = (n: number) => Math.round(n * 10) / 10

export type TentacleSpec = {
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

// One keyframe per swing, its degrees written out: a joint's swing rounds to a
// half degree and names its class and keyframe (`j35` swings 3.5 degrees each way).
const swingName = (deg: number) => `j${Math.round(deg * 10)}`

function tentacle(t: TentacleSpec, swings: Set<number>): string {
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

/** The tentacles' markup, and the keyframes their joints swing by, for the scene's own style. */
export function tentacles(specs: TentacleSpec[]): { markup: string; style: string } {
  const swings = new Set<number>()
  const markup = specs.map(t => tentacle(t, swings)).join('')
  const style = [...swings]
    .sort((a, b) => a - b)
    .map(deg => {
      const name = swingName(deg)
      return `.${name}{animation:${name} 5s ease-in-out infinite alternate}@keyframes ${name}{from{transform:rotate(-${deg}deg)}to{transform:rotate(${deg}deg)}}`
    })
    .join('\n')

  return { markup, style }
}
