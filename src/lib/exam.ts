import { identificationItems } from '../data/identification'
import { questions } from '../data/questions'

export type ExamStep =
  | { kind: 'multiple-choice'; index: number; id: number }
  | { kind: 'identification'; index: number; id: number }

/**
 * One continuous examination: Items 1–20 are multiple choice, then Items 21–30
 * are identification with the Word Bank.
 */
export const examSteps: ExamStep[] = [
  ...questions.map((question, index) => ({
    kind: 'multiple-choice' as const,
    index,
    id: question.id,
  })),
  ...identificationItems.map((item, index) => ({
    kind: 'identification' as const,
    index,
    id: item.id,
  })),
]

export const TOTAL_EXAM = examSteps.length

export function countAnswered(
  answers: Record<string, string> = {},
  identificationAnswers: Record<string, string> = {},
): number {
  const multipleChoice = questions.filter((question) =>
    Boolean(answers[String(question.id)]?.trim()),
  ).length
  const identification = identificationItems.filter((item) =>
    Boolean(identificationAnswers[String(item.id)]?.trim()),
  ).length

  return multipleChoice + identification
}

export function countAnsweredByIdentity(
  answers: Record<string, string> = {},
  identificationAnswers: Record<string, string> = {},
): { multipleChoice: number; identification: number } {
  return {
    multipleChoice: questions.filter((question) =>
      Boolean(answers[String(question.id)]?.trim()),
    ).length,
    identification: identificationItems.filter((item) =>
      Boolean(identificationAnswers[String(item.id)]?.trim()),
    ).length,
  }
}
