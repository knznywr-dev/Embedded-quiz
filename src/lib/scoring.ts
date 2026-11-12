import { questions } from '../data/questions'
import {
  identificationItems,
  isIdentificationConfigured,
  wordBank,
} from '../data/identification'

export type AnswerStatus = 'correct' | 'incorrect' | 'unanswered'

export interface ReviewItem {
  questionId: number
  question: string
  selectedAnswer: string | null
  correctAnswer: string
  explanation: string
  status: AnswerStatus
}

export interface ScoreSummary {
  total: number
  answered: number
  correct: number
  incorrect: number
  unanswered: number
  percentage: number
  review: ReviewItem[]
}

export interface IdentificationReviewItem {
  questionId: number
  description: string
  selectedAnswer: string | null
  correctAnswer: string
  explanation?: string
  status: AnswerStatus
}

export interface IdentificationScore {
  total: number
  answered: number
  correct: number
  incorrect: number
  unanswered: number
  percentage: number
  review: IdentificationReviewItem[]
}

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
}

/** Scores the 20 multiple-choice items. Unanswered is never counted as correct. */
export function scoreMultipleChoice(
  answers: Record<string, string | undefined>,
): ScoreSummary {
  const review: ReviewItem[] = questions.map((question) => {
    const raw = answers[String(question.id)]
    const selectedAnswer = raw && raw.trim().length > 0 ? raw : null
    const isCorrect =
      selectedAnswer !== null &&
      normalizeAnswer(selectedAnswer) === normalizeAnswer(question.answer)

    return {
      questionId: question.id,
      question: question.question,
      selectedAnswer,
      correctAnswer: question.answer,
      explanation: question.explanation,
      status:
        selectedAnswer === null
          ? 'unanswered'
          : isCorrect
            ? 'correct'
            : 'incorrect',
    }
  })

  const correct = review.filter((item) => item.status === 'correct').length
  const incorrect = review.filter((item) => item.status === 'incorrect').length
  const unanswered = review.filter(
    (item) => item.status === 'unanswered',
  ).length
  const total = questions.length

  return {
    total,
    answered: correct + incorrect,
    correct,
    incorrect,
    unanswered,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    review,
  }
}

/**
 * Scores Items 21–30 when the section is fully configured with a description
 * and verified answer key for every item. Returns null if it is incomplete.
 */
export function scoreIdentification(
  answers: Record<string, string | undefined>,
): IdentificationScore | null {
  if (!isIdentificationConfigured) return null

  const review: IdentificationReviewItem[] = identificationItems.map((item) => {
    const raw = answers[String(item.id)]
    const selectedAnswer = raw && raw.trim().length > 0 ? raw : null
    const normalized = selectedAnswer ? normalizeAnswer(selectedAnswer) : ''
    const isCorrect =
      selectedAnswer !== null &&
      item.acceptedAnswers.some(
        (accepted) => normalizeAnswer(accepted) === normalized,
      )

    return {
      questionId: item.id,
      description: item.description,
      selectedAnswer,
      correctAnswer: item.acceptedAnswers[0] ?? '',
      explanation: item.explanation,
      status:
        selectedAnswer === null
          ? 'unanswered'
          : isCorrect
            ? 'correct'
            : 'incorrect',
    }
  })

  const correct = review.filter((item) => item.status === 'correct').length
  const incorrect = review.filter((item) => item.status === 'incorrect').length
  const unanswered = review.filter(
    (item) => item.status === 'unanswered',
  ).length
  const total = identificationItems.length

  return {
    total,
    answered: correct + incorrect,
    correct,
    incorrect,
    unanswered,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    review,
  }
}

export interface PerformanceBand {
  label: string
  message: string
  tone: 'excellent' | 'good' | 'fair' | 'focus'
}

export function getPerformance(percentage: number): PerformanceBand {
  if (percentage >= 90) {
    return {
      label: 'Outstanding',
      message: 'You have a strong command of the reviewed material.',
      tone: 'excellent',
    }
  }
  if (percentage >= 75) {
    return {
      label: 'Very Good',
      message: 'A solid result. A short review will sharpen the remaining gaps.',
      tone: 'good',
    }
  }
  if (percentage >= 60) {
    return {
      label: 'Good',
      message: 'You are on the right track. Revisit the missed items.',
      tone: 'fair',
    }
  }
  return {
    label: 'Keep Practicing',
    message: 'Use Study Mode to review the key ideas, then try again.',
    tone: 'focus',
  }
}

/** Word bank terms that are not used by the verified key, once configured. */
export function unusedWordBankTerms(): string[] {
  if (!isIdentificationConfigured) return []
  const used = new Set(
    identificationItems.flatMap((item) => item.acceptedAnswers),
  )
  return wordBank.filter((term) => !used.has(term))
}
