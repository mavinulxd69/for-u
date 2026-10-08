/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONALIZATION — edit these values to make it yours.
 *  Nothing else in the codebase needs to change.
 * ─────────────────────────────────────────────────────────────
 */
export const proposalConfig = {
  yourName: 'Alex',
  herName: 'Sam',
  herNickname: 'troublemaker',
  yourPhoto: '', // e.g. '/media/your-photo.jpg'
  herPhoto: '', // e.g. '/media/her-photo.jpg'
  memoryPhoto: '/media/memory-photo.png', // the photo split into the puzzle
  song: '/media/music-finale.mp3', // plays once, at the very end
  insideJoke: '',
  favoriteThing: '',
}

/**
 * ─────────────────────────────────────────────────────────────
 *  MEDIA MANIFEST — every screen owns a UNIQUE asset.
 *  Validated at boot: duplicate src = console error.
 * ─────────────────────────────────────────────────────────────
 */
export type MediaKind = 'video' | 'gif'

export const screenMedia: Record<string, { kind: MediaKind; src: string; caption?: string }> = {
  screen01: { kind: 'video', src: '/media/vid-hero-boot.mp4' },
  screen02: { kind: 'gif', src: '/media/gif-mission-spy.gif' },
  screen02b: { kind: 'gif', src: '/media/gif-mission-scheme.gif' },
  screen03: { kind: 'gif', src: '/media/gif-detective.gif' },
  screen04: { kind: 'gif', src: '/media/gif-sideeye.gif' },
  screen04b: { kind: 'gif', src: '/media/gif-facepalm.gif', caption: 'Bro is losing the battle 💀' },
  screen05: { kind: 'gif', src: '/media/gif-rizz.gif' },
  screen06: { kind: 'gif', src: '/media/gif-hearts.gif' },
  screen07: { kind: 'gif', src: '/media/gif-shocked.gif' },
  screen08: { kind: 'gif', src: '/media/gif-memories.gif' },
  screen09: { kind: 'gif', src: '/media/gif-thinking.gif' },
  screen10: { kind: 'gif', src: '/media/gif-nervous.gif' },
  screen10b: { kind: 'gif', src: '/media/gif-plan.gif', caption: 'He has a plan.' },
  screen11: { kind: 'gif', src: '/media/gif-envelope.gif' },
  screen12: { kind: 'gif', src: '/media/gif-hacker.gif' },
  screen12b: { kind: 'gif', src: '/media/gif-access.gif' },
  screen13: { kind: 'video', src: '/media/vid-fake-ending.mp4' },
  screen14: { kind: 'video', src: '/media/vid-emotional.mp4' },
  screen15: { kind: 'gif', src: '/media/gif-blush.gif' },
  screen16: { kind: 'video', src: '/media/vid-proposal.mp4' },
  screen17: { kind: 'gif', src: '/media/gif-awkward.gif' },
  screen18: { kind: 'video', src: '/media/vid-finale.mp4' },
}

// boot-time uniqueness validation
if (import.meta.env.DEV) {
  const srcs = Object.values(screenMedia).map((m) => m.src)
  const dupes = srcs.filter((s, i) => srcs.indexOf(s) !== i)
  if (dupes.length) console.error('[media manifest] DUPLICATE MEDIA:', dupes)
}

/** Scene metadata for the progress indicator */
export const sceneMeta: Record<number, { label: string; mood: string }> = {
  1: { label: 'SYSTEM BOOT', mood: 'mystery' },
  2: { label: 'THE SECRET MISSION', mood: 'mystery' },
  3: { label: 'THE VERY IMPORTANT QUESTION', mood: 'mystery' },
  4: { label: 'PERSONALITY TEST', mood: 'funny' },
  5: { label: 'RIZZ CALCULATOR', mood: 'funny' },
  6: { label: 'CATCH MY HEART', mood: 'game' },
  7: { label: 'MEME DETOUR', mood: 'meme' },
  8: { label: 'MEMORY PUZZLE', mood: 'game' },
  9: { label: 'TWO TRUTHS & A LIE', mood: 'funny' },
  10: { label: 'CONFIDENCE CHALLENGE', mood: 'suspense' },
  11: { label: 'SECRET ENVELOPES', mood: 'emotional' },
  12: { label: 'THE LOCKED MESSAGE', mood: 'suspense' },
  13: { label: 'MISSION COMPLETE?', mood: 'fake' },
  14: { label: 'THE REAL REASON', mood: 'emotional' },
  15: { label: 'THE CONFESSION', mood: 'emotional' },
  16: { label: 'THE QUESTION', mood: 'proposal' },
  17: { label: 'INTERMISSION', mood: 'funny' },
  18: { label: 'CHAPTER 1', mood: 'yes' },
}
