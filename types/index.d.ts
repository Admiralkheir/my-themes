declare module 'claude-code' {
  interface PluginState {
    'my-themes': {
      /** The card shows above the prompt: the surface draws no placed rows. */
      cardInBand: boolean
      /** The placed card was put away until /my-theme shows it again. */
      cardAway: boolean
      /** The theme this mod has set in this session, by id; null where it has set none (or cleared its own). */
      shown: string | null
    }
  }
}
