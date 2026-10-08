import { motion } from 'framer-motion'
import { useState } from 'react'
import { CinematicVideo } from '@/components/CinematicVideo'
import { MagneticButton } from '@/components/MagneticButton'
import { Typewriter } from '@/components/Typewriter'
import { SceneShell } from '@/components/SceneShell'
import { Meta } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'

export default function Screen01() {
  const { go } = useExperience()
  const [typed, setTyped] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const enter = () => {
    setLeaving(true)
    window.setTimeout(() => go(2, 'mystery'), 650)
  }

  return (
    <SceneShell hideChrome>
      <motion.div animate={leaving ? { scale: 1.25, opacity: 0, filter: 'brightness(0.3) blur(8px)' } : {}} transition={{ duration: 0.65, ease: 'easeIn' }} className="absolute inset-0">
        <CinematicVideo src={screenMedia.screen01.src} dim={0.55} />
      </motion.div>

      <motion.div
        animate={leaving ? { opacity: 0, y: -30 } : {}}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
          </span>
          <Meta className="text-white/70">Private Experience</Meta>
        </motion.div>

        <div className="w-full max-w-md">
          <Typewriter
            lines={['Initializing...', 'Loading something important...', 'Checking visitor...', 'Analyzing...']}
            speed={30}
            pause={420}
            onDone={() => setTyped(true)}
            className="font-mono2 space-y-2 text-left text-[13px] tracking-[0.12em] text-white/60 sm:text-sm"
          />

          {typed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="inline-block rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-2"
              >
                <div className="font-mono2 text-[11px] tracking-[0.28em] text-amber-300">WARNING ⚠️</div>
                <div className="mt-1 text-sm font-medium text-amber-100">Extremely cute person detected.</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                <p className="text-xl font-semibold text-white sm:text-2xl">System ready.</p>
                <p className="mt-2 text-base text-white/70 sm:text-lg">There is something I need to show you.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
                <MagneticButton onClick={enter} className="px-9 text-base">
                  ENTER <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </SceneShell>
  )
}
