import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

const letters = [
  { id: 0, seal: 'Open Me 💌', message: 'You make ordinary conversations feel special.' },
  { id: 1, seal: 'Open Me 💌', message: 'I genuinely like talking to you more than I probably admit.' },
  { id: 2, seal: 'LOCKED 🔒', locked: true, message: "And there's one thing I've been wanting to tell you.\n\nNot yet." },
]

export default function Screen11() {
  const { go, openLetter, state, addRizz } = useExperience()
  const [opening, setOpening] = useState<number | null>(null)
  const openedCount = state.lettersOpened.filter((i) => i < 2).length
  const canContinue = openedCount >= 2

  const open = (id: number) => {
    setOpening(id)
    if (!state.lettersOpened.includes(id)) {
      openLetter(id)
      if (id < 2) {
        sfx.success()
        addRizz(5)
      } else sfx.pop()
    } else sfx.click()
  }

  return (
    <SceneShell accent="rgba(251,191,36,0.14)" accent2="rgba(225,29,72,0.12)">
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>The tone changes here</Kicker>
          </RevealItem>
          <RevealItem>
            <img src={screenMedia.screen11.src} alt="" className="floaty mx-auto w-20 rounded-2xl border border-white/10 sm:w-24" draggable={false} />
          </RevealItem>
          <RevealItem>
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">Three letters. Well... two and a half.</h1>
          </RevealItem>

          <RevealItem className="mt-8 w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {letters.map((l) => {
                const opened = state.lettersOpened.includes(l.id)
                return (
                  <motion.button
                    key={l.id}
                    type="button"
                    onClick={() => open(l.id)}
                    whileHover={{ y: -6, rotate: -0.5 }}
                    whileTap={{ scale: 0.97 }}
                    className={`env-open-target group relative flex min-h-[148px] flex-col items-center justify-center rounded-2xl border p-5 backdrop-blur-md transition-colors ${
                      l.locked
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-amber-200/20 bg-gradient-to-b from-amber-100/[0.07] to-rose-300/[0.05] hover:border-amber-200/40'
                    }`}
                  >
                    <span className="text-3xl">{l.locked ? '🔒' : opened ? '💌' : '✉️'}</span>
                    <span className="font-mono2 mt-3 text-[10px] uppercase tracking-[0.28em] text-white/60">
                      {opened && !l.locked ? 'Opened' : l.seal}
                    </span>
                    <span className="font-mono2 mt-1 text-[9px] tracking-[0.2em] text-white/30">
                      LETTER {String(l.id + 1).padStart(2, '0')}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </RevealItem>
        </Reveal>

        {/* letter reader modal */}
        <AnimatePresence>
          {opening !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-md"
              onClick={() => setOpening(null)}
            >
              <motion.div
                initial={{ y: 60, opacity: 0, rotateX: 20 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-amber-100/20 bg-gradient-to-b from-[#1c1611] to-[#120e0c] p-7 text-center shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
                style={{ boxShadow: '0 0 80px -20px rgba(251,191,36,0.25), 0 40px 120px -20px rgba(0,0,0,0.9)' }}
              >
                <Meta className="text-amber-200/60">Letter {String(opening + 1).padStart(2, '0')}</Meta>
                <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-amber-50/90">{letters[opening].message}</p>
                <div className="mt-7">
                  <MagneticButton variant="ghost" onClick={() => setOpening(null)} className="px-6 py-2 text-sm">
                    {letters[opening].locked ? 'Okay, fine 😤' : 'Fold it back 🤍'}
                  </MagneticButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {canContinue && opening === null && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-[calc(env(safe-area-inset-bottom)+2.5rem)] left-1/2 z-30 -translate-x-1/2">
            <MagneticButton onClick={() => go(12, 'suspense')}>What about the locked one? →</MagneticButton>
          </motion.div>
        )}
      </div>
    </SceneShell>
  )
}
