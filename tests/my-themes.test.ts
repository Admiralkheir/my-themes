import { expect, mock, test } from 'claude-code/testing'
import type { On, ThemeSetArgs } from 'claude-code'

type World = { sets: ThemeSetArgs[]; clears: number; store: Record<string, unknown> }

/** The engine beneath the mod: one repository (its main tree at /repo), a desktop row id, a theme noun that records. */
function world(on: On, stored: Record<string, unknown> = {}, hostId = 'local_a'): World {
  const seen: World = { sets: [], clears: 0, store: { ...stored } }

  mock.env(on, { CLAUDE_CODE_HOST_SESSION_ID: hostId })
  on('store.get', (_, e) => ({ value: seen.store[e.key] }))
  on('store.set', (_, e) => {
    seen.store[e.key] = e.value

    return { value: undefined }
  })
  on('store.delete', (_, e) => {
    delete seen.store[e.key]

    return { value: undefined }
  })
  on('store.keys', () => ({ value: Object.keys(seen.store) }))
  on('session.root', () => ({ value: '/repo/.claude/worktrees/wt-1' }))
  on('session.repo', () => ({ value: { name: 'repo', root: '/repo', remote: null, internal: false } }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('theme.set', (_, e) => {
    seen.sets.push(e)

    return { value: { isDrawn: true, requestId: 'r' } }
  })
  on('theme.clear', () => {
    seen.clears += 1

    return { value: { isDrawn: false, reason: 'cleared' } }
  })

  return seen
}

type Starts = { session: { start: (input: { cwd: string; surface: 'desktop'; isInteractive: boolean }) => Promise<unknown> } }

const start = ($: Starts) =>
  $.session.start({ cwd: '/repo/.claude/worktrees/wt-1', surface: 'desktop', isInteractive: true })

test('a project pick sends a backdrop alone, never a palette, kept under the main tree', async ($, on) => {
  const seen = world(on)

  await start($)
  expect(seen.sets.length).toBe(0)
  expect(seen.clears).toBe(0)

  const answer = await $.command.run({ command: 'my-theme', args: 'cthulhu' } as never)

  expect(String((answer as { text?: string }).text)).toContain('this project')
  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"cthulhu"')
  expect(seen.store['project:/repo']).toBe('cthulhu')
})

test('another session of the project takes the pick at its start', async ($, on) => {
  const seen = world(on, { 'project:/repo': 'cthulhu' }, 'local_b')

  await start($)
  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
})

test('"off session" clears this session alone and keeps the project pick', async ($, on) => {
  const seen = world(on, { 'project:/repo': 'cthulhu' })

  await start($)
  await $.command.run({ command: 'my-theme', args: 'off session' } as never)

  expect(seen.clears).toBe(1)
  expect(seen.store['project:/repo']).toBe('cthulhu')
  expect(seen.store['session:local_a']).toEqual({ theme: null })

  // "follow" drops the session's own pick and shows the project's again.
  await $.command.run({ command: 'my-theme', args: 'follow' } as never)
  expect(seen.store['session:local_a']).toBeUndefined()
  expect(seen.sets.length).toBe(2)
})

test('a session pick wins over the project, and off for the project leaves another mod alone', async ($, on) => {
  const seen = world(on)

  await start($)
  // Nothing of this mod's is shown: an off must not clear what another mod set.
  await $.command.run({ command: 'my-theme', args: 'off' } as never)
  expect(seen.clears).toBe(0)

  await $.command.run({ command: 'my-theme', args: 'cthulhu session' } as never)
  expect(seen.store['session:local_a']).toEqual({ theme: 'cthulhu' })
  expect(seen.store['project:/repo']).toBeUndefined()
  expect(seen.sets.length).toBe(1)
})

test('the light theme asks for a light window and still sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'cthulhu-mist' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"cthulhu-mist"')
  expect(seen.store['project:/repo']).toBe('cthulhu-mist')
})

test('the frostpunk theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'frostpunk session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"frostpunk"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'frostpunk' })
})

test('the frostpunk-whiteout theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'frostpunk-whiteout session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"frostpunk-whiteout"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'frostpunk-whiteout' })
})

test('the automatons theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'automatons session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"automatons"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'automatons' })
})

test('the automatons-whiteout theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'automatons-whiteout session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"automatons-whiteout"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'automatons-whiteout' })
})

test('the innsmouth theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'innsmouth session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"innsmouth"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'innsmouth' })
})

test('the innsmouth-fog theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'innsmouth-fog session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"innsmouth-fog"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'innsmouth-fog' })
})

test('the colour theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'colour session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"colour"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'colour' })
})

test('the colour-blight theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'colour-blight session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"colour-blight"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'colour-blight' })
})

test('the lighthouse theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'lighthouse session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"lighthouse"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'lighthouse' })
})

test('the lighthouse-day theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'lighthouse-day session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"lighthouse-day"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'lighthouse-day' })
})

test('the yog-sothoth-vellum theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'yog-sothoth-vellum session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"yog-sothoth-vellum"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'yog-sothoth-vellum' })
})

test('the eva-tokyo3 theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-tokyo3 session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-tokyo3"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-tokyo3' })
})

test('the eva-tokyo3-summer theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-tokyo3-summer session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-tokyo3-summer"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-tokyo3-summer' })
})

test('the eva-nerv theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-nerv session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-nerv"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-nerv' })
})

test('the eva-nerv-briefing theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-nerv-briefing session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-nerv-briefing"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-nerv-briefing' })
})

test('the eva-yashima theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-yashima session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-yashima"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-yashima' })
})

test('the eva-ramiel-noon theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-ramiel-noon session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-ramiel-noon"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-ramiel-noon' })
})

test('the eva-geofront theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-geofront session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-geofront"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-geofront' })
})

test('the eva-geofront-day theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-geofront-day session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-geofront-day"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-geofront-day' })
})

test('the eva-red-sea theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-red-sea session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-red-sea"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-red-sea' })
})

test('the eva-red-sea-day theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'eva-red-sea-day session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"eva-red-sea-day"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'eva-red-sea-day' })
})

test('the metro-station theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-station session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-station"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-station' })
})

test('the metro-polis theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-polis session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-polis"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-polis' })
})

test('the metro-surface theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-surface session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-surface"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-surface' })
})

test('the metro-ash theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-ash session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-ash"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-ash' })
})

test('the metro-locomotive theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-locomotive session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-locomotive"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-locomotive' })
})

test('the metro-locomotive-day theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-locomotive-day session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-locomotive-day"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-locomotive-day' })
})

test('the metro-dry-sea-night theme asks for a dark window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-dry-sea-night session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('dark')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-dry-sea-night"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-dry-sea-night' })
})

test('the metro-dry-sea theme asks for a light window and sends no palette', async ($, on) => {
  const seen = world(on)

  await start($)
  await $.command.run({ command: 'my-theme', args: 'metro-dry-sea session' } as never)

  expect(seen.sets.length).toBe(1)
  expect(seen.sets[0]?.colors).toBeUndefined()
  expect(seen.sets[0]?.overrideColorScheme).toBe('light')
  expect(JSON.stringify(seen.sets[0]?.backdrop)).toContain('"scene":"metro-dry-sea"')
  expect(seen.store['session:local_a']).toEqual({ theme: 'metro-dry-sea' })
})
