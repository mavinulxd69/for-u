import { motion, type Variants } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { ConfettiCanvas } from '@/lib/confetti'

/** tiny mono metadata label */
export function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`font-mono2 text-[10px] uppercase tracking-[0.32em] text-white/45 ${className}`}>
      {children}
    </div>
  )
}

/** rose section label with rule */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex items-center justify-center gap-3"
    >
      <span className="h-px w-6 bg-gradient-to-r from-transparent to-rose-400/60 sm:w-8" />
      <span className="font-mono2 whitespace-nowrap text-[9px] uppercase tracking-[0.26em] text-rose-300/90 sm:text-[10px] sm:tracking-[0.34em]">{children}</span>
      <span className="h-px w-6 bg-gradient-to-l from-transparent to-rose-400/60 sm:w-8" />
    </motion.div>
  )
}

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
}

/** staggered blur-to-sharp reveal for grouped content */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

/** full-screen particle canvas; exposes burst/finale via ref */
export function ParticleLayer({
  apiRef,
  className = '',
}: {
  apiRef: React.MutableRefObject<ConfettiCanvas | null>
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current) apiRef.current = new ConfettiCanvas(canvasRef.current)
    return () => {
      apiRef.current?.destroy()
      apiRef.current = null
    }
  }, [apiRef])
  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}

/** toast */
export function Toast({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -14, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="pointer-events-none absolute left-1/2 top-20 z-50 -translate-x-1/2"
    >
      <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-2.5 shadow-[0_8px_40px_-8px_rgba(52,211,153,0.5)] backdrop-blur-xl">
        <div className="font-mono2 text-[11px] font-semibold tracking-[0.28em] text-emerald-200">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
