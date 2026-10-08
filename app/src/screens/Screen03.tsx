import { motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Reveal, RevealItem } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

const options = [
  { id: 'A', label: 'Something serious 😐', response: 'Serious? Wow. You have way too much faith in me.' },
  { id: 'B', label: 'Something stupid 😂', response: 'Finally. Someone who understands me.' },
  { id: 'C', label: 'Something suspicious 👀', response: 'Suspicious? I prefer the term mysterious.' },
  { id: 'D', label: 'You finally confessing? 😏', response: '...We need to talk about your detective skills.', slow: true },
] as const

export default function Screen03() {
  const { go, addRizz, recordAnswer } = useExperience()
  const [picked, setPicked] = useState<string | null>(null)
  const [showResponse, setShowResponse] = useState(false)

  const pick = (id: string, slow?: boolean) => {
    if (picked) return
    setPicked(id)
    recordAnswer('whatIsThis', id)
    addRizz(5)
    sfx.pop()
    window.setTimeout(() => setShowResponse(true), slow ? 1400 : 600)
  }

  const chosen = options.find((o) => o.id === picked)

  return (
    <SceneShell accent="rgba(139,92,246,0.14)" accent2="rgba(225,29,72,0.10)">
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-lg flex-col items-center text-center">
          <RevealItem>
            <Kicker>Investigation · Exhibit A</Kicker>
          </RevealItem>
          <RevealItem>
            <MediaFrame src={screenMedia.screen03.src} aspect="aspect-square" className="mx-auto w-36 sm:w-44" glow="rgba(139,92,246,0.35)" />
          </RevealItem>
          <RevealItem>
            <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Before we continue...</h1>
            <p className="mt-2 text-white/65">What do you think this website is about?</p>
          </RevealItem>

          <RevealItem className="mt-7 w-full">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((o) => {
                const active = picked === o.id
                const dim = picked && !active
                return (
                  <motion.button
                    key={o.id}
                    type="button"
                    onClick={() => pick(o.id, 'slow' in o && o.slow)}
                    animate={{
                      scale: active ? 1.05 : 1,
                      filter: dim ? 'blur(2px)' : 'blur(0px)',
                      opacity: dim ? 0.45 : 1,
                    }}
                    whileHover={picked ? {} : { y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`min-h-[56px] rounded-2xl border px-5 py-4 text-left text-[15px] font-medium backdrop-blur-md transition-colors ${
                      active
                        ? 'border-rose-400/60 bg-rose-500/15 text-white shadow-[0_0_36px_-6px_rgba(244,63,94,0.6)]'
                        : 'border-white/12 bg-white/[0.05] text-white/85'
                    }`}
                  >
                    <span className="font-mono2 mr-2 text-[11px] text-rose-300/80">{o.id}.</span>
                    {o.label}
                  </motion.button>
                )
              })}
            </div>
          </RevealItem>

          {showResponse && chosen && (
            <motion.div
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="mt-7 flex flex-col items-center"
            >
              <p className="max-w-sm text-lg text-white/85">{chosen.response}</p>
              <div className="mt-7">
                <MagneticButton onClick={() => go(4, 'punch')}>
                  Continue the investigation <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </Reveal>
      </div>
    </SceneShell>
  )
}
