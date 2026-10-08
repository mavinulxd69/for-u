import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { sceneMeta } from '@/config'
import { useExperience } from '@/context/Experience'

/**
 * Wraps every scene: grain, vignette, ambient drift light,
 * chapter indicator (01 / 18 + label), chemistry note, sound toggle.
 */
export function SceneShell({
  children,
  accent = 'rgba(225,29,72,0.16)',
  accent2 = 'rgba(139,92,246,0.10)',
  hideChrome = false,
}: {
  children: ReactNode
  accent?: string
  accent2?: string
  hideChrome?: boolean
}) {
  const { screen, soundOn, toggleSound, chemistryNote } = useExperience()
  const meta = sceneMeta[screen]

  return (
    <div className="grain relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0d]">
      {/* ambient drifting light */}
      <div
        className="drift pointer-events-none absolute -inset-20"
        style={{
          background: `radial-gradient(45% 35% at 30% 20%, ${accent}, transparent 70%), radial-gradient(40% 35% at 75% 85%, ${accent2}, transparent 70%)`,
        }}
      />

      {/* chrome */}
      {!hideChrome && (
        <>
          <header
            className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-5 sm:px-8"
            style={{ paddingTop: 'max(env(safe-area-inset-top), 1.1rem)' }}
          >
            <div className="font-mono2 text-white/70">
              <div className="text-[11px] tracking-[0.3em]">
                {String(screen).padStart(2, '0')} / 18
              </div>
              <div className="mt-1 text-[10px] tracking-[0.24em] text-rose-300/80">{meta?.label}</div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="font-mono2 flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[11px] tracking-[0.2em] text-white/70 backdrop-blur-md transition hover:bg-white/10"
            >
              {soundOn ? '🔊' : '🔇'} <span className="hidden sm:inline">{soundOn ? 'SOUND' : 'MUTED'}</span>
            </button>
          </header>

          {/* chemistry note */}
          <AnimatePresence>
            {chemistryNote && (
              <motion.div
                key={chemistryNote}
                initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                className="font-mono2 absolute left-1/2 top-[calc(max(env(safe-area-inset-top),1.1rem)+52px)] z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-rose-400/25 bg-rose-500/10 px-4 py-1.5 text-[10px] tracking-[0.18em] text-rose-200/90 backdrop-blur-md"
              >
                {chemistryNote}
              </motion.div>
            )}
          </AnimatePresence>

          {/* progress line */}
          <div
            className="absolute inset-x-0 bottom-0 z-40"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="h-px w-full bg-white/[0.07]">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-violet-400"
                animate={{ width: `${(screen / 18) * 100}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                style={{ boxShadow: '0 0 12px rgba(244,63,94,0.7)', animation: 'line-glow 2.4s ease-in-out infinite' }}
              />
            </div>
          </div>
        </>
      )}

      {/* content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}
