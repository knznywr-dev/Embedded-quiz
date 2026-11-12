import { questions } from '../data/questions'
import { scoreCombined, type CombinedScore } from './scoring'
import { shuffle } from './shuffle'

export interface ExamAttempt {
  version: 1
  id: string
  startedAt: string
  submittedAt: string | null
  answers: Record<string, string>
  identificationAnswers: Record<string, string>
  optionOrder: Record<string, string[]>
  currentIndex: number
  score: CombinedScore | null
}

const ATTEMPT_KEY = 'embedded-reviewer:attempt:v1'
const HISTORY_KEY = 'embedded-reviewer:history:v1'
const HISTORY_LIMIT = 25

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createAttempt(): ExamAttempt {
  const optionOrder = Object.fromEntries(
    questions.map((question) => [
      String(question.id),
      shuffle([question.answer, ...question.distractors]),
    ]),
  )

  return {
    version: 1,
    id: createId(),
    startedAt: new Date().toISOString(),
    submittedAt: null,
    answers: {},
    identificationAnswers: {},
    optionOrder,
    currentIndex: 0,
    score: null,
  }
}

export function getQuestionOptions(
  attempt: ExamAttempt,
  questionId: number,
  correctAnswer: string,
  distractors: readonly string[],
): string[] {
  const stored = attempt.optionOrder[String(questionId)]
  const expected = [correctAnswer, ...distractors]
  if (
    Array.isArray(stored) &&
    stored.length === expected.length &&
    expected.every((option) => stored.includes(option))
  ) {
    return stored
  }
  return expected
}

function normalizeAttempt(attempt: ExamAttempt): ExamAttempt {
  return {
    ...attempt,
    identificationAnswers:
      attempt.identificationAnswers &&
      typeof attempt.identificationAnswers === 'object'
        ? attempt.identificationAnswers
        : {},
  }
}

function isAttempt(value: unknown): value is ExamAttempt {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ExamAttempt>
  return (
    candidate.version === 1 &&
    typeof candidate.id === 'string' &&
    typeof candidate.startedAt === 'string' &&
    typeof candidate.answers === 'object' &&
    candidate.answers !== null &&
    typeof candidate.optionOrder === 'object' &&
    candidate.optionOrder !== null &&
    typeof candidate.currentIndex === 'number'
  )
}

/** Returns a combined score, recomputing older saved attempts if needed. */
export function getAttemptScore(attempt: ExamAttempt): CombinedScore {
  const stored = attempt.score as CombinedScore | null
  if (stored && stored.multipleChoice && stored.identification) {
    return stored
  }
  return scoreCombined(attempt.answers, attempt.identificationAnswers)
}

export function loadAttempt(): ExamAttempt | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ATTEMPT_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isAttempt(parsed) ? normalizeAttempt(parsed) : null
  } catch {
    return null
  }
}

export function saveAttempt(attempt: ExamAttempt | null): void {
  if (typeof window === 'undefined') return
  try {
    if (attempt === null) {
      window.localStorage.removeItem(ATTEMPT_KEY)
    } else {
      window.localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt))
    }
  } catch {
    // Storage can be unavailable (private mode / full storage). The app still
    // works for the current session.
  }
}

export function loadHistory(): ExamAttempt[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isAttempt)
      .filter((attempt) => attempt.submittedAt !== null && attempt.score)
      .map(normalizeAttempt)
      .slice(0, HISTORY_LIMIT)
  } catch {
    return []
  }
}

export function saveHistory(history: ExamAttempt[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, HISTORY_LIMIT)),
    )
  } catch {
    // See saveAttempt.
  }
}

export function clearSavedResults(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(HISTORY_KEY)
  } catch {
    // Ignore storage failures.
  }
}
