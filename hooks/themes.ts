import type { ThemeBackdropGlass } from 'claude-code'

import { SCENE as cthulhuScene } from './themes/cthulhu/scene.js'
import { SCENE as cthulhuMistScene } from './themes/cthulhu-mist/scene.js'
import { SCENE as frostpunkScene } from './themes/frostpunk/scene.js'
import { SCENE as frostpunkWhiteoutScene } from './themes/frostpunk-whiteout/scene.js'
import { SCENE_DAY as automatonsDayScene, SCENE_NIGHT as automatonsNightScene } from './themes/automatons/scene.js'

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
]

export function themeNamed(name: string | null | undefined): MyTheme | undefined {
  if (typeof name !== 'string') {
    return undefined
  }
  const key = name.trim().toLowerCase()

  return THEMES.find(theme => theme.id === key || theme.title.toLowerCase() === key)
}
