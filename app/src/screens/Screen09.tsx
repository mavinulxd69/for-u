import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

const cards = [
  { text: 'I can stay awake all night for a good conversation.', lie: false },
  { text: 'I secretly overthink everything.', lie: false },
  { text: 'I never get nervous around you.', lie: true },
]

export default function Screen09() {
  const { go, addRizz, recordAnswer } = useExperience()
  const [wrong, setWrong] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)

  const pick = (i: number) => {
    if (solved) return
    if (cards[i].lie) {
      setSolved(true)
      recordAnswer('lie', String(i))
      addRizz(10)
      sfx.success()
    } else {
      setWrong(i)
      sfx.fail()
      window.setTimeout(() => setWrong(null), 900)
    }
  }

  return (
    <SceneShell accent="rgba(192,132,252,0.12)" accent2="rgba(225,29,72,0.10)">
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-md flex-col items-center text-center">
          <RevealItem>
            <Kicker>Final Round</Kicker>
          </RevealItem>
          <RevealItem>
            <MediaFrame src={screenMedia.screen09.src} aspect="aspect-[4/3]" className="mx-auto w-36 sm:w-44" glow="rgba(192,132,252,0.3)" />
          </RevealItem>
          <RevealItem>
            <h1 className="mt-6 text-2xl font-bold sm:text-3xl">How well do you know me?</h1>
            <p className="font-mono2 mt-2 text-[11px] uppercase tracking-[0.3em] text-rose-300/80">One of these is a lie</p>
          </RevealItem>

          <RevealItem className="mt-7 w-full space-y-3">
            {cards.map((c, i) => {
              const isWrong = wrong === i
              const isLie = solved && c.lie
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={solved}
                  animate={
                    isWrong
                      ? { x: [0, -10, 10, -6, 6, 0] }
                      : isLie
                        ? { rotateY: [0, 90, 0], scale: [1, 1.03, 1] }
                        : solved
                          ? { opacity: 0.4, filter: 'blur(1.5px)' }
                          : {}
                  }
                  transition={{ duration: isLie ? 0.7 : 0.45 }}
                  whileHover={!solved ? { y: -3 } : {}}
                  className={`w-full rounded-2xl border px-5 py-4 text-left text-[15px] font-medium backdrop-blur-md ${
                    isLie
                      ? 'border-emerald-300/50 bg-emerald-400/10 text-white shadow-[0_0_40px_-8px_rgba(52,211,153,0.6)]'
                      : 'border-white/12 bg-white/[0.05] text-white/85'
                  }`}
                  style={{ perspective: 600 }}
                >
                  <span className="font-mono2 mr-2 text-[11px] text-rose-300/80">{i + 1}.</span>
                  {c.text}
                  {isLie && <span className="font-mono2 ml-2 text-[10px] tracking-[0.2em] text-emerald-300">THE LIE ✓</span>}
                </motion.button>
              )
            })}
          </RevealItem>

          <AnimatePresence>
            {wrong !== null && (
              <motion.p
                key={wrong}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 text-white/70"
              >
                Nice try 😭 But you don&apos;t know all my secrets yet.
              </motion.p>
            )}
          </AnimatePresence>

          {solved && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-7 flex flex-col items-center"
            >
              <p className="text-lg text-white/85">Okay... you know me a little too well.</p>
              <div className="mt-6">
                <MagneticButton onClick={() => go(10, 'suspense')}>This is getting serious →</MagneticButton>
              </div>
            </motion.div>
          )}
        </Reveal>
      </div>
    </SceneShell>
  )
}
