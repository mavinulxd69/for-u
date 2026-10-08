import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'

const sentences = [
  'I like your smile.',
  'I like talking to you.',
  'I like your energy.',
  'I like how you somehow stay in my thoughts.',
]

export default function Screen15() {
  const { go } = useExperience()
  const [step, setStep] = useState(0)
  const [finale, setFinale] = useState(false)

  useEffect(() => {
    if (step >= sentences.length) {
      const t = window.setTimeout(() => setFinale(true), 1600)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 1500)
    return () => window.clearTimeout(t)
  }, [step])

  return (
    <SceneShell accent="rgba(236,72,153,0.16)" accent2="rgba(244,114,182,0.10)">
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24 text-center">
        <Kicker>Official Statement</Kicker>
        <MediaFrame src={screenMedia.screen15.src} aspect="aspect-square" className="mx-auto w-36 sm:w-44" glow="rgba(236,72,153,0.4)" />
        <h1 className="mt-6 text-xl font-semibold text-white/85 sm:text-2xl">My official confession:</h1>

        <div className="mt-6 min-h-[150px] space-y-3">
          {sentences.slice(0, step).map((s, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8 }}
              className="text-lg text-white/80 sm:text-xl"
            >
              {s}
            </motion.p>
          ))}
        </div>

        {finale && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mt-2 flex flex-col items-center">
            <Meta className="mb-3">And honestly...</Meta>
            <motion.h2
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 160, damping: 14 }}
              className="text-glow-soft max-w-md text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              I think I like you. <span className="text-rose-400">A lot.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="mt-4 text-sm text-white/50">
              There. I said it. Happy now? 😭
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="mt-8">
              <MagneticButton onClick={() => go(16, 'proposal')}>One last thing →</MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </div>
    </SceneShell>
  )
}
