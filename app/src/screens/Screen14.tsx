import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CinematicVideo } from '@/components/CinematicVideo'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { proposalConfig, screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'

const lines = [
  { text: 'Okay.', big: false },
  { text: 'Enough games.', big: true },
  { text: 'There was actually a reason I made all of this.', big: false },
  { text: 'I could have sent you a normal message.', big: false },
  { text: "But you're not exactly a normal person to me.", big: false },
  { text: 'So I wanted to make something that was a little more...', big: false },
  { text: 'us.', big: true, glow: true },
]

export default function Screen14() {
  const { go } = useExperience()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= lines.length) return
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 1400 : 2100)
    return () => window.clearTimeout(t)
  }, [step])

  const done = step >= lines.length

  return (
    <SceneShell accent="rgba(251,146,60,0.10)" accent2="rgba(225,29,72,0.14)">
      <CinematicVideo src={screenMedia.screen14.src} dim={0.62} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 pb-20 pt-20 text-center">
        {proposalConfig.herPhoto && (
          <motion.img
            src={proposalConfig.herPhoto}
            alt=""
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6 }}
            className="mb-8 h-24 w-24 rounded-full border border-white/20 object-cover shadow-[0_0_50px_-8px_rgba(244,63,94,0.5)]"
          />
        )}
        <div className="flex min-h-[220px] max-w-lg flex-col items-center justify-start space-y-5">
          {lines.slice(0, step).map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className={
                l.big
                  ? `${l.glow ? 'text-glow text-rose-200' : 'text-white'} text-3xl font-bold sm:text-4xl`
                  : 'text-lg text-white/75 sm:text-xl'
              }
            >
              {l.text}
            </motion.p>
          ))}
        </div>

        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }} className="mt-10">
            <MagneticButton onClick={() => go(15, 'emotional')}>Continue ❤️</MagneticButton>
          </motion.div>
        )}
      </div>
    </SceneShell>
  )
}
