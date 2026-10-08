import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

const options = ['Food 🍔', 'Sleep 😴', 'Money 💸', 'You 👀']
const CORRECT = 'You 👀'

export default function Screen04() {
  const { go, addRizz, recordAnswer } = useExperience()
  const [phase, setPhase] = useState<'ask' | 'analyzing' | 'result'>('ask')
  const [progress, setProgress] = useState(0)
  const [wasRight, setWasRight] = useState(false)

  const choose = (o: string) => {
    if (phase !== 'ask') return
    const right = o === CORRECT
    setWasRight(right)
    recordAnswer('weakness', o)
    setPhase('analyzing')
    setProgress(0)
    sfx.pop()
  }

  useEffect(() => {
    if (phase !== 'analyzing') return
    const t = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(t)
          window.setTimeout(() => {
            setPhase('result')
            if (wasRight) {
              sfx.success()
              addRizz(10)
            } else sfx.fail()
          }, 350)
          return 100
        }
        return p + 2 + Math.random() * 5
      })
    }, 60)
    return () => window.clearInterval(t)
  }, [phase, wasRight, addRizz])

  return (
    <SceneShell accent="rgba(34,211,238,0.08)" accent2="rgba(225,29,72,0.12)">
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-md flex-col items-center text-center">
          <RevealItem>
            <Kicker>Diagnostic Unit</Kicker>
          </RevealItem>

          {phase !== 'result' && (
            <>
              <RevealItem>
                <MediaFrame src={screenMedia.screen04.src} aspect="aspect-[3/4]" className="mx-auto w-32 sm:w-36" glow="rgba(34,211,238,0.25)" />
              </RevealItem>
              <RevealItem>
                <h1 className="mt-6 text-2xl font-bold sm:text-3xl">What&apos;s my biggest weakness?</h1>
              </RevealItem>
            </>
          )}

          {phase === 'ask' && (
            <RevealItem className="mt-7 w-full">
              <div className="grid grid-cols-2 gap-3">
                {options.map((o) => (
                  <motion.button
                    key={o}
                    type="button"
                    onClick={() => choose(o)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="min-h-[64px] rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-4 text-base font-medium backdrop-blur-md"
                  >
                    {o}
                  </motion.button>
                ))}
              </div>
            </RevealItem>
          )}

          {phase === 'analyzing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 w-full">
              <Meta className="mb-3 text-cyan-300/80">Analyzing...</Meta>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-rose-400 to-fuchsia-400"
                  style={{ width: `${Math.min(100, progress)}%`, boxShadow: '0 0 16px rgba(244,63,94,0.7)' }}
                />
                <div className="scanline absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
              <div className="font-mono2 mt-3 text-sm text-white/70">{Math.min(100, Math.round(progress))}%</div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="flex w-full flex-col items-center"
            >
              {wasRight ? (
                <>
                  <h2 className="text-glow text-3xl font-bold sm:text-4xl">Correct.</h2>
                  <p className="mt-3 text-white/70">Unfortunately, you&apos;re becoming a serious problem.</p>
                  <MediaFrame
                    src={screenMedia.screen04b.src}
                    caption={screenMedia.screen04b.caption}
                    aspect="aspect-[4/3]"
                    className="mx-auto mt-6 w-56 sm:w-64"
                  />
                  <div className="mt-8">
                    <MagneticButton onClick={() => go(5, 'punch')}>Next test →</MagneticButton>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold sm:text-3xl">Bold answer.</h2>
                  <p className="mt-3 text-white/70">Wrong, but bold. The correct answer was obviously &quot;You 👀&quot;.</p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <MagneticButton variant="ghost" onClick={() => setPhase('ask')}>
                      Try again
                    </MagneticButton>
                    <MagneticButton onClick={() => go(5, 'punch')}>Next test →</MagneticButton>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </Reveal>
      </div>
    </SceneShell>
  )
}
