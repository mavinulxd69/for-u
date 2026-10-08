import { motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { MediaFrame } from '@/components/MediaFrame'
import { SceneShell } from '@/components/SceneShell'
import { Kicker, Reveal, RevealItem, Toast } from '@/components/bits'
import { screenMedia } from '@/config'
import { useExperience } from '@/context/Experience'
import { sfx } from '@/lib/sound'

export default function Screen02() {
  const { go, addRizz } = useExperience()
  const [accepted, setAccepted] = useState(false)

  const accept = () => {
    setAccepted(true)
    addRizz(5)
    sfx.success()
  }

  return (
    <SceneShell>
      <Toast show={accepted}>MISSION ACCEPTED</Toast>
      <div className="flex h-full flex-col items-center justify-center px-6 pb-16 pt-24">
        <Reveal className="flex w-full max-w-md flex-col items-center text-center">
          <RevealItem>
            <Kicker>Classified · Eyes Only</Kicker>
          </RevealItem>
          <RevealItem className="w-full">
            <MediaFrame
              src={accepted ? screenMedia.screen02b.src : screenMedia.screen02.src}
              aspect="aspect-[4/3]"
              className="mx-auto w-56 sm:w-64"
            />
          </RevealItem>

          {!accepted ? (
            <>
              <RevealItem>
                <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl">
                  I have a tiny mission for you. 👀
                </h1>
              </RevealItem>
              <RevealItem>
                <p className="mt-4 text-white/65">
                  Don&apos;t worry.
                  <br />
                  It&apos;s not dangerous.
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-3 font-mono2 text-xs tracking-[0.2em] text-white/40"
                >
                  Probably.
                </motion.p>
              </RevealItem>
              <RevealItem className="mt-8">
                <MagneticButton onClick={accept}>Okay... I&apos;m listening 😭</MagneticButton>
              </RevealItem>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col items-center"
            >
              <p className="text-lg text-white/85">You have absolutely no idea what you&apos;ve just agreed to.</p>
              <div className="mt-8">
                <MagneticButton onClick={() => go(3, 'mystery')}>
                  Begin the mission <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </Reveal>
      </div>
    </SceneShell>
  )
}
