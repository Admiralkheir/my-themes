import type { ThemeBackdropGlass } from 'claude-code'

import { SCENE as cthulhuScene } from './themes/cthulhu/scene.js'
import { SCENE as cthulhuMistScene } from './themes/cthulhu-mist/scene.js'
import { SCENE as frostpunkScene } from './themes/frostpunk/scene.js'
import { SCENE as frostpunkWhiteoutScene } from './themes/frostpunk-whiteout/scene.js'
import { SCENE_DAY as automatonsDayScene, SCENE_NIGHT as automatonsNightScene } from './themes/automatons/scene.js'
import { SCENE_FOG as innsmouthFogScene, SCENE_NIGHT as innsmouthNightScene } from './themes/innsmouth/scene.js'
import { SCENE_BLIGHT as colourBlightScene, SCENE_NIGHT as colourNightScene } from './themes/colour/scene.js'
import { SCENE_DAY as lighthouseDayScene, SCENE_NIGHT as lighthouseNightScene } from './themes/lighthouse/scene.js'
import { SCENE as yogSothothVellumScene } from './themes/yog-sothoth/scene.js'
import { SCENE_DUSK as evaTokyo3DuskScene, SCENE_SUMMER as evaTokyo3SummerScene } from './themes/eva-tokyo3/scene.js'
import { SCENE_ALERT as evaNervAlertScene, SCENE_BRIEFING as evaNervBriefingScene } from './themes/eva-nerv/scene.js'
import { SCENE_NIGHT as evaYashimaNightScene, SCENE_NOON as evaYashimaNoonScene } from './themes/eva-yashima/scene.js'
import { SCENE_ALERT as evaGeofrontAlertScene, SCENE_DAY as evaGeofrontDayScene } from './themes/eva-geofront/scene.js'
import { SCENE_DAY as evaRedSeaDayScene, SCENE_NIGHT as evaRedSeaNightScene } from './themes/eva-red-sea/scene.js'

/**
 * One theme on the card. Like /custom-theme, a theme is a backdrop alone: a scene, the glass over it and the kind
 * of window it is made for. No `colors` palette is sent: the desktop app keeps a mod's palette as its own colors
 * for every session (Settings, Appearance, "A mod set the colors"), and turning the theme off does not take it
 * back.
 *
 * To add one: make a folder under `themes/` with its scene (one SVG string), then add an entry here. Build the
 * scene only from what the app's own example themes use: CSS keyframes with written-out values,
 * `transform-origin` in positive px, no `var()` inside a keyframe and no `@media` but the reduced-motion rule.
 */
export type MyTheme = {
  /** What /my-theme <id> takes: lowercase letters, digits and hyphens. */
  id: string
  title: string
  /** One line under the title on the card. */
  blurb: string
  /** The kind of window the scene is made for. */
  window: 'light' | 'dark'
  /** The panels over the scene: `tint` is what colors them, so it carries the theme's own ground. */
  glass: ThemeBackdropGlass
  /** The backdrop: one SVG document, at most 131,072 characters. */
  scene: string
}

export const THEMES: MyTheme[] = [
  {
    id: 'cthulhu',
    title: "Cthulhu — R'lyeh",
    blurb: 'An abyss where tentacles writhe, bubbles rise and, now and then, an eye opens.',
    window: 'dark',
    // The abyss's green-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#0b1615', opacity: 0.55 },
    scene: cthulhuScene,
  },
  {
    id: 'cthulhu-mist',
    title: "Cthulhu — Mist over R'lyeh",
    blurb: 'A cold grey sea in drizzle, where something vast with wings looms out of the fog and, now and then, looks back.',
    window: 'light',
    // The overcast's cold grey, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#d5dbde', opacity: 0.55 },
    scene: cthulhuMistScene,
  },
  {
    id: 'frostpunk',
    title: 'Frostpunk — The Last City',
    blurb: 'A city ringed around its great generator in a frozen crater, where the furnace breathes, smoke leans into the blizzard and, now and then, a steam walker strides along the rim.',
    window: 'dark',
    // The blizzard night's steel blue, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#121c28', opacity: 0.55 },
    scene: frostpunkScene,
  },
  {
    id: 'frostpunk-whiteout',
    title: 'Frostpunk — Whiteout',
    blurb: 'The same frozen city by grey daylight, where the generator stands dark against the snow, its smoke rolls charcoal across a pale sky and, now and then, a steam walker strides along the rim.',
    window: 'light',
    // The whiteout's cold pale grey, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#dfe5eb', opacity: 0.55 },
    scene: frostpunkWhiteoutScene,
  },
  {
    id: 'automatons',
    title: 'Frostpunk — The Automatons',
    blurb: 'Steam automatons striding across a frozen plain at night on jointed legs, furnaces glowing, stacks smoking and searchlights on the snow, under a faint aurora.',
    window: 'dark',
    // The plain's night steel blue, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#121c28', opacity: 0.55 },
    scene: automatonsNightScene,
  },
  {
    id: 'automatons-whiteout',
    title: 'Frostpunk — Automatons in the Whiteout',
    blurb: 'The same automatons by grey daylight, dark iron striding through the snow with smoke rolling from their stacks across a pale sky.',
    window: 'light',
    // The whiteout's cold pale grey, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#dfe5eb', opacity: 0.55 },
    scene: automatonsDayScene,
  },
  {
    id: 'innsmouth',
    title: 'Cthulhu — Innsmouth',
    blurb: 'A crooked harbor town by moonlight, where windows flicker, a lighthouse beam sweeps the bay and, out on Devil Reef, figures rise from the water with glowing eyes.',
    window: 'dark',
    // The harbor night's green-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#0d1a1b', opacity: 0.55 },
    scene: innsmouthNightScene,
  },
  {
    id: 'innsmouth-fog',
    title: 'Cthulhu — Innsmouth in the Fog',
    blurb: 'The same harbor on a grey-green morning, fog drifting past the gambrel roofs, the striped lighthouse and the reef where something surfaces.',
    window: 'light',
    // The fog's pale green-grey, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#d4d8cc', opacity: 0.55 },
    scene: innsmouthFogScene,
  },
  {
    id: 'colour',
    title: 'Cthulhu — The Colour Out of Space',
    blurb: 'A blighted farm at night, where dead branches move without wind and a colour that is no colour climbs out of the old well into the sky.',
    window: 'dark',
    // The night's violet-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#120c16', opacity: 0.55 },
    scene: colourNightScene,
  },
  {
    id: 'colour-blight',
    title: 'Cthulhu — The Blasted Heath',
    blurb: 'The same farm by a bleached day, ash-grey grass and grey trees, with the colour left only in the well, the crystals and the grass around it.',
    window: 'light',
    // The bleached sky's pale grey, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#e2dde1', opacity: 0.55 },
    scene: colourBlightScene,
  },
  {
    id: 'lighthouse',
    title: 'Cthulhu — The Light',
    blurb: 'A lighthouse on a bare rock in a black-and-white storm, its beam swinging toward you and away, gulls crossing, the sea breaking white and a limb rising from the swell.',
    window: 'dark',
    // The storm's near-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#141414', opacity: 0.55 },
    scene: lighthouseNightScene,
  },
  {
    id: 'lighthouse-day',
    title: 'Cthulhu — The Light by Day',
    blurb: 'The same lighthouse under a silver sky, the white tower against the grey sea, spray bursting on the rock and a limb rising from the swell.',
    window: 'light',
    // The silver sky's pale grey, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#d9d9d6', opacity: 0.55 },
    scene: lighthouseDayScene,
  },
  {
    id: 'yog-sothoth-vellum',
    title: 'Cthulhu — Yog-Sothoth on Vellum',
    blurb: 'A plate from a forbidden book: Yog-Sothoth as a cluster of globes drawn in iron-gall ink, held in astrolabe rings that turn against each other, with a red rubric and the text running down the margin.',
    window: 'light',
    // The vellum's warm parchment, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#eadfc6', opacity: 0.55 },
    scene: yogSothothVellumScene,
  },
  {
    id: 'eva-tokyo3',
    title: 'Evangelion — Tokyo-3 at Dusk',
    blurb: 'The fortress city at sunset, where towers sink into the Geofront and rise again, Unit-01 stands among them, wires sag between the telephone poles and, now and then, its eyes light.',
    window: 'dark',
    // The dusk's violet-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#1a1022', opacity: 0.55 },
    scene: evaTokyo3DuskScene,
  },
  {
    id: 'eva-tokyo3-summer',
    title: 'Evangelion — Tokyo-3, Endless Summer',
    blurb: 'The same city at a hard summer noon after Second Impact, thunderheads over the hills, heat haze off the street and Unit-01 standing purple and green among the towers.',
    window: 'light',
    // The noon haze's pale blue, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#dfe8ef', opacity: 0.55 },
    scene: evaTokyo3SummerScene,
  },
  {
    id: 'eva-nerv',
    title: 'Evangelion — NERV, Pattern Blue',
    blurb: 'The command deck as an Angel comes: a honeycomb of EMERGENCY panels flashing, the three MAGI voting, sync waves swelling and an alarm band crawling across the top, in orange on black.',
    window: 'dark',
    // The screens' black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#0c0808', opacity: 0.55 },
    scene: evaNervAlertScene,
  },
  {
    id: 'eva-nerv-briefing',
    title: 'Evangelion — NERV Briefing',
    blurb: "The same screens in the title cards' white, black and red: compressed serif, flashing red panels and the MAGI weighing their verdict.",
    window: 'light',
    // The briefing's paper white, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#eeefed', opacity: 0.55 },
    scene: evaNervBriefingScene,
  },
  {
    id: 'eva-yashima',
    title: 'Evangelion — Operation Yashima',
    blurb: "Ramiel turning over a blacked-out Tokyo-3, drilling toward the Geofront, while the positron rifle on the hill waits on all of Japan's power and, now and then, fires into an orange flare of AT Field.",
    window: 'dark',
    // The blackout's blue-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#070c18', opacity: 0.55 },
    scene: evaYashimaNightScene,
  },
  {
    id: 'eva-ramiel-noon',
    title: 'Evangelion — Ramiel at Noon',
    blurb: 'The blue octahedron hanging over the lake on a clear day, its faces turning and holding the sky, its likeness broken by ripples below.',
    window: 'light',
    // The noon sky's pale blue, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#dcebf2', opacity: 0.55 },
    scene: evaYashimaNoonScene,
  },
  {
    id: 'eva-geofront',
    title: 'Evangelion — Geofront Alert',
    blurb: "The hollow under Tokyo-3 with the city's towers hanging from its roof, shafts of light on the forest and NERV's black pyramid, red lamps pulsing along its edges.",
    window: 'dark',
    // The cavern's dark grey-green, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#0c1012', opacity: 0.55 },
    scene: evaGeofrontAlertScene,
  },
  {
    id: 'eva-geofront-day',
    title: 'Evangelion — The Geofront by Day',
    blurb: 'The same hollow with daylight piped down onto green trees and a blue lake, dust drifting in the shafts around the black pyramid.',
    window: 'light',
    // The piped daylight's pale stone, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#e3e2d8', opacity: 0.55 },
    scene: evaGeofrontDayScene,
  },
  {
    id: 'eva-red-sea',
    title: 'Evangelion — The Red Sea',
    blurb: 'The beach after Third Impact at night: a sea of LCL breaking red on white sand, a moon smeared with blood and the broken white head on the horizon, one eye open, looking.',
    window: 'dark',
    // The night's red-black, so the panels keep the scene's ground.
    glass: { blur: 10, tint: '#140608', opacity: 0.55 },
    scene: evaRedSeaNightScene,
  },
  {
    id: 'eva-red-sea-day',
    title: 'Evangelion — The Red Sea by Day',
    blurb: 'The same beach under a bleached, rose-white sky, the sea still red, the sand white and the giant head pale against the haze.',
    window: 'light',
    // The bleached sky's rose white, so the panels keep the scene's ground and dark text stays readable.
    glass: { blur: 10, tint: '#f3e9e8', opacity: 0.55 },
    scene: evaRedSeaDayScene,
  },
]

export function themeNamed(name: string | null | undefined): MyTheme | undefined {
  if (typeof name !== 'string') {
    return undefined
  }
  const key = name.trim().toLowerCase()

  return THEMES.find(theme => theme.id === key || theme.title.toLowerCase() === key)
}
