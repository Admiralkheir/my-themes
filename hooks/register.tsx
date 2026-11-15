import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { THEMES, themeNamed } from './themes.js'
import type { MyTheme } from './themes.js'

// One command for all of your themes, working as /custom-theme does: a theme is picked for the project (every
// session of it that made no choice of its own) or for this session alone, and it is a backdrop only, never a
// palette, so nothing of it is left in the app's own colors once it is off.
const COMMAND = 'my-theme'
const CARD = 'my-themes-card'
const SESSION_PREFIX = 'session:'
const PROJECT_PREFIX = 'project:'
// How many sessions' own picks are kept: past it, the oldest goes.
const SESSIONS_KEPT = 200

type Scope = 'project' | 'session'

const cardInBand = atom({ plugin: 'my-themes', key: 'cardInBand' } as const, false)
const cardAway = atom({ plugin: 'my-themes', key: 'cardAway' } as const, false)
const shown = atom({ plugin: 'my-themes', key: 'shown' } as const, null as string | null)

async function orNothing<T>(ask: () => Promise<T>): Promise<T | undefined> {
  try {
    return await ask()
  } catch {
    return undefined
  }
}

// ---- Where a pick is kept -------------------------------------------------------------------------------------

/** One key per row the desktop app shows (it outlives /clear), else per Claude Code session. */
async function sessionKey($: EngineInterface): Promise<string | undefined> {
  const id =
    (await orNothing(() => $.env.get('CLAUDE_CODE_HOST_SESSION_ID'))) || (await orNothing(() => $.session.id()))

  return id === undefined || id === '' ? undefined : `${SESSION_PREFIX}${id}`
}

/** One key per project: a git repository's main working tree (so its worktrees share it), else the session's root. */
async function projectKey($: EngineInterface): Promise<string> {
  const repo = await orNothing(() => $.session.repo())
  const root = repo?.root ?? (await $.session.root())

  return `${PROJECT_PREFIX}${root}`
}

/** A session's own pick: a theme's id, or null for "no theme here, whatever the project has". */
type SessionChoice = { theme: string | null }

async function sessionChoice($: EngineInterface): Promise<SessionChoice | undefined> {
  const key = await sessionKey($)
  const stored = key === undefined ? undefined : await $.store.get(key)

  // 0.1.0 kept the bare id.
  if (typeof stored === 'string') {
    return themeNamed(stored) === undefined ? undefined : { theme: stored }
  }
  if (typeof stored !== 'object' || stored === null || !('theme' in stored)) {
    return undefined
  }
  const theme = (stored as { theme: unknown }).theme

  if (theme === null) {
    return { theme: null }
  }

  return typeof theme === 'string' && themeNamed(theme) !== undefined ? { theme } : undefined
}

async function projectChoice($: EngineInterface): Promise<MyTheme | undefined> {
  const id = await $.store.get(await projectKey($))

  return typeof id === 'string' ? themeNamed(id) : undefined
}

/** What this session should show, and why. */
async function wanted($: EngineInterface): Promise<{ theme: MyTheme | undefined; from: Scope | undefined }> {
  const own = await sessionChoice($)

  if (own !== undefined) {
    return { theme: themeNamed(own.theme), from: 'session' }
  }
  const theme = await projectChoice($)

  return { theme, from: theme === undefined ? undefined : 'project' }
}

async function keepForSession($: EngineInterface, id: string | null): Promise<void> {
  const key = await sessionKey($)

  if (key === undefined) {
    throw new Error('this session has no id to keep a pick under')
  }
  await $.store.delete(key) // written again so it counts as the newest
  await $.store.set(key, { theme: id } satisfies SessionChoice)
  try {
    const kept = (await $.store.keys()).filter(name => name.startsWith(SESSION_PREFIX))

    for (const old of kept.slice(0, Math.max(0, kept.length - SESSIONS_KEPT))) {
      await $.store.delete(old)
    }
  } catch {
    // Housekeeping: the next pick tries again.
  }
}

async function dropSessionChoice($: EngineInterface): Promise<void> {
  const key = await sessionKey($)

  if (key !== undefined) {
    await $.store.delete(key)
  }
}

async function keepForProject($: EngineInterface, id: string | undefined): Promise<void> {
  const key = await projectKey($)

  if (id === undefined) {
    await $.store.delete(key)
  } else {
    await $.store.set(key, id)
  }
}

// ---- What the window shows ------------------------------------------------------------------------------------

/**
 * Shows a theme, or takes away the one this mod set. A backdrop alone, as /custom-theme sends it. A theme this mod
 * did not set (another mod's) is never cleared here.
 */
async function showTheme($: EngineInterface, theme: MyTheme | undefined): Promise<void> {
  if (theme !== undefined) {
    // A window that attaches after this still draws the theme, so "not drawn" here is no failure.
    await $.theme.set({
      backdrop: { scene: theme.id, glass: theme.glass },
      overrideColorScheme: theme.window,
    })
    await update($, shown, () => theme.id)

    return
  }
  if ((await read($, shown)) !== null) {
    await $.theme.clear()
    await update($, shown, () => null)
  }
}

/** Brings the window to what this session should show, where it differs from what this mod last showed. */
async function follow($: EngineInterface): Promise<void> {
  const { theme } = await wanted($)

  if ((theme?.id ?? null) !== (await read($, shown))) {
    await showTheme($, theme)
  }
}

async function apply($: EngineInterface, theme: MyTheme | undefined, scope: Scope): Promise<void> {
  if (scope === 'session') {
    await keepForSession($, theme?.id ?? null)
  } else {
    await keepForProject($, theme?.id)
    // A pick for the project is this session's pick too.
    await dropSessionChoice($)
  }
  await showTheme($, (await wanted($)).theme)
}

/** The session drops its own pick and takes the project's again. */
async function followProject($: EngineInterface): Promise<MyTheme | undefined> {
  await dropSessionChoice($)
  const theme = await projectChoice($)

  await showTheme($, theme)

  return theme
}

// ---- The card -------------------------------------------------------------------------------------------------

async function putCardAway($: EngineInterface): Promise<void> {
  await update($, cardInBand, () => false)
  await update($, cardAway, () => true)
}

async function pressed($: EngineInterface, act: () => Promise<unknown>, what: string): Promise<void> {
  try {
    await act()
  } catch (error) {
    $.ui.toast(`${what} could not be applied: ${String(error)}`)

    return
  }
  await putCardAway($)
}

type CardElements = Pick<ReturnType<EngineInterface['ui']['resolve']>, 'Box' | 'Text' | 'Button'>
type Now = { theme: MyTheme | undefined; from: Scope | undefined }

function statusLine(now: Now): string {
  if (now.theme === undefined) {
    return now.from === 'session' ? 'No theme in this session (its own pick)' : 'No theme'
  }

  return now.from === 'session' ? `${now.theme.title}, this session only` : `${now.theme.title}, for the project`
}

function card($: EngineInterface, { Box, Text, Button }: CardElements, now: Now) {
  const offProject = now.theme === undefined && now.from === undefined
  const offSession = now.theme === undefined && now.from === 'session'

  return (
    <Box flexDirection="column" borderStyle="round" paddingX={1} gap="md">
      <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" columnGap="md" rowGap="xs">
        <Text bold>My themes</Text>
        <Button key="close" label="Close" role="dismiss" autoFocus onPress={() => putCardAway($)}>
          Close
        </Button>
      </Box>
      <Text dimColor>{statusLine(now)}</Text>
      {THEMES.map(theme => {
        const isOn = now.theme?.id === theme.id
        const projectWord = isOn && now.from === 'project' ? '✓ Project' : 'Project'
        const sessionWord = isOn && now.from === 'session' ? '✓ This session' : 'This session'

        return (
          <Box key={`theme-${theme.id}`} flexDirection="column" gap="xs">
            <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" columnGap="md" rowGap="xs">
              <Text bold={isOn}>{theme.title}</Text>
              <Box flexDirection="row" gap={1}>
                <Button
                  key={`project-${theme.id}`}
                  label={projectWord}
                  onPress={() => pressed($, () => apply($, theme, 'project'), theme.title)}
                >
                  {projectWord}
                </Button>
                <Button
                  key={`session-${theme.id}`}
                  label={sessionWord}
                  onPress={() => pressed($, () => apply($, theme, 'session'), theme.title)}
                >
                  {sessionWord}
                </Button>
              </Box>
            </Box>
            <Text dimColor>{`${theme.blurb} For ${theme.window} windows.`}</Text>
          </Box>
        )
      })}
      <Box flexDirection="row" flexWrap="wrap" columnGap="md" rowGap="xs">
        <Button
          key="off-project"
          label={offProject ? '✓ No theme' : 'No theme'}
          onPress={() => pressed($, () => apply($, undefined, 'project'), 'No theme')}
        >
          {offProject ? '✓ No theme' : 'No theme'}
        </Button>
        <Button
          key="off-session"
          label={offSession ? '✓ None this session' : 'None this session'}
          onPress={() => pressed($, () => apply($, undefined, 'session'), 'No theme')}
        >
          {offSession ? '✓ None this session' : 'None this session'}
        </Button>
        {now.from === 'session'
          ? [
              <Button
                key="follow"
                label="Follow project"
                onPress={() => pressed($, () => followProject($), "The project's theme")}
              >
                Follow project
              </Button>,
            ]
          : []}
      </Box>
    </Box>
  )
}

const list = () => THEMES.map(theme => `${theme.id}: ${theme.title} (for ${theme.window} windows)`).join('\n')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    try {
      await $.command.register({
        name: COMMAND,
        description:
          'Your themes: alone it shows the card; with a theme’s name it applies it to this project (add "session" for this session only); "off" clears, "follow" drops this session’s own pick, "list" names them.',
      })
    } catch (error) {
      $.ui.toast(`my-themes: /${COMMAND} is not available (${String(error)})`)
    }

    // Never a clear here: that would wipe another mod's theme at every start and reload.
    const theme = await orNothing(async () => (await wanted($)).theme)

    if (theme !== undefined) {
      await orNothing(() => showTheme($, theme))
    } else {
      await orNothing(() => update($, shown, () => null))
    }

    return next(e)
  })

  // A turn's start: an open session takes a change another session of the project made. Never costs the prompt.
  on('prompt.submit', async ($, e, next) => {
    await orNothing(() => follow($))

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const words = e.args.trim().split(/\s+/).filter(word => word !== '')
    const last = words.at(-1)?.toLowerCase()
    const isScoped = words.length > 1 && (last === 'session' || last === 'project')
    const scope: Scope = isScoped && last === 'session' ? 'session' : 'project'
    const name = (isScoped ? words.slice(0, -1) : words).join(' ')
    const word = name.toLowerCase()

    if (name === '') {
      // A surface that draws no placed rows gets the card above the prompt.
      const placed = await $.ui.place({ id: CARD })

      await update($, cardInBand, () => !placed.isPlaced)
      await update($, cardAway, () => false)

      return { text: 'Pick a theme on the card.' }
    }
    if (word === 'list') {
      return { text: list() }
    }
    if (word === 'follow') {
      const theme = await followProject($)

      return {
        text:
          theme === undefined
            ? 'This session follows the project again; the project has no theme.'
            : `This session follows the project again: ${theme.title}.`,
      }
    }
    if (word === 'off' || word === 'none') {
      await apply($, undefined, scope)

      return {
        text:
          scope === 'session'
            ? 'No theme in this session. The project keeps its pick for its other sessions.'
            : 'Theme turned off for this project.',
      }
    }

    const theme = themeNamed(name)

    if (theme === undefined) {
      return { text: `No theme named "${name}". Themes:\n${list()}` }
    }
    await apply($, theme, scope)

    return {
      text:
        scope === 'session'
          ? `${theme.title} applied to this session.`
          : `${theme.title} applied to this project. Its other open sessions take it at their next turn.`,
    }
  }).catch(($, e, next) => (next.called ? next(e) : { text: 'The theme could not be changed. Try /my-theme again.' }))

  on('ui.render', { component: 'Placed' }, async ($, e, next) => {
    if (e.props.plugin !== $.plugin.name || e.props.id !== CARD) {
      return next(e)
    }
    // Put away: a placed row whose hook passes draws nothing.
    if (await read($, cardAway)) {
      return next(e)
    }

    return card($, $.ui.resolve(e), await wanted($))
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await read($, cardInBand))) {
      return next(e)
    }

    return card($, $.ui.resolve(e), await wanted($))
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const theme = themeNamed(e.props.scene)

    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.plugin !== $.plugin.name || theme === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    // One still drawing whose CSS does the moving, drawn interactive as the app's example themes are.
    return <Svg isInteractive source={theme.scene} alt={`${theme.title}: ${theme.blurb}`} />
  })
}
