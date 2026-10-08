import { useEffect, useRef, useState } from 'react'

/**
 * Full-bleed cinematic background video with dark overlay + edge blur.
 * autoplay / muted / loop / playsinline, with poster fallback + slow zoom.
 */
export function CinematicVideo({
  src,
  zoom = true,
  dim = 0.55,
  blur = false,
  className = '',
}: {
  src: string
  zoom?: boolean
  /** 0–1 how dark the overlay is */
  dim?: number
  blur?: boolean
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const t = window.setTimeout(() => {
      v.play().catch(() => {})
    }, 60)
    return () => window.clearTimeout(t)
  }, [src])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* fallback gradient while video loads */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: ready ? 0 : 1,
          background:
            'radial-gradient(120% 90% at 50% 20%, rgba(225,29,72,0.14), transparent 60%), radial-gradient(100% 80% at 80% 90%, rgba(139,92,246,0.12), transparent 60%), #0a0a0d',
        }}
      />
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${zoom ? 'slow-zoom' : ''}`}
        style={blur ? { filter: 'blur(2px) saturate(1.1)' } : undefined}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      />
      {/* cinematic overlay: dark + vignette + edge blur */}
      <div className="absolute inset-0" style={{ background: `rgba(5,5,8,${dim})` }} />
      <div className="vignette absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 120px 40px rgba(5,5,8,0.9)' }}
      />
    </div>
  )
}
