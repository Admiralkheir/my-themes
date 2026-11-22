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
| `frostpunk-whiteout` | Frostpunk — Whiteout | light | The same frozen city by grey daylight, where the generator stands dark against the snow, its smoke rolls charcoal across a pale sky and, now and then, a steam walker strides along the rim. |
| `automatons` | Frostpunk — The Automatons | dark | Steam automatons striding across a frozen plain at night on jointed legs, furnaces glowing, stacks smoking and searchlights on the snow, under a faint aurora. |
| `automatons-whiteout` | Frostpunk — Automatons in the Whiteout | light | The same automatons by grey daylight, dark iron striding through the snow with smoke rolling from their stacks across a pale sky. |
| `innsmouth` | Cthulhu — Innsmouth | dark | A crooked harbor town by moonlight, where windows flicker, a lighthouse beam sweeps the bay and, out on Devil Reef, figures rise from the water with glowing eyes. |
| `innsmouth-fog` | Cthulhu — Innsmouth in the Fog | light | The same harbor on a grey-green morning, fog drifting past the gambrel roofs, the striped lighthouse and the reef where something surfaces. |
| `colour` | Cthulhu — The Colour Out of Space | dark | A blighted farm at night, where dead branches move without wind and a colour that is no colour climbs out of the old well into the sky. |
| `colour-blight` | Cthulhu — The Blasted Heath | light | The same farm by a bleached day, ash-grey grass and grey trees, with the colour left only in the well, the crystals and the grass around it. |
| `lighthouse` | Cthulhu — The Light | dark | A lighthouse on a bare rock in a black-and-white storm, its beam swinging toward you and away, gulls crossing, the sea breaking white and a limb rising from the swell. |
| `lighthouse-day` | Cthulhu — The Light by Day | light | The same lighthouse under a silver sky, the white tower against the grey sea, spray bursting on the rock and a limb rising from the swell. |
| `yog-sothoth-vellum` | Cthulhu — Yog-Sothoth on Vellum | light | A plate from a forbidden book: Yog-Sothoth as a cluster of globes drawn in iron-gall ink, held in astrolabe rings that turn against each other, with a red rubric and the text running down the margin. |
| `eva-tokyo3` | Evangelion — Tokyo-3 at Dusk | dark | The fortress city at sunset, where towers sink into the Geofront and rise again, Unit-01 stands among them, wires sag between the telephone poles and, now and then, its eyes light. |
| `eva-tokyo3-summer` | Evangelion — Tokyo-3, Endless Summer | light | The same city at a hard summer noon after Second Impact, thunderheads over the hills, heat haze off the street and Unit-01 standing purple and green among the towers. |
| `eva-nerv` | Evangelion — NERV, Pattern Blue | dark | The command deck as an Angel comes: a honeycomb of EMERGENCY panels flashing, the three MAGI voting, sync waves swelling and an alarm band crawling across the top, in orange on black. |
| `eva-nerv-briefing` | Evangelion — NERV Briefing | light | The same screens in the title cards' white, black and red: compressed serif, flashing red panels and the MAGI weighing their verdict. |
| `eva-yashima` | Evangelion — Operation Yashima | dark | Ramiel turning over a blacked-out Tokyo-3, drilling toward the Geofront, while the positron rifle on the hill waits on all of Japan's power and, now and then, fires into an orange flare of AT Field. |
| `eva-ramiel-noon` | Evangelion — Ramiel at Noon | light | The blue octahedron hanging over the lake on a clear day, its faces turning and holding the sky, its likeness broken by ripples below. |
| `eva-geofront` | Evangelion — Geofront Alert | dark | The hollow under Tokyo-3 with the city's towers hanging from its roof, shafts of light on the forest and NERV's black pyramid, red lamps pulsing along its edges. |
| `eva-geofront-day` | Evangelion — The Geofront by Day | light | The same hollow with daylight piped down onto green trees and a blue lake, dust drifting in the shafts around the black pyramid. |
| `eva-red-sea` | Evangelion — The Red Sea | dark | The beach after Third Impact at night: a sea of LCL breaking red on white sand, a moon smeared with blood and the broken white head on the horizon, one eye open, looking. |
| `eva-red-sea-day` | Evangelion — The Red Sea by Day | light | The same beach under a bleached, rose-white sky, the sea still red, the sand white and the giant head pale against the haze. |

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

1. Make a folder under `hooks/themes/<id>/` with `scene.ts` (one SVG string). Tentacles that writhe come from `hooks/themes/tentacles.ts`; the Evangelion scenes share their helpers and Unit-01 in `hooks/themes/eva.ts`.
2. Add an entry for it to `THEMES` in `hooks/themes.ts`: its `window` (`light` or `dark`) and its `glass`, with a `tint` from the theme's ground.
3. Add a row for it to the table under Themes above.
4. Raise `version` in `.claude-plugin/plugin.json`, run `claude plugin test .`, then commit and push.
5. Update the installed copy as under Install.

Build a scene only from what the app's own example themes use: CSS keyframes with written-out values, `transform-origin` in positive px, `animation-duration` and `animation-delay` set inline, no `var()` inside a keyframe, no SMIL, and no `@media` but `@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`. Other constructs made the desktop app hold the whole scene still.
