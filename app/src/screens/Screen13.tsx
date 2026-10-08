import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CinematicVideo } from '@/components/CinematicVideo'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

type Phase = 'party' | 'black' | 'wait' | 'glitch'

export default function Screen13() {
  const { go, state } = useExperience()
  const [phase, setPhase] = useState<Phase>('party')

  useEffect(() => {
    if (phase === 'black') {
      const t = window.setTimeout(() => setPhase('wait'), 2600)
      return () => window.clearTimeout(t)
    }
    if (phase === 'wait') {
      const t = window.setTimeout(() => {
        setPhase('glitch')
        sfx.glitch()
      }, 2400)
      return () => window.clearTimeout(t)
    }
  }, [phase])

  const stats = [
    ['HEARTS CAUGHT', state.gamesCompleted.includes('hearts')],
    ['PUZZLE COMPLETED', state.puzzleCompleted],
    ['RIZZ TEST', state.gamesCompleted.includes('hearts') || state.rizzScore > 0],
    ['SECRET FOUND', state.lettersOpened.length > 0 || state.rizzScore >= 20],
  ] as const

  return (
    <SceneShell hideChrome={phase !== 'party'}>
      <AnimatePresence mode="wait">
        {phase === 'party' && (
          <motion.div key="party" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
            <CinematicVideo src={screenMedia.screen13.src} dim={0.6} />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 pt-20 text-center">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
                <h1 className="text-glow text-4xl font-extrabold sm:text-6xl">CONGRATULATIONS 🎉</h1>
                <p className="mt-3 text-xl text-white/85">You completed the mission.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="font-mono2 mt-8 w-full max-w-xs space-y-2.5 rounded-2xl border border-white/10 bg-black/40 p-5 text-left backdrop-blur-md"
              >
                {stats.map(([label, ok], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.3 }}
                    className="flex items-center justify-between text-[12px] tracking-[0.22em] text-white/75"
                  >
                    {label}
                    <span className={ok ? 'text-emerald-300' : 'text-white/30'}>{ok ? '✓' : '—'}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-9">
                <MagneticButton onClick={() => setPhase('black')}>FINISH →</MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === 'black' && (
          <motion.div key="black" className="absolute inset-0 bg-black" exit={{ opacity: 0 }} />
        )}

        {phase === 'wait' && (
          <motion.div key="wait" className="absolute inset-0 flex items-center justify-center bg-black" exit={{ opacity: 0 }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 text-center text-2xl font-semibold text-white/90 sm:text-3xl"
            >
              Wait.
            </motion.p>
          </motion.div>
        )}

        {phase === 'glitch' && (
          <motion.div key="glitch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glitching absolute inset-0 flex flex-col items-center justify-center bg-black px-6 text-center">
            <p className="rgb-split text-2xl font-bold sm:text-3xl">You really thought that was the end?</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 14 }}
              className="mt-8"
            >
              <div className="text-glow font-mono2 text-xl font-bold tracking-[0.24em] text-rose-300 sm:text-2xl">
                FINAL LEVEL UNLOCKED 🔥
              </div>
              <div className="mt-8">
                <MagneticButton onClick={() => go(14, 'emotional')}>I&apos;m scared now 😭</MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  )
}
