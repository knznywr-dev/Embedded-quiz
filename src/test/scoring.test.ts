import { describe, expect, it } from 'vitest'
import { questions } from '../data/questions'
import { identificationItems, wordBank } from '../data/identification'
import {
  getPerformance,
  normalizeAnswer,
  scoreIdentification,
  scoreMultipleChoice,
} from '../lib/scoring'

function correctAnswers(count: number): Record<string, string> {
  return Object.fromEntries(
    questions
      .slice(0, count)
      .map((question) => [String(question.id), question.answer]),
  )
}

describe('multiple-choice scoring', () => {
  it('TEST 1: 20 correct gives 20/20 (100%)', () => {
    const result = scoreMultipleChoice(correctAnswers(20))
    expect(result.correct).toBe(20)
    expect(result.incorrect).toBe(0)
    expect(result.unanswered).toBe(0)
    expect(result.percentage).toBe(100)
    expect(result.total).toBe(20)
  })

  it('TEST 2: 10 correct and 10 incorrect gives 10/20 (50%)', () => {
    const answers = correctAnswers(10)
    questions.slice(10).forEach((question) => {
      answers[String(question.id)] = question.distractors[0]
    })
    const result = scoreMultipleChoice(answers)
    expect(result.correct).toBe(10)
    expect(result.incorrect).toBe(10)
    expect(result.unanswered).toBe(0)
    expect(result.percentage).toBe(50)
  })

  it('TEST 3: 15 correct, 3 incorrect, 2 unanswered gives 15/20 (75%)', () => {
    const answers = correctAnswers(15)
    questions.slice(15, 18).forEach((question) => {
      answers[String(question.id)] = question.distractors[1]
    })
    const result = scoreMultipleChoice(answers)
    expect(result.correct).toBe(15)
    expect(result.incorrect).toBe(3)
    expect(result.unanswered).toBe(2)
    expect(result.answered).toBe(18)
    expect(result.percentage).toBe(75)
    expect(result.review.slice(18).map((item) => item.status)).toEqual([
      'unanswered',
      'unanswered',
    ])
  })

  it('TEST 4: all unanswered gives 0/20 (0%) and never counts as correct', () => {
    const result = scoreMultipleChoice({})
    expect(result.correct).toBe(0)
    expect(result.incorrect).toBe(0)
    expect(result.unanswered).toBe(20)
    expect(result.percentage).toBe(0)
    expect(result.review.every((item) => item.status === 'unanswered')).toBe(
      true,
    )
  })

  it('marks each correct, incorrect and unanswered item accurately', () => {
    const answers: Record<string, string> = {
      '1': questions[0].answer,
      '2': questions[1].distractors[0],
    }
    const result = scoreMultipleChoice(answers)
    expect(result.review[0].status).toBe('correct')
    expect(result.review[1].status).toBe('incorrect')
    expect(result.review[2].status).toBe('unanswered')
    expect(result.review[0].selectedAnswer).toBe(questions[0].answer)
    expect(result.review[2].selectedAnswer).toBeNull()
  })

  it('normalizes case and surrounding whitespace', () => {
    expect(normalizeAnswer('  Timing   Margin. ')).toBe('timing margin')
  })
})

describe('identification scoring', () => {
  function allCorrect(): Record<string, string> {
    return Object.fromEntries(
      identificationItems.map((item) => [
        String(item.id),
        item.acceptedAnswers[0],
      ]),
    )
  }

  it('scores all ten correct answers as 10/10 (100%)', () => {
    const result = scoreIdentification(allCorrect())
    if (!result) throw new Error('Identification section should be configured')
    expect(result.total).toBe(10)
    expect(result.correct).toBe(10)
    expect(result.incorrect).toBe(0)
    expect(result.unanswered).toBe(0)
    expect(result.percentage).toBe(100)
  })

  it('accepts case-insensitive answers and surrounding whitespace', () => {
    const answers = Object.fromEntries(
      identificationItems.map((item) => [
        String(item.id),
        `  ${item.acceptedAnswers[0].toUpperCase()}  `,
      ]),
    )
    const result = scoreIdentification(answers)
    if (!result) throw new Error('Identification section should be configured')
    expect(result.correct).toBe(10)
  })

  it('scores 8 correct, 1 incorrect and 1 unanswered as 8/10 (80%)', () => {
    const answers = allCorrect()
    const wrongItem = identificationItems[8]
    answers[String(wrongItem.id)] = wordBank.find(
      (term) => term !== wrongItem.acceptedAnswers[0],
    )!
    delete answers[String(identificationItems[9].id)]

    const result = scoreIdentification(answers)
    if (!result) throw new Error('Identification section should be configured')
    expect(result.correct).toBe(8)
    expect(result.incorrect).toBe(1)
    expect(result.unanswered).toBe(1)
    expect(result.percentage).toBe(80)
    expect(result.review[8].status).toBe('incorrect')
    expect(result.review[9].status).toBe('unanswered')
  })

  it('does not count unanswered identification items as correct', () => {
    const result = scoreIdentification({})
    if (!result) throw new Error('Identification section should be configured')
    expect(result.correct).toBe(0)
    expect(result.incorrect).toBe(0)
    expect(result.unanswered).toBe(10)
    expect(result.percentage).toBe(0)
  })
})

describe('performance indicators', () => {
  it('returns clear bands for representative percentages', () => {
    expect(getPerformance(100).label).toBe('Outstanding')
    expect(getPerformance(75).label).toBe('Very Good')
    expect(getPerformance(60).label).toBe('Good')
    expect(getPerformance(40).label).toBe('Keep Practicing')
  })
})
