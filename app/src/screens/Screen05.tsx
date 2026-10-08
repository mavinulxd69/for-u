import { motion, useMotionValueEvent, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

const metrics = ['Confidence', 'Humor', 'Chemistry', 'Potential']

export default function Screen05() {
  const { go, addRizz } = useExperience()
  const [phase, setPhase] = useState<'idle' | 'measuring' | 'scored' | 'maxed'>('idle')
  const [metricIdx, setMetricIdx] = useState(0)
  const [display, setDisplay] = useState(0)
  const target = useRef(73)
  const score = useSpring(0, { stiffness: 60, damping: 18 })

  useMotionValueEvent(score, 'change', (v) => setDisplay(Math.round(v)))

  useEffect(() => {
    if (phase === 'measuring') {
      const t = window.setInterval(() => {
        setMetricIdx((i) => {
          if (i >= metrics.length) {
            window.clearInterval(t)
            target.current = 73
            score.set(73)
            window.setTimeout(() => {
              setPhase('scored')
              sfx.success()
              addRizz(10)
            }, 700)
            return i
          }
          sfx.pop()
          return i + 1
        })
      }, 650)
      return () => window.clearInterval(t)
    }
  }, [phase, score, addRizz])

  const increase = () => {
    sfx.pop()
    const steps = [82, 91, 100]
    steps.forEach((s, i) => {
      window.setTimeout(() => {
        target.current = s
        score.set(s)
        sfx.pop()
        if (s === 100) {
          window.setTimeout(() => {
            setPhase('maxed')
            sfx.celebration()
            addRizz(15)
          }, 900)
        }
      }, i * 1100)
    })
  }

  const R = 84
  const C = 2 * Math.PI * R

  return (
    <SceneShell accent="rgba(236,72,153,0.14)" accent2="rgba(249,115,22,0.08)">
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-md flex-col items-center text-center">
          <RevealItem>
            <Kicker>Highly Unscientific</Kicker>
          </RevealItem>
          <RevealItem>
            <h1 className="text-2xl font-bold sm:text-3xl">Let&apos;s calculate your compatibility.</h1>
          </RevealItem>

          {/* dashboard ring */}
          <RevealItem className="relative mt-8">
            <div
              className="absolute -inset-8 rounded-full opacity-50 blur-3xl"
              style={{ background: `radial-gradient(50% 50% at 50% 50%, rgba(244,63,94,${0.12 + (display / 100) * 0.3}), transparent 70%)` }}
            />
            <svg width="220" height="220" viewBox="0 0 220 220" className="relative">
              <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <motion.circle
                cx="110"
                cy="110"
                r={R}
                fill="none"
                stroke="url(#rizzGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C - (C * display) / 100}
                transform="rotate(-90 110 110)"
                style={{ filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.8))' }}
              />
              <defs>
                <linearGradient id="rizzGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="55%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono2 text-[10px] tracking-[0.3em] text-white/50">RIZZ SCORE</div>
              <div className="text-glow font-mono2 text-5xl font-semibold tabular-nums">{display}%</div>
            </div>
          </RevealItem>

          {/* metric readout */}
          <div className="font-mono2 mt-6 h-24 space-y-1 text-[12px] tracking-[0.18em] text-white/55">
            {phase !== 'idle' &&
              metrics.slice(0, metricIdx).map((m) => (
                <motion.div key={m} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                  {m}... <span className="text-emerald-300">✓</span>
                </motion.div>
              ))}
            {phase === 'maxed' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-1">
                <span className="text-glow text-base font-bold tracking-[0.2em] text-rose-300">
                  RIZZ LEVEL: DANGEROUS 🔥
                </span>
              </motion.div>
            )}
          </div>

          {phase === 'idle' && (
            <RevealItem className="mt-2">
              <MagneticButton onClick={() => setPhase('measuring')}>START RIZZ TEST 🔥</MagneticButton>
            </RevealItem>
          )}

          {phase === 'scored' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
              <p className="text-white/70">That&apos;s higher than expected. I&apos;m getting nervous now.</p>
              <div className="mt-6">
                <MagneticButton onClick={increase}>Increase the Rizz →</MagneticButton>
              </div>
            </motion.div>
          )}

          {phase === 'maxed' && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
              <MediaFrame src={screenMedia.screen05.src} aspect="aspect-[4/3]" className="mx-auto w-52 sm:w-60" />
              <Meta className="mt-4">Proceed at your own risk.</Meta>
              <div className="mt-6">
                <MagneticButton onClick={() => go(6, 'game')}>One more challenge →</MagneticButton>
              </div>
            </motion.div>
          )}
        </Reveal>
      </div>
    </SceneShell>
  )
}
