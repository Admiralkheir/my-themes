import type { ThemeBackdropGlass } from 'claude-code'

import { SCENE as cthulhuScene } from './themes/cthulhu/scene.js'

/**
 * One theme on the card. Like /custom-theme, a theme is a backdrop alone: a scene, the glass over it and the kind
 * of window it is made for. No `colors` palette is sent: the desktop app keeps a mod's palette as its own colors
 * for every session (Settings, Appearance, "A mod set the colors"), and turning the theme off does not take it
 * back. `themes/cthulhu/palette.ts` stays beside the scene, unused, for the day the app keeps a palette per session.
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
    // The palette's dark surface-1, so the panels keep the abyss's green-black.
    glass: { blur: 10, tint: '#0b1615', opacity: 0.55 },
    scene: cthulhuScene,
  },
]

export function themeNamed(name: string | null | undefined): MyTheme | undefined {
  if (typeof name !== 'string') {
    return undefined
  }
  const key = name.trim().toLowerCase()

  return THEMES.find(theme => theme.id === key || theme.title.toLowerCase() === key)
}
