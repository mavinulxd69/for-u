import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CinematicVideo } from '@/components/CinematicVideo'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { proposalConfig, screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

export default function Screen16() {
  const { go, setProposalChoice } = useExperience()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [900, 2200, 3600].map((d, i) => window.setTimeout(() => setStep(i + 1), d))
    return () => timers.forEach(clearTimeout)
  }, [])

  const yes = () => {
    setProposalChoice('yes')
    go(18, 'yes')
  }
  const maybe = () => {
    sfx.pop()
    setProposalChoice('maybe')
    go(17, 'punch')
  }

  return (
    <SceneShell hideChrome accent="rgba(244,63,94,0.18)" accent2="rgba(251,191,36,0.08)">
      <CinematicVideo src={screenMedia.screen16.src} dim={0.58} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 20 }}
          transition={{ duration: 1.2 }}
          className="font-mono2 text-[11px] uppercase tracking-[0.4em] text-white/60"
        >
          {proposalConfig.yourName}
          <span className="heart-beat mx-3 inline-block text-base tracking-normal text-rose-400">❤️</span>
          {proposalConfig.herName}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 2 ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="mt-8 text-lg text-white/70"
        >
          So... what do you say?
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
          animate={step >= 3 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-glow mt-5 max-w-xl text-4xl font-extrabold leading-tight sm:text-6xl"
        >
          Will you be mine? <span className="heart-beat inline-block">❤️</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={step >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton onClick={yes} className="min-w-[180px] px-10 py-4 text-lg">
            YES ❤️
          </MagneticButton>
          <MagneticButton onClick={maybe} variant="danger" className="min-w-[180px] px-10 py-4 text-lg">
            MAYBE 😳
          </MagneticButton>
        </motion.div>
      </div>
    </SceneShell>
  )
}
