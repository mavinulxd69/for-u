/**
 * Lightweight canvas particle system — confetti, hearts, bursts.
 * No dependencies. Call burst() for local pops, or startFinale() for the big one.
 */

type P = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  size: number
  color: string
  shape: 'rect' | 'heart' | 'circle'
  life: number
  maxLife: number
  gravity: number
}

const PALETTE = ['#f43f5e', '#ec4899', '#fb7185', '#e11d48', '#c084fc', '#fda4af', '#ffffff', '#ffd166']

function drawHeart(c: CanvasRenderingContext2D, s: number) {
  c.beginPath()
  c.moveTo(0, s * 0.3)
  c.bezierCurveTo(0, 0, -s * 0.5, -s * 0.3, -s * 0.5, s * 0.1)
  c.bezierCurveTo(-s * 0.5, s * 0.55, 0, s * 0.8, 0, s)
  c.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.55, s * 0.5, s * 0.1)
  c.bezierCurveTo(s * 0.5, -s * 0.3, 0, 0, 0, s * 0.3)
  c.closePath()
}

export class ConfettiCanvas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private parts: P[] = []
  private raf = 0
  private running = false
  private emitter: (() => P | null) | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
  }

  resize = () => {
    const r = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = r.width * dpr
    this.canvas.height = r.height * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  private loop = () => {
    const { ctx, canvas } = this
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    ctx.clearRect(0, 0, w, h)
    if (this.emitter) {
      for (let i = 0; i < 3; i++) {
        const p = this.emitter()
        if (p) this.parts.push(p)
      }
    }
    this.parts = this.parts.filter((p) => p.life < p.maxLife && p.y < h + 60)
    for (const p of this.parts) {
      p.life++
      p.vy += p.gravity
      p.vx *= 0.992
      p.vy *= 0.995
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      const fade = Math.min(1, 4 * (1 - p.life / p.maxLife))
      ctx.save()
      ctx.globalAlpha = fade
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66)
      else if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        drawHeart(ctx, p.size)
        ctx.fill()
      }
      ctx.restore()
    }
    if (this.parts.length || this.emitter) {
      this.raf = requestAnimationFrame(this.loop)
    } else {
      this.running = false
      ctx.clearRect(0, 0, w, h)
    }
  }

  private ensure() {
    if (!this.running) {
      this.running = true
      this.resize()
      this.raf = requestAnimationFrame(this.loop)
    }
  }

  /** local burst at a point (px coords relative to canvas) */
  burst(x: number, y: number, n = 26, hearts = true) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const sp = 2 + Math.random() * 6
      this.parts.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        size: 6 + Math.random() * 10,
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        shape: hearts ? (Math.random() < 0.5 ? 'heart' : 'circle') : Math.random() < 0.7 ? 'rect' : 'circle',
        life: 0,
        maxLife: 60 + Math.random() * 50,
        gravity: 0.12,
      })
    }
    this.ensure()
  }

  /** full-screen celebration — big initial blast + 6s emitter */
  startFinale() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.burst(w / 2, h * 0.45, 120, true)
    this.burst(w * 0.25, h * 0.3, 60, false)
    this.burst(w * 0.75, h * 0.3, 60, false)
    let elapsed = 0
    this.emitter = () => {
      elapsed++
      if (elapsed > 360) {
        this.emitter = null
        return null
      }
      return {
        x: Math.random() * w,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 2.5,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
        size: 6 + Math.random() * 10,
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        shape: Math.random() < 0.4 ? 'heart' : 'rect',
        life: 0,
        maxLife: 400,
        gravity: 0.03,
      }
    }
    this.ensure()
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.emitter = null
    this.parts = []
  }
}
