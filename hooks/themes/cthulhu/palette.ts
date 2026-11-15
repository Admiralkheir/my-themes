import { makeColors } from '../../make-colors.js'

// Dark: the drowned city of R'lyeh. Light: a page of a forbidden tome in the Miskatonic library.
export const { theme, problems } = makeColors({
  label: "Cthulhu — R'lyeh",
  id: 'cthulhu-rlyeh',
  roles: {
    accent: '#2fb5a3',   // phosphorescent abyssal teal
    danger: '#c4433b',   // spilled blood on wet stone
    success: '#8fb03a',  // sickly lichen
    warning: '#c9a227',  // tarnished Innsmouth gold
    pro: '#8a5cc7',      // eldritch violet of the stars-are-right
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e4d9bf',
        'surface-1': '#eae0c9',
        'surface-2': '#f2ead7',
        'surface-3': '#f2ead7',
        'text-primary': '#1b231f',
        'text-secondary': '#3b4740',
        'text-muted': '#56615a',
      },
    },
    roles: { warning: '#9a6d0c', accent: '#1f8f80' },
    git: { added: '#2f7a3a', removed: '#a5302a', modified: '#8a5f0a', merged: '#6a3fb0', closed: '#a5302a', conflicting: '#8a5f0a', draft: '#56615a' },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#060e0d',
        'surface-1': '#0b1615',
        'surface-2': '#101d1b',
        'surface-3': '#152422',
        'text-primary': '#d5e7db',
        'text-secondary': '#a8c1b3',
        'text-muted': '#86a194',
      },
    },
    git: { added: '#6cc077', removed: '#e0625a', modified: '#d4b03a', merged: '#a786e0' },
  },
})
