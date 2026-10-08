import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { Meta } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

export default function Screen07() {
  const { go, addRizz } = useExperience()
  const [showBtn, setShowBtn] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    addRizz(5)
    const t = window.setTimeout(() => setShowBtn(true), 2000)
    return () => window.clearTimeout(t)
  }, [addRizz])

  const done = () => {
    setLeaving(true)
    sfx.glitch()
    window.setTimeout(() => go(8, 'meme'), 420)
  }

  return (
    <SceneShell accent="rgba(250,204,21,0.10)" accent2="rgba(225,29,72,0.14)">
      <motion.div animate={leaving ? { scale: 1.6, opacity: 0 } : {}} transition={{ duration: 0.4, ease: 'easeIn' }} className="flex h-full flex-col items-center justify-center px-6 pb-16 pt-20 text-center">
        <motion.h1
          initial={{ scale: 2.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="text-glow text-[16vw] font-extrabold leading-none tracking-tight sm:text-8xl"
        >
          WAIT.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-base text-white/75 sm:text-lg"
        >
          We need a small break.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 160, damping: 16 }}
          className="relative mt-6 w-full max-w-[280px] sm:max-w-sm"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-rose-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border-4 border-white/90 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.9)]">
            <img src={screenMedia.screen07.src} alt="shocked reaction" className="w-full object-cover" draggable={false} />
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold sm:text-xl">She actually caught his heart.</p>
            <Meta className="mt-2">This was not supposed to happen this quickly.</Meta>
          </div>
        </motion.div>

        <div className="mt-8 h-14">
          {showBtn && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <MagneticButton onClick={done}>Okay I&apos;m done 😂</MagneticButton>
            </motion.div>
          )}
        </div>
      </motion.div>
    </SceneShell>
  )
}
