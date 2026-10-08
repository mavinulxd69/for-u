import { motion } from 'framer-motion'
import { useState } from 'react'

/**
 * Premium cinematic frame for GIFs: glass border, glow, gradient mask,
 * lazy loading, shimmer fallback while loading.
 */
export function MediaFrame({
  src,
  caption,
  aspect = 'aspect-[4/3]',
  glow = 'rgba(225,29,72,0.35)',
  className = '',
  imgClassName = '',
}: {
  src: string
  caption?: string
  aspect?: string
  glow?: string
  className?: string
  imgClassName?: string
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <figure className={`relative ${className}`}>
      {/* glow */}
      <div
        className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
        style={{ background: `radial-gradient(60% 60% at 50% 50%, ${glow}, transparent 70%)` }}
      />
      <div className="flow-border relative rounded-3xl p-px">
        <div className={`relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-white/[0.03] ${aspect}`}>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.06] to-transparent" />
          )}
          <img
            src={src}
            alt={caption ?? 'reaction'}
            loading="lazy"
            draggable={false}
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? 'opacity-100' : 'opacity-0'
            } ${imgClassName}`}
          />
          {/* cinematic grade on top of the gif */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
          <div className="vignette pointer-events-none absolute inset-0 opacity-60" />
        </div>
      </div>
      {caption && (
        <motion.figcaption
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-mono2 mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-white/60"
        >
          {caption}
        </motion.figcaption>
      )}
    </figure>
  )
}
