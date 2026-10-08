import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ExperienceProvider, useExperience, type TransitionKind } from '@/context/Experience'
import Screen01 from '@/screens/Screen01'
import Screen02 from '@/screens/Screen02'
import Screen03 from '@/screens/Screen03'
import Screen04 from '@/screens/Screen04'
import Screen05 from '@/screens/Screen05'
import Screen06 from '@/screens/Screen06'
import Screen07 from '@/screens/Screen07'
import Screen08 from '@/screens/Screen08'
import Screen09 from '@/screens/Screen09'
import Screen10 from '@/screens/Screen10'
import Screen11 from '@/screens/Screen11'
import Screen12 from '@/screens/Screen12'
import Screen13 from '@/screens/Screen13'
import Screen14 from '@/screens/Screen14'
import Screen15 from '@/screens/Screen15'
import Screen16 from '@/screens/Screen16'
import Screen17 from '@/screens/Screen17'
import Screen18 from '@/screens/Screen18'

const screens: Record<number, React.ComponentType> = {
  1: Screen01, 2: Screen02, 3: Screen03, 4: Screen04, 5: Screen05, 6: Screen06,
  7: Screen07, 8: Screen08, 9: Screen09, 10: Screen10, 11: Screen11, 12: Screen12,
  13: Screen13, 14: Screen14, 15: Screen15, 16: Screen16, 17: Screen17, 18: Screen18,
}

/** every mood gets its own cinematic transition */
const transitions: Record<TransitionKind, Variants> = {
  mystery: {
    initial: { opacity: 0, scale: 1.06, filter: 'blur(14px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.97, filter: 'blur(10px)', transition: { duration: 0.45 } },
  },
  punch: {
    initial: { opacity: 0, scale: 0.86 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.22 } },
  },
  meme: {
    initial: { opacity: 0, scale: 1.5 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  },
  game: {
    initial: { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 40px)' },
    animate: { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3 } },
  },
  suspense: {
    initial: { opacity: 0, filter: 'brightness(0.4) saturate(2)' },
    animate: { opacity: 1, filter: 'brightness(1) saturate(1)', transition: { duration: 0.8 } },
    exit: { opacity: 0, x: -14, skewX: 2, filter: 'brightness(0.5)', transition: { duration: 0.35 } },
  },
  emotional: {
    initial: { opacity: 0, filter: 'blur(18px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1.5, ease: 'easeOut' } },
    exit: { opacity: 0, filter: 'blur(14px)', transition: { duration: 0.9 } },
  },
  proposal: {
    initial: { opacity: 0, filter: 'brightness(0)' },
    animate: {
      opacity: 1,
      filter: 'brightness(1)',
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, filter: 'brightness(0)', transition: { duration: 0.6 } },
  },
  glitch: {
    initial: { opacity: 0, x: 24, skewX: -6 },
    animate: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: -30, skewX: 8, filter: 'saturate(3)', transition: { duration: 0.3 } },
  },
  yes: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
}

function Stage() {
  const { screen, transition } = useExperience()
  const Screen = screens[screen] ?? Screen01
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#0a0a0d]">
      <AnimatePresence mode="wait">
        <motion.div key={screen} variants={transitions[transition]} initial="initial" animate="animate" exit="exit" className="h-full w-full">
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <ExperienceProvider>
      <Stage />
    </ExperienceProvider>
  )
}
