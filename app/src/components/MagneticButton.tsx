import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { sfx } from '@/lib/sound'

/**
 * Scene button: magnetic hover (desktop), press compression + spring release,
 * glow, arrow drift. Touch targets >= 48px.
 */
export function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  silent,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  className?: string
  disabled?: boolean
  silent?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16 })
  const sy = useSpring(y, { stiffness: 220, damping: 16 })

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const skin =
    variant === 'primary'
      ? 'text-white border border-rose-400/40 bg-gradient-to-br from-rose-500/90 via-rose-600/80 to-fuchsia-700/80 shadow-[0_8px_40px_-8px_rgba(244,63,94,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]'
      : variant === 'danger'
        ? 'text-white border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
        : 'text-white/85 border border-white/15 bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.09]'

  const motionProps: HTMLMotionProps<'button'> = {
    whileTap: { scale: 0.94 },
    whileHover: { scale: 1.03 },
    transition: { type: 'spring', stiffness: 380, damping: 18 },
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => {
        if (!silent) sfx.click()
        onClick?.()
      }}
      style={{ x: sx, y: sy }}
      {...motionProps}
      className={`group relative inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${skin} ${className}`}
    >
      {children}
    </motion.button>
  )
}
