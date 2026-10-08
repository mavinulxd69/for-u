import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Meta, ParticleLayer, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import type { ConfettiCanvas } from '@/lib/confetti'
import { sfx } from '@/lib/sound'

const CODE = '9 - 12 - 15 - 22 - 5'
const ANSWER = 'LOVE'

export default function Screen12() {
  const { go, addRizz, recordAnswer } = useExperience()
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)
  const [granted, setGranted] = useState(false)
  const particles = useRef<ConfettiCanvas | null>(null)

  const submit = () => {
    const clean = value.trim().toUpperCase()
    if (clean === ANSWER) {
      setGranted(true)
      recordAnswer('code', clean)
      addRizz(20)
      sfx.unlock()
      const el = document.getElementById('lock-panel')
      if (el && particles.current) {
        const r = el.getBoundingClientRect()
        particles.current.burst(r.left + r.width / 2, r.top + r.height / 2, 50, true)
      }
    } else {
      setWrong(true)
      sfx.fail()
      window.setTimeout(() => setWrong(false), 1400)
    }
  }

  return (
    <SceneShell accent="rgba(52,211,153,0.08)" accent2="rgba(225,29,72,0.10)">
      <div className="font-mono2 pointer-events-none absolute bottom-3 right-5 z-20 text-[9px] tracking-[0.18em] text-white/30 sm:right-8">
        PASSWORD: {ANSWER}
      </div>
      <ParticleLayer apiRef={particles} />
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-md flex-col items-center text-center">
          <RevealItem>
            <Kicker>Access Terminal</Kicker>
          </RevealItem>
          <RevealItem>
            <MediaFrame src={granted ? screenMedia.screen12b.src : screenMedia.screen12.src} aspect="aspect-[4/3]" className="mx-auto w-44 sm:w-52" glow="rgba(52,211,153,0.25)" />
          </RevealItem>

          {!granted ? (
            <>
              <RevealItem>
                <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Okay... you&apos;ve made it this far.</h1>
                <p className="mt-2 text-white/65">But I&apos;m not giving you the final message that easily.</p>
              </RevealItem>

              <RevealItem className="mt-7 w-full">
                <motion.div
                  id="lock-panel"
                  animate={wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
                  className="rounded-2xl border border-emerald-300/15 bg-black/50 p-5 text-left backdrop-blur-md"
                >
                  <Meta className="text-emerald-300/70">Cipher key</Meta>
                  <div className="font-mono2 mt-2 text-[12px] leading-6 text-white/50">1 = A&nbsp;&nbsp;2 = B&nbsp;&nbsp;3 = C&nbsp;&nbsp;...</div>
                  <div className="my-3 h-px bg-white/10" />
                  <Meta className="text-emerald-300/70">Encrypted message</Meta>
                  <div className="font-mono2 mt-2 whitespace-nowrap text-base tracking-[0.18em] text-emerald-200 sm:text-xl sm:tracking-[0.3em]">{CODE}</div>
                </motion.div>
              </RevealItem>

              <RevealItem className="mt-5 w-full">
                <div className="flex w-full gap-2">
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="TYPE THE WORD"
                    autoCapitalize="characters"
                    className="font-mono2 min-h-[52px] min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-3 text-center text-base tracking-[0.25em] text-white placeholder:text-[11px] placeholder:tracking-[0.25em] placeholder:text-white/25 focus:border-emerald-300/50 focus:outline-none sm:text-lg sm:tracking-[0.4em]"
                  />
                  <MagneticButton onClick={submit} className="min-h-[52px] shrink-0 px-4 text-sm sm:px-5">
                    Unlock 🔓
                  </MagneticButton>
                </div>
                <AnimatePresence>
                  {wrong && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-white/60">
                      Close 😭 You&apos;re making me work for this.
                    </motion.p>
                  )}
                </AnimatePresence>
              </RevealItem>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 flex flex-col items-center">
              <motion.div
                initial={{ letterSpacing: '0.6em', opacity: 0 }}
                animate={{ letterSpacing: '0.3em', opacity: 1 }}
                className="font-mono2 text-lg font-semibold text-emerald-300"
                style={{ textShadow: '0 0 24px rgba(52,211,153,0.7)' }}
              >
                ACCESS GRANTED ❤️
              </motion.div>
              <p className="mt-4 max-w-xs text-white/75">
                The final letter says exactly what you just typed. Keep that word close. You&apos;ll need it soon.
              </p>
              <div className="mt-7">
                <MagneticButton onClick={() => go(13, 'punch')}>Claim the ending →</MagneticButton>
              </div>
            </motion.div>
          )}
        </Reveal>
      </div>
    </SceneShell>
  )
}
