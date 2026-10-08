import { motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

const stages = ['PRESS IT 👀', 'ARE YOU SURE?', 'REALLY SURE?', 'TOO LATE 😭']

export default function Screen10() {
  const { go, addRizz } = useExperience()
  const [clicks, setClicks] = useState(0)
  const done = clicks >= 3

  const press = () => {
    if (done) return
    setClicks((c) => c + 1)
    if (clicks === 2) {
      sfx.glitch()
      addRizz(5)
    } else sfx.pop()
  }

  return (
    <SceneShell accent="rgba(225,29,72,0.10)" accent2="rgba(0,0,0,0)">
      <motion.div
        animate={done ? { backgroundColor: 'rgba(0,0,0,0.45)' } : {}}
        className="flex h-full flex-col items-center justify-center px-6 pb-16 pt-24 text-center"
      >
        <Reveal className="flex w-full max-w-md flex-col items-center">
          <RevealItem>
            <Kicker>Do not panic</Kicker>
          </RevealItem>
          <RevealItem>
            <MediaFrame src={done ? screenMedia.screen10b.src : screenMedia.screen10.src} aspect="aspect-square" className="mx-auto w-40 sm:w-48" />
          </RevealItem>
          {done && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono2 mt-3 text-[11px] uppercase tracking-[0.26em] text-rose-300/90">
              {screenMedia.screen10b.caption}
            </motion.div>
          )}

          <RevealItem>
            <h1 className="mt-6 text-2xl font-bold sm:text-3xl">I need you to do one thing.</h1>
            <p className="mt-3 text-white/65">
              Press the button.
              <br />
              Trust me.
            </p>
          </RevealItem>

          <RevealItem className="mt-8 h-14">
            {!done ? (
              <motion.div key={clicks} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                <MagneticButton variant={clicks >= 2 ? 'primary' : 'danger'} onClick={press} className="min-w-[220px]">
                  {stages[clicks]}
                </MagneticButton>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-white/80">Congratulations.</p>
                <p className="mt-1 text-white/60">You have officially reached the part where things get suspicious.</p>
              </motion.div>
            )}
          </RevealItem>

          {done && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mt-8">
              <MagneticButton onClick={() => go(11, 'emotional')}>Whatever it is... continue →</MagneticButton>
            </motion.div>
          )}
        </Reveal>
      </motion.div>
    </SceneShell>
  )
}
