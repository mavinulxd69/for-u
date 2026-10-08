import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { CinematicVideo } from '@/components/CinematicVideo'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { Meta, ParticleLayer, Toast } from '@/components/bits'
import { proposalConfig, screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import type { ConfettiCanvas } from '@/lib/confetti'
import { playFinaleMusic, sfx } from '@/lib/sound'

export default function Screen18() {
  const { reset } = useExperience()
  const [frozen, setFrozen] = useState(true)
  const [boom, setBoom] = useState(false)
  const [kept, setKept] = useState(false)
  const particles = useRef<ConfettiCanvas | null>(null)

  useEffect(() => {
    // freeze ~300ms, then BOOM
    const t = window.setTimeout(() => {
      setFrozen(false)
      setBoom(true)
      sfx.celebration()
      playFinaleMusic(proposalConfig.song)
      // particles may need a tick to mount
      window.setTimeout(() => particles.current?.startFinale(), 120)
    }, 300)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <SceneShell hideChrome accent="rgba(244,63,94,0.2)" accent2="rgba(251,191,36,0.10)">
      <motion.div animate={frozen ? { filter: 'brightness(0.6)' } : {}} className="absolute inset-0">
        {boom && <CinematicVideo src={screenMedia.screen18.src} dim={0.55} />}
      </motion.div>
      <ParticleLayer apiRef={particles} className="z-30" />
      <Toast show={kept}>MOMENT KEPT · FOREVER ❤️</Toast>

      <div className="relative z-20 flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-20 pt-20 text-center">
        {boom && (
          <>
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <Meta className="mb-4 text-rose-200/80">It&apos;s official</Meta>
              <h1 className="text-glow text-[13vw] font-extrabold leading-none sm:text-7xl">SHE SAID YES. ❤️</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="font-mono2 mt-8 w-full max-w-xs space-y-3 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md"
            >
              <div className="text-[11px] tracking-[0.3em] text-rose-300">MISSION COMPLETE 🔥</div>
              {[
                ['RIZZ SCORE', '100 / 100'],
                ['HEART CAPTURED', '1 / 1'],
                ['PROPOSAL STATUS', 'SUCCESS ❤️'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[12px] tracking-[0.18em] text-white/75">
                  <span>{k}</span>
                  <span className="text-rose-200">{v}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="mt-9 max-w-md space-y-3">
              <p className="text-lg font-semibold">Jokes aside...</p>
              <p className="text-white/75">Thank you for making my life a little brighter.</p>
              <p className="text-white/75">I don&apos;t know exactly what the future looks like.</p>
              <p className="text-white/90">But I&apos;d really like to find out with you.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9 }} className="mt-9">
              <h2 className="text-2xl font-bold sm:text-3xl">
                ❤️ {proposalConfig.yourName} + {proposalConfig.herName} ❤️
              </h2>
              <Meta className="mt-3 text-rose-300/80">Chapter 1 starts here.</Meta>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <MagneticButton variant="ghost" onClick={reset}>
                  Replay Our Story
                </MagneticButton>
                <MagneticButton
                  onClick={() => {
                    setKept(true)
                    sfx.success()
                    window.setTimeout(() => setKept(false), 3000)
                  }}
                >
                  Keep This Moment ❤️
                </MagneticButton>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </SceneShell>
  )
}
