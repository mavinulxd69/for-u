/**
 * Tiny WebAudio synth for UI sounds — no audio files needed for feedback.
 * The finale music (config.song) is a real mp3 played only at the end.
 */

let ctx: AudioContext | null = null
let enabled = true
let musicEl: HTMLAudioElement | null = null

type WebkitAudioContextWindow = Window & {
  webkitAudioContext?: typeof AudioContext
}

export function setSoundEnabled(v: boolean) {
  enabled = v
  if (!v && musicEl) musicEl.pause()
}

function ac(): AudioContext | null {
  if (!enabled) return null
  try {
    const AudioContextConstructor =
      window.AudioContext || (window as WebkitAudioContextWindow).webkitAudioContext
    if (!AudioContextConstructor) return null
    if (!ctx) ctx = new AudioContextConstructor()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, t0: number, dur: number, type: OscillatorType, gain = 0.12, bend = 0) {
  const c = ac()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, c.currentTime + t0)
  if (bend) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + bend), c.currentTime + t0 + dur)
  g.gain.setValueAtTime(0.0001, c.currentTime + t0)
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + t0)
  o.stop(c.currentTime + t0 + dur + 0.05)
}

function noise(t0: number, dur: number, gain = 0.08, freq = 1200) {
  const c = ac()
  if (!c) return
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = freq
  const g = c.createGain()
  g.gain.value = gain
  src.connect(f).connect(g).connect(c.destination)
  src.start(c.currentTime + t0)
}

export const sfx = {
  click() {
    tone(1400, 0, 0.06, 'triangle', 0.06, -500)
  },
  pop() {
    tone(500, 0, 0.1, 'sine', 0.14, 700)
    noise(0, 0.05, 0.05, 2400)
  },
  success() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.24, 'sine', 0.1))
  },
  fail() {
    tone(300, 0, 0.16, 'sawtooth', 0.05, -120)
    tone(220, 0.12, 0.2, 'sawtooth', 0.05, -90)
  },
  unlock() {
    noise(0, 0.06, 0.14, 700)
    tone(180, 0.05, 0.1, 'square', 0.08)
    tone(880, 0.18, 0.3, 'sine', 0.1, 220)
    ;[1320, 1760].forEach((f, i) => tone(f, 0.3 + i * 0.08, 0.22, 'sine', 0.07))
  },
  glitch() {
    noise(0, 0.16, 0.12, 300)
    tone(90, 0, 0.22, 'sawtooth', 0.08, -40)
  },
  celebration() {
    noise(0, 0.4, 0.1, 1000)
    ;[523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.09, 0.4, 'triangle', 0.09))
  },
  heart() {
    tone(660, 0, 0.08, 'sine', 0.1)
    tone(990, 0.07, 0.12, 'sine', 0.09)
  },
}

/** Plays the finale song once (called only at the YES ending). */
export function playFinaleMusic(src: string) {
  if (!enabled) return
  try {
    if (!musicEl) {
      musicEl = new Audio(src)
      musicEl.loop = true
      musicEl.volume = 0.75
    }
    void musicEl.play().catch(() => {})
  } catch {
    /* autoplay blocked — fine */
  }
}

export function stopFinaleMusic() {
  if (musicEl) {
    musicEl.pause()
    musicEl.currentTime = 0
  }
}
