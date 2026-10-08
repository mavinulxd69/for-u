import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta, ParticleLayer, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import type { ConfettiCanvas } from '@/lib/confetti'
import { sfx } from '@/lib/sound'

const NEED = 5

export default function Screen06() {
  const { go, setHearts, completeGame, addRizz } = useExperience()
  const [caught, setCaught] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [done, setDone] = useState(false)
  const [shake, setShake] = useState(0)
  const areaRef = useRef<HTMLDivElement>(null)
  const particles = useRef<ConfettiCanvas | null>(null)

  const hop = useCallback(() => {
    setPos({ x: 12 + Math.random() * 76, y: 12 + Math.random() * 72 })
  }, [])

  useEffect(() => {
    // heart drifts to a new spot every 1.6s until caught enough
    const t = window.setInterval(() => {
      if (caught < NEED) hop()
    }, 1600)
    return () => window.clearInterval(t)
  }, [caught, hop])

  const catchHeart = (e: React.PointerEvent) => {
    if (done) return
    const next = caught + 1
    setCaught(next)
    setHearts(next)
    sfx.heart()
    setShake((s) => s + 1)
    const r = areaRef.current?.getBoundingClientRect()
    if (r && particles.current) {
      particles.current.burst(e.clientX - r.left, e.clientY - r.top, 22, true)
    }
    if (next >= NEED) {
      window.setTimeout(() => {
        setDone(true)
        completeGame('hearts')
        addRizz(15)
        sfx.success()
      }, 500)
    } else {
      hop()
    }
  }

  return (
    <SceneShell accent="rgba(236,72,153,0.18)" accent2="rgba(225,29,72,0.10)">
      <div className="flex h-full flex-col px-6 pb-16 pt-24">
        <Reveal className="flex flex-col items-center text-center">
          <RevealItem>
            <Kicker>Mini Game · 01</Kicker>
          </RevealItem>
          <RevealItem>
            <h1 className="text-2xl font-bold sm:text-3xl">Okay, enough talking.</h1>
            <p className="mt-1 text-xl font-semibold text-rose-300 sm:text-2xl">Catch my heart. ❤️</p>
          </RevealItem>
        </Reveal>

        {/* game field */}
        <motion.div
          key={shake}
          animate={{ x: [0, -5, 5, -3, 0] }}
          transition={{ duration: 0.3 }}
          ref={areaRef}
          className="no-touch-scroll relative mt-5 min-h-0 w-full flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        >
          {/* floating hearts ambience (unique gif, faded into background corner) */}
          <div className="pointer-events-none absolute -right-8 -top-8 w-44 opacity-25 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]">
            <img src={screenMedia.screen06.src} alt="" className="w-full" draggable={false} />
          </div>

          <ParticleLayer apiRef={particles} />

          {/* score */}
          <div className="font-mono2 absolute left-4 top-4 z-10 text-[11px] tracking-[0.24em] text-white/70">
            HEARTS CAUGHT
            <div className="mt-1 text-2xl font-semibold text-rose-300 tabular-nums">
              {caught} <span className="text-white/40">/ {NEED}</span>
            </div>
          </div>

          {/* the heart */}
          <AnimatePresence>
            {!done && (
              <motion.button
                key={`${pos.x}-${pos.y}-${caught}`}
                type="button"
                aria-label="Catch the heart"
                onPointerDown={catchHeart}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                className="heart-beat absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-5xl"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, filter: 'drop-shadow(0 0 18px rgba(244,63,94,0.8))' }}
              >
                ❤️
              </motion.button>
            )}
          </AnimatePresence>

          {/* completion overlay */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 px-6 text-center backdrop-blur-sm"
              >
                <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-glow text-3xl font-bold">You caught it.</h2>
                  <p className="mt-3 max-w-xs text-white/70">Now I don&apos;t know how I&apos;m supposed to get it back.</p>
                  <div className="mt-7">
                    <MagneticButton onClick={() => go(7, 'meme')}>Keep it ❤️</MagneticButton>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Meta className="mt-4 text-center">Tap the heart · it&apos;s fast, be faster</Meta>
      </div>
    </SceneShell>
  )
}
