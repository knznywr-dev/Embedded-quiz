import { describe, expect, it } from 'vitest'
import { questions } from '../data/questions'
import {
  createAttempt,
  getQuestionOptions,
  type ExamAttempt,
} from '../lib/attempt'

describe('exam attempt option randomization', () => {
  it('stores four unique options per question, including the correct answer', () => {
    const attempt = createAttempt()

    for (const question of questions) {
      const order = attempt.optionOrder[String(question.id)]
      expect(order).toHaveLength(4)
      expect(new Set(order).size).toBe(4)
      expect(order).toContain(question.answer)
      question.distractors.forEach((distractor) => {
        expect(order).toContain(distractor)
      })
    }
  })

  it('initializes identification answers in the same attempt', () => {
    const attempt = createAttempt()
    expect(attempt.identificationAnswers).toEqual({})
    expect(attempt.score).toBeNull()
  })

  it('varies the position of correct answers rather than fixing them at A', () => {
    const attempt = createAttempt()
    const correctPositions = new Set(
      questions.map((question) =>
        attempt.optionOrder[String(question.id)].indexOf(question.answer),
      ),
    )
    expect(correctPositions.size).toBeGreaterThan(1)
  })

  it('falls back to a safe option list if stored data is incomplete', () => {
    const malformed: ExamAttempt = {
      ...createAttempt(),
      optionOrder: { '1': ['only one option'] },
    }
    const question = questions[0]
    const options = getQuestionOptions(
      malformed,
      question.id,
      question.answer,
      question.distractors,
    )
    expect(options).toEqual([question.answer, ...question.distractors])
  })
})
