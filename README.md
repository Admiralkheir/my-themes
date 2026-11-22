# my-themes

Your own themes for the Claude desktop app. They work as `/custom-theme` does: a theme is picked for a project or for one session, and it is a backdrop alone (a scene and the glass over it), never a palette, so turning it off leaves nothing behind in the app's own colors.

- `/my-theme`: shows a card to pick a theme
- `/my-theme cthulhu`: applies a theme to this project. Other open sessions of the project that have no pick of their own take it at their next turn.
- `/my-theme cthulhu session`: applies it to this session only
- `/my-theme off`: turns the project's theme off
- `/my-theme off session`: no theme in this session, whatever the project has
- `/my-theme follow`: this session drops its own pick and follows the project again
- `/my-theme list`: names the themes

A project is a git repository's main working tree, so its worktrees share its pick; outside a repository it is the session's folder. A session started without a folder has a folder of its own, so a pick there is that session's alone.

## Themes

| Name | Theme | Window | What it shows |
| --- | --- | --- | --- |
| `cthulhu` | Cthulhu — R'lyeh | dark | An abyss where tentacles writhe, bubbles rise and, now and then, an eye opens. |
| `cthulhu-mist` | Cthulhu — Mist over R'lyeh | light | A cold grey sea in drizzle, where something vast with wings looms out of the fog and, now and then, looks back. |
| `frostpunk` | Frostpunk — The Last City | dark | A city ringed around its great generator in a frozen crater, where the furnace breathes, smoke leans into the blizzard and, now and then, a steam walker strides along the rim. |

## Install

At the prompt of a terminal session:

```
/plugin install my-themes --marketplace Admiralkheir/my-themes
```

Answer `y` to add the marketplace, then pick a scope. From a shell:

```bash
claude plugin install my-themes --marketplace Admiralkheir/my-themes
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `Admiralkheir/my-themes`, then Add plugin.

To get new themes later: `claude plugin marketplace update my-themes`, then `claude plugin update my-themes@my-themes`, then `/reload-plugins` or a restart.

## Why no palette

The desktop app keeps a palette a mod sends as its own colors for every session (Settings, Appearance: "A mod set the colors"), and turning the theme off does not take it back. So a theme here sends only its scene, the glass `tint` (the theme's ground color) and the kind of window it is made for, as `/custom-theme` does.

If the app still shows "A mod set the colors" from version 0.1.0, press Remove colors there once.

## Adding a theme

1. Make a folder under `hooks/themes/<id>/` with `scene.ts` (one SVG string). Tentacles that writhe come from `hooks/themes/tentacles.ts`.
2. Add an entry for it to `THEMES` in `hooks/themes.ts`: its `window` (`light` or `dark`) and its `glass`, with a `tint` from the theme's ground.
3. Add a row for it to the table under Themes above.
4. Raise `version` in `.claude-plugin/plugin.json`, run `claude plugin test .`, then commit and push.
5. Update the installed copy as under Install.

Build a scene only from what the app's own example themes use: CSS keyframes with written-out values, `transform-origin` in positive px, `animation-duration` and `animation-delay` set inline, no `var()` inside a keyframe, no SMIL, and no `@media` but `@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`. Other constructs made the desktop app hold the whole scene still.
