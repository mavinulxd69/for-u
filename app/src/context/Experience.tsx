import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { sfx, setSoundEnabled, stopFinaleMusic } from '@/lib/sound'

export type TransitionKind =
  | 'mystery'
  | 'punch'
  | 'meme'
  | 'game'
  | 'suspense'
  | 'emotional'
  | 'proposal'
  | 'glitch'
  | 'yes'

export interface ProgressState {
  rizzScore: number
  quizAnswers: Record<string, string>
  gamesCompleted: string[]
  heartCount: number
  puzzleCompleted: boolean
  lettersOpened: number[]
  proposalChoice: 'yes' | 'maybe' | null
}

interface ExperienceCtx {
  screen: number
  transition: TransitionKind
  go: (screen: number, kind?: TransitionKind) => void
  state: ProgressState
  addRizz: (n: number) => void
  recordAnswer: (key: string, value: string) => void
  completeGame: (key: string) => void
  setHearts: (n: number) => void
  setPuzzleCompleted: () => void
  openLetter: (i: number) => void
  setProposalChoice: (c: 'yes' | 'maybe') => void
  soundOn: boolean
  toggleSound: () => void
  reset: () => void
  /** ephemeral chemistry toast shown near the progress bar */
  chemistryNote: string | null
}

const Ctx = createContext<ExperienceCtx | null>(null)

const initialState: ProgressState = {
  rizzScore: 0,
  quizAnswers: {},
  gamesCompleted: [],
  heartCount: 0,
  puzzleCompleted: false,
  lettersOpened: [],
  proposalChoice: null,
}

function chemistryLine(score: number): string | null {
  if (score >= 100) return 'RIZZ LEVEL: UNREASONABLE 🔥'
  if (score >= 90) return "I'm starting to regret giving you this much power."
  if (score >= 70) return 'Why is the chemistry meter doing that?'
  if (score >= 40) return 'Okay, this is getting interesting.'
  if (score > 0) return "We're warming up..."
  return null
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState(() => {
    // deep-link / preview helper: ?screen=7 jumps straight to a scene
    const n = parseInt(new URLSearchParams(window.location.search).get('screen') ?? '', 10)
    return n >= 1 && n <= 18 ? n : 1
  })
  const [transition, setTransition] = useState<TransitionKind>('mystery')
  const [state, setState] = useState<ProgressState>(initialState)
  const [soundOn, setSoundOn] = useState(true)
  const [chemistryNote, setChemistryNote] = useState<string | null>(null)
  const noteTimer = useRef<number | undefined>(undefined)

  const flashNote = useCallback((note: string | null) => {
    if (!note) return
    setChemistryNote(note)
    window.clearTimeout(noteTimer.current)
    noteTimer.current = window.setTimeout(() => setChemistryNote(null), 3400)
  }, [])

  const go = useCallback((n: number, kind: TransitionKind = 'mystery') => {
    setTransition(kind)
    setScreen(n)
  }, [])

  const addRizz = useCallback(
    (n: number) => {
      setState((s) => {
        const next = Math.min(100, s.rizzScore + n)
        return { ...s, rizzScore: next }
      })
      // read after update for the note
      setState((s) => {
        flashNote(chemistryLine(s.rizzScore))
        return s
      })
    },
    [flashNote],
  )

  const value = useMemo<ExperienceCtx>(
    () => ({
      screen,
      transition,
      go,
      state,
      addRizz,
      recordAnswer: (key, value) => setState((s) => ({ ...s, quizAnswers: { ...s.quizAnswers, [key]: value } })),
      completeGame: (key) =>
        setState((s) => (s.gamesCompleted.includes(key) ? s : { ...s, gamesCompleted: [...s.gamesCompleted, key] })),
      setHearts: (n) => setState((s) => ({ ...s, heartCount: n })),
      setPuzzleCompleted: () => setState((s) => ({ ...s, puzzleCompleted: true })),
      openLetter: (i) =>
        setState((s) => (s.lettersOpened.includes(i) ? s : { ...s, lettersOpened: [...s.lettersOpened, i] })),
      setProposalChoice: (c) => setState((s) => ({ ...s, proposalChoice: c })),
      soundOn,
      toggleSound: () =>
        setSoundOn((v) => {
          const next = !v
          setSoundEnabled(next)
          if (next) sfx.click()
          return next
        }),
      reset: () => {
        stopFinaleMusic()
        setState(initialState)
        setScreen(1)
        setTransition('mystery')
      },
      chemistryNote,
    }),
    [screen, transition, state, soundOn, go, addRizz, chemistryNote],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useExperience() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useExperience outside provider')
  return ctx
}
