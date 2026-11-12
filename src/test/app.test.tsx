import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { questions } from '../data/questions'
import { identificationItems, wordBank } from '../data/identification'

const ATTEMPT_KEY = 'embedded-reviewer:attempt:v1'
const HISTORY_KEY = 'embedded-reviewer:history:v1'

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function startExam() {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getAllByRole('button', { name: 'Start Exam' })[0])
  await screen.findByRole('heading', { name: /Comprehensive Examination/i })
  return user
}

async function answerExam({
  correct,
  incorrect,
  identificationCorrect = identificationItems.length,
  identificationIncorrect = 0,
}: {
  correct: number
  incorrect: number
  identificationCorrect?: number
  identificationIncorrect?: number
}) {
  const user = await startExam()

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index]
    if (index < correct) {
      await user.click(screen.getByText(question.answer, { exact: true }))
    } else if (index < correct + incorrect) {
      await user.click(
        screen.getByText(question.distractors[0], { exact: true }),
      )
    }

    if (index < questions.length - 1) {
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
  }

  // Move from the last multiple-choice item into the identification section.
  await user.click(screen.getByRole('button', { name: 'Next' }))

  for (let index = 0; index < identificationItems.length; index += 1) {
    const item = identificationItems[index]
    const input = screen.getByRole('combobox')

    if (index < identificationCorrect) {
      await user.type(input, item.acceptedAnswers[0])
    } else if (index < identificationCorrect + identificationIncorrect) {
      const wrongTerm = wordBank.find(
        (term) => term !== item.acceptedAnswers[0],
      )!
      await user.type(input, wrongTerm)
    }

    if (index < identificationItems.length - 1) {
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
  }

  await user.click(screen.getAllByRole('button', { name: 'Submit Exam' })[0])
  const dialog = await screen.findByRole('dialog')
  await user.click(
    within(dialog).getByRole('button', { name: 'Confirm Submission' }),
  )
  await screen.findByRole('heading', { name: 'Your Results' })
  return user
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('dashboard and exam navigation', () => {
  it('starts the exam and preserves changed answers while navigating', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /EMBEDDED SYSTEMS/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()

    const startButtons = screen.getAllByRole('button', {
      name: 'Start Exam',
    })
    await user.click(startButtons[0])
    await screen.findByRole('heading', {
      name: /Comprehensive Examination/i,
    })

    const first = questions[0]
    const second = questions[1]

    await user.click(screen.getByText(first.answer, { exact: true }))
    expect(
      screen.getByRole('radio', {
        name: new RegExp(escapeRegExp(first.answer)),
      }),
    ).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      screen.getByRole('heading', { name: second.question }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(
      screen.getByRole('radio', {
        name: new RegExp(escapeRegExp(first.answer)),
      }),
    ).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByText(first.distractors[0], { exact: true }))
    expect(
      screen.getByRole('radio', {
        name: new RegExp(escapeRegExp(first.answer)),
      }),
    ).toHaveAttribute('aria-checked', 'false')
    expect(
      screen.getByRole('radio', {
        name: new RegExp(escapeRegExp(first.distractors[0])),
      }),
    ).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(
      screen.getByRole('radio', {
        name: new RegExp(escapeRegExp(first.distractors[0])),
      }),
    ).toHaveAttribute('aria-checked', 'true')

    const saved = JSON.parse(window.localStorage.getItem(ATTEMPT_KEY) ?? '{}')
    expect(saved.answers['1']).toBe(first.distractors[0])
  })

  it('saves progress and resumes after the app is reopened', async () => {
    const user = userEvent.setup()
    const firstRender = render(<App />)

    await user.click(
      screen.getAllByRole('button', { name: 'Start Exam' })[0],
    )
    await screen.findByRole('heading', {
      name: /Comprehensive Examination/i,
    })
    const first = questions[0]
    await user.click(screen.getByText(first.answer, { exact: true }))
    await user.click(
      screen.getByRole('button', { name: 'Exit to dashboard' }),
    )

    expect(
      screen.getAllByRole('button', { name: 'Continue Exam' }).length,
    ).toBeGreaterThan(0)

    firstRender.unmount()
    render(<App />)

    await user.click(
      screen.getAllByRole('button', { name: 'Continue Exam' })[0],
    )
    expect(
      screen.getByRole('radio', {
        name: new RegExp(escapeRegExp(first.answer)),
      }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('keeps multiple-choice and identification answers in one saved attempt', async () => {
    const user = await startExam()
    const first = questions[0]
    const item = identificationItems[0]

    await user.click(screen.getByText(first.answer, { exact: true }))
    await user.click(screen.getByRole('button', { name: /^Item 21,/ }))
    expect(
      screen.getByRole('heading', { name: item.description }),
    ).toBeInTheDocument()

    await user.type(screen.getByRole('combobox'), item.acceptedAnswers[0])

    const saved = JSON.parse(window.localStorage.getItem(ATTEMPT_KEY) ?? '{}')
    expect(saved.answers['1']).toBe(first.answer)
    expect(saved.identificationAnswers['21']).toBe(item.acceptedAnswers[0])

    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(
      screen.getByRole('heading', { name: questions[19].question }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('combobox')).toHaveValue(item.acceptedAnswers[0])
  })
})

describe('submission and scoring', () => {
  it('TEST 1: displays 30/30 and 100% when all 30 items are correct', async () => {
    await answerExam({ correct: 20, incorrect: 0 })

    expect(screen.getByTestId('result-correct')).toHaveTextContent('30')
    expect(screen.getByTestId('result-incorrect')).toHaveTextContent('0')
    expect(screen.getByTestId('result-unanswered')).toHaveTextContent('0')
    expect(
      screen.getByRole('img', { name: /Final score: 100 percent/ }),
    ).toBeInTheDocument()
    expect(screen.getByText('30 out of 30 correct')).toBeInTheDocument()
    expect(screen.getByText('20/20 correct')).toBeInTheDocument()
    expect(screen.getByText('10/10 correct')).toBeInTheDocument()
  })

  it('TEST 2: combines 10 correct MCQs with 10 correct identification items for 20/30 (67%)', async () => {
    await answerExam({ correct: 10, incorrect: 10 })

    expect(screen.getByTestId('result-correct')).toHaveTextContent('20')
    expect(screen.getByTestId('result-incorrect')).toHaveTextContent('10')
    expect(screen.getByTestId('result-unanswered')).toHaveTextContent('0')
    expect(
      screen.getByRole('img', { name: /Final score: 67 percent/ }),
    ).toBeInTheDocument()
    expect(screen.getByText('20 out of 30 correct')).toBeInTheDocument()
  })

  it('TEST 3: combines MCQ and identification results with unanswered items', async () => {
    await answerExam({
      correct: 15,
      incorrect: 3,
      identificationCorrect: 5,
    })

    expect(screen.getByTestId('result-correct')).toHaveTextContent('20')
    expect(screen.getByTestId('result-incorrect')).toHaveTextContent('3')
    expect(screen.getByTestId('result-unanswered')).toHaveTextContent('7')
    expect(
      screen.getByRole('img', { name: /Final score: 67 percent/ }),
    ).toBeInTheDocument()
    expect(screen.getByText('20 out of 30 correct')).toBeInTheDocument()
    expect(screen.getByText('15/20 correct')).toBeInTheDocument()
    expect(screen.getByText('5/10 correct')).toBeInTheDocument()
  })

  it('TEST 4: displays 0/30 and 0% when every item is unanswered', async () => {
    const user = await startExam()
    await user.click(
      screen.getAllByRole('button', { name: 'Submit Exam' })[0],
    )
    const dialog = await screen.findByRole('dialog')
    await user.click(
      within(dialog).getByRole('button', { name: 'Confirm Submission' }),
    )
    await screen.findByRole('heading', { name: 'Your Results' })

    expect(screen.getByTestId('result-correct')).toHaveTextContent('0')
    expect(screen.getByTestId('result-incorrect')).toHaveTextContent('0')
    expect(screen.getByTestId('result-unanswered')).toHaveTextContent('30')
    expect(
      screen.getByRole('img', { name: /Final score: 0 percent/ }),
    ).toBeInTheDocument()
  })

  it('shows the required confirmation text and supports cancelling', async () => {
    const user = await startExam()
    await user.click(
      screen.getAllByRole('button', { name: 'Submit Exam' })[0],
    )
    const dialog = await screen.findByRole('dialog')

    expect(
      within(dialog).getByText(
        'Are you sure you want to submit your examination? You cannot change your answers after submission.',
      ),
    ).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Comprehensive Examination/i }),
    ).toBeInTheDocument()

    await user.click(
      screen.getAllByRole('button', { name: 'Submit Exam' })[0],
    )
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('stores exactly one history entry after submitting once', async () => {
    await answerExam({ correct: 20, incorrect: 0 })
    const savedHistory = JSON.parse(
      window.localStorage.getItem(HISTORY_KEY) ?? '[]',
    )
    expect(savedHistory).toHaveLength(1)
    expect(savedHistory[0].score.percentage).toBe(100)
  })
})

describe('results review and retake', () => {
  it('filters to incorrect and unanswered items and can show all again', async () => {
    const user = await answerExam({ correct: 15, incorrect: 3 })

    await user.click(
      screen.getByRole('button', { name: /Review Incorrect Answers/i }),
    )

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    expect(screen.getByText('Item 16')).toBeInTheDocument()
    expect(screen.getByText('Item 19')).toBeInTheDocument()
    expect(screen.getByText('Item 20')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /All answers/ }))
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('retakes with a fresh attempt while preserving result history', async () => {
    const user = await answerExam({ correct: 15, incorrect: 3 })

    await user.click(
      screen.getAllByRole('button', { name: 'Retake Exam' })[0],
    )
    await screen.findByRole('heading', {
      name: /Comprehensive Examination/i,
    })

    const checked = screen
      .getAllByRole('radio')
      .filter((radio) => radio.getAttribute('aria-checked') === 'true')
    expect(checked).toHaveLength(0)

    const savedHistory = JSON.parse(
      window.localStorage.getItem(HISTORY_KEY) ?? '[]',
    )
    expect(savedHistory).toHaveLength(1)
    expect(savedHistory[0].score.correct).toBe(25)
  })

  it('clears saved results only after explicit confirmation', async () => {
    const user = await startExam()
    await user.click(
      screen.getAllByRole('button', { name: 'Submit Exam' })[0],
    )
    const submitDialog = await screen.findByRole('dialog')
    await user.click(
      within(submitDialog).getByRole('button', {
        name: 'Confirm Submission',
      }),
    )
    await screen.findByRole('heading', { name: 'Your Results' })

    await user.click(
      screen.getByRole('button', { name: 'Return to Dashboard' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Clear saved results' }),
    )
    const clearDialog = await screen.findByRole('dialog')
    expect(
      within(clearDialog).getByText('Clear all saved results?'),
    ).toBeInTheDocument()

    await user.click(
      within(clearDialog).getByRole('button', {
        name: 'Clear Saved Results',
      }),
    )

    expect(screen.getByText('No saved attempts yet')).toBeInTheDocument()
    expect(
      JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? '[]'),
    ).toHaveLength(0)
    expect(window.localStorage.getItem(ATTEMPT_KEY)).toBeNull()
  })
})

describe('study mode and identification section', () => {
  it('shows the correct answer and explanation in study mode', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Study' }))
    await screen.findByRole('heading', { name: 'Review the Key Answers' })

    const first = questions[0]
    expect(screen.getByText(first.question)).toBeInTheDocument()
    expect(screen.getByText(first.answer)).toBeInTheDocument()
    expect(screen.getByText(first.explanation)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(questions[1].question)).toBeInTheDocument()
    expect(screen.getByText(questions[1].answer)).toBeInTheDocument()
  })

  it('shows the exact heading, directions, 10 terms and ten active blanks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Word Bank' }))
    await screen.findByRole('heading', {
      name: 'Identification with Word Bank',
    })

    expect(
      screen.getByText('B. IDENTIFICATION WITH WORD BANK (Items 21–30)'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Choose the correct term from the Word Bank for each description and write it on the blank. Use each term only once./,
      ),
    ).toBeInTheDocument()

    wordBank.forEach((term) => {
      expect(screen.getByText(term)).toBeInTheDocument()
    })

    const inputs = screen.getAllByRole('combobox')
    expect(inputs).toHaveLength(10)
    inputs.forEach((input) => expect(input).not.toBeDisabled())
    expect(
      screen.getByText('Section complete and scoreable'),
    ).toBeInTheDocument()
    identificationItems.forEach((item) => {
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  it('checks all ten identification answers and persists the score', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Word Bank' }))
    await screen.findByRole('heading', {
      name: 'Identification with Word Bank',
    })

    const inputs = screen.getAllByRole('combobox')
    for (let index = 0; index < identificationItems.length; index += 1) {
      await user.type(
        inputs[index],
        identificationItems[index].acceptedAnswers[0],
      )
    }

    await user.click(screen.getByRole('button', { name: 'Check Answers' }))

    expect(screen.getByTestId('identification-score')).toHaveTextContent('10')
    expect(
      screen.getByText(/You scored 10\/10 \(100%\)\. 0 incorrect, 0 unanswered\./),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/^Correct —/)).toHaveLength(10)

    await user.click(
      screen.getAllByRole('button', { name: 'Dashboard' })[0],
    )
    await user.click(screen.getByRole('button', { name: 'Word Bank' }))
    await screen.findByRole('heading', {
      name: 'Identification with Word Bank',
    })

    expect(screen.getByTestId('identification-score')).toHaveTextContent('10')
    expect(screen.getAllByRole('combobox')[0]).toHaveValue(
      identificationItems[0].acceptedAnswers[0],
    )
  })
})
