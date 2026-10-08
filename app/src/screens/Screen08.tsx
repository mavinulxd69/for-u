import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta, ParticleLayer, Reveal, RevealItem } from '@/components/bits'
import { proposalConfig, screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import type { ConfettiCanvas } from '@/lib/confetti'
import { sfx } from '@/lib/sound'

/**
 * 3×3 memory puzzle — tap two tiles to swap them back into place.
 * Solved order is 0..8. Fully touch friendly.
 */
export default function Screen08() {
  const { go, setPuzzleCompleted, completeGame, addRizz } = useExperience()
  const [order, setOrder] = useState<number[]>([4, 0, 2, 1, 5, 8, 6, 3, 7])
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const particles = useRef<ConfettiCanvas | null>(null)

  const tap = (idx: number) => {
    if (done) return
    if (selected === null) {
      setSelected(idx)
      sfx.click()
      return
    }
    if (selected === idx) {
      setSelected(null)
      return
    }
    const next = [...order]
    ;[next[selected], next[idx]] = [next[idx], next[selected]]
    setOrder(next)
    setSelected(null)
    sfx.pop()

    if (next.every((tile, index) => tile === index)) {
      setDone(true)
      setPuzzleCompleted()
      completeGame('puzzle')
      addRizz(15)
      sfx.success()
      const el = document.getElementById('puzzle-grid')
      if (el && particles.current) {
        const r = el.getBoundingClientRect()
        particles.current.burst(r.left + r.width / 2, r.top + r.height / 2, 60, true)
      }
    }
  }

  return (
    <SceneShell accent="rgba(251,191,36,0.10)" accent2="rgba(225,29,72,0.12)">
      <ParticleLayer apiRef={particles} />
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-md flex-col items-center text-center">
          <RevealItem>
            <Kicker>Memory Lane</Kicker>
          </RevealItem>
          <RevealItem>
            <div className="flex items-center justify-center gap-4">
              <img src={screenMedia.screen08.src} alt="" className="floaty w-16 rounded-xl border border-white/15 object-cover opacity-90 sm:w-20" draggable={false} />
              <div className="text-left">
                <h1 className="text-xl font-bold sm:text-2xl">Put the memory back together.</h1>
                <Meta className="mt-1.5">Take your time. I&apos;m definitely not watching.</Meta>
              </div>
            </div>
          </RevealItem>

          <RevealItem className="mt-7 w-full">
            <motion.div
              id="puzzle-grid"
              animate={done ? { boxShadow: '0 0 60px -8px rgba(244,63,94,0.7)' } : {}}
              className="relative mx-auto grid aspect-square w-full max-w-[340px] grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm"
            >
              {order.map((tile, idx) => (
                <motion.button
                  key={tile}
                  layout
                  type="button"
                  onClick={() => tap(idx)}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className={`relative aspect-square overflow-hidden rounded-xl ${
                    selected === idx ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-[#0a0a0d]' : ''
                  }`}
                  style={{ filter: done ? 'none' : 'saturate(0.85) brightness(0.92)' }}
                >
                  <div
                    className="absolute h-[300%] w-[300%]"
                    style={{
                      backgroundImage: `url(${proposalConfig.memoryPhoto})`,
                      backgroundSize: '100% 100%',
                      transform: `translate(-${(tile % 3) * 33.333}%, -${Math.floor(tile / 3) * 33.333}%)`,
                    }}
                  />
                  {selected === idx && <div className="absolute inset-0 bg-rose-400/20" />}
                </motion.button>
              ))}

              {/* light sweep on completion */}
              {done && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="light-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                </div>
              )}
            </motion.div>
          </RevealItem>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-7 flex flex-col items-center"
              >
                <h2 className="text-2xl font-bold">You did it.</h2>
                <p className="mt-2 max-w-xs text-white/70">Some things just look better when all the pieces are together.</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="mt-3 text-sm text-white/50"
                >
                  Okay... that sounded suspiciously romantic.
                </motion.p>
                <div className="mt-6">
                  <MagneticButton onClick={() => go(9, 'punch')}>Continue before I embarrass myself →</MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </SceneShell>
  )
}
