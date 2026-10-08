import { useEffect, useRef, useState } from 'react'

/**
 * Terminal-style typewriter. Types each line, pauses, moves on.
 * onLine(i) fires when a line starts; onDone() when everything is typed.
 */
export function Typewriter({
  lines,
  speed = 34,
  pause = 480,
  startDelay = 300,
  onDone,
  className = '',
  lineClassName,
}: {
  lines: string[]
  speed?: number
  pause?: number
  startDelay?: number
  onDone?: () => void
  className?: string
  lineClassName?: (line: string, i: number) => string
}) {
  const [done, setDone] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [finished, setFinished] = useState(false)
  const state = useRef({ li: 0, ci: 0 })

  useEffect(() => {
    let timer: number
    const tick = () => {
      const s = state.current
      if (s.li >= lines.length) {
        setFinished(true)
        onDone?.()
        return
      }
      const line = lines[s.li]
      if (s.ci <= line.length) {
        setCurrent(line.slice(0, s.ci))
        s.ci++
        timer = window.setTimeout(tick, speed + Math.random() * 30)
      } else {
        setDone((d) => [...d, line])
        setCurrent('')
        s.li++
        s.ci = 0
        timer = window.setTimeout(tick, pause)
      }
    }
    timer = window.setTimeout(tick, startDelay)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={className}>
      {done.map((l, i) => (
        <div key={i} className={lineClassName?.(l, i) ?? ''}>
          {l}
        </div>
      ))}
      {!finished && (
        <div className={`caret ${lineClassName?.(current, done.length) ?? ''}`}>{current}</div>
      )}
    </div>
  )
}
