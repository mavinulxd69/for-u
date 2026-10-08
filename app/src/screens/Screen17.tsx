import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'

export default function Screen17() {
  const { go } = useExperience()
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 1000)
    const t2 = window.setTimeout(() => setStep(2), 2200)
    const t3 = window.setTimeout(() => setStep(3), 3400)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <SceneShell accent="rgba(244,114,182,0.14)" accent2="rgba(251,191,36,0.08)">
      <div className="flex h-full flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <Kicker>Processing...</Kicker>
        <motion.div animate={{ scale: [1, 0.96, 1] }} transition={{ duration: 0.6 }}>
          <MediaFrame src={screenMedia.screen17.src} aspect="aspect-[4/3]" className="mx-auto w-48 sm:w-56" glow="rgba(244,114,182,0.35)" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="mt-6 text-4xl font-extrabold sm:text-5xl"
        >
          MAYBE?
        </motion.h1>

        <div className="mt-4 min-h-[120px] space-y-3">
          {step >= 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/60">
              Hmm...
            </motion.p>
          )}
          {step >= 2 && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold">
              That&apos;s not a no.
            </motion.p>
          )}
          {step >= 3 && !reason && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/65">
              And honestly... I&apos;ll take that as progress. 😌
            </motion.p>
          )}
          {reason && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-sm">
              <p className="text-lg leading-relaxed text-white/85">
                Because I&apos;d rather build something <span className="text-rose-300">real</span> with you than just make a
                pretty website about it.
              </p>
            </motion.div>
          )}
        </div>

        {step >= 3 && !reason && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
            <MagneticButton onClick={() => go(16, 'proposal')}>Think Again ❤️</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => setReason(true)}>
              I need one more reason
            </MagneticButton>
          </motion.div>
        )}
        {reason && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-6">
            <MagneticButton onClick={() => go(16, 'proposal')}>Okay... ask me again</MagneticButton>
          </motion.div>
        )}
      </div>
    </SceneShell>
  )
}
