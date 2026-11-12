import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  LibraryBig,
  LogOut,
  Send,
} from 'lucide-react'
import {
  identificationItems,
  wordBank,
} from '../data/identification'
import { questions } from '../data/questions'
import type { ExamAttempt } from '../lib/attempt'
import { getQuestionOptions } from '../lib/attempt'
import {
  countAnswered,
  countAnsweredByIdentity,
  examSteps,
  TOTAL_EXAM,
} from '../lib/exam'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ProgressBar } from '../components/ProgressBar'

interface ExamProps {
  attempt: ExamAttempt
  onSelectAnswer: (questionId: number, answer: string) => void
  onSelectIdentificationAnswer: (itemId: number, value: string) => void
  onSetCurrentIndex: (index: number) => void
  onSubmit: () => void
  onExit: () => void
}

export function Exam({
  attempt,
  onSelectAnswer,
  onSelectIdentificationAnswer,
  onSetCurrentIndex,
  onSubmit,
  onExit,
}: ExamProps) {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submittedRef = useRef(false)

  const safeIndex = Math.min(
    Math.max(attempt.currentIndex, 0),
    TOTAL_EXAM - 1,
  )
  const step = examSteps[safeIndex]
  const isIdentification = step.kind === 'identification'
  const currentQuestion =
    step.kind === 'multiple-choice' ? questions[step.index] : null
  const currentItem =
    step.kind === 'identification' ? identificationItems[step.index] : null

  const options = useMemo(
    () =>
      currentQuestion
        ? getQuestionOptions(
            attempt,
            currentQuestion.id,
            currentQuestion.answer,
            currentQuestion.distractors,
          )
        : [],
    [attempt, currentQuestion],
  )

  const selectedAnswer = currentQuestion
    ? (attempt.answers[String(currentQuestion.id)] ?? null)
    : null
  const identificationValue = currentItem
    ? (attempt.identificationAnswers[String(currentItem.id)] ?? '')
    : ''
  const currentAnswered = isIdentification
    ? identificationValue.trim().length > 0
    : Boolean(selectedAnswer?.trim())

  const answeredCount = countAnswered(
    attempt.answers,
    attempt.identificationAnswers,
  )
  const sectionCounts = countAnsweredByIdentity(
    attempt.answers,
    attempt.identificationAnswers,
  )
  const unansweredCount = TOTAL_EXAM - answeredCount
  const progressPercentage = Math.round((answeredCount / TOTAL_EXAM) * 100)
  const isLastStep = safeIndex === TOTAL_EXAM - 1
  const isFirstStep = safeIndex === 0

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [safeIndex])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (showSubmitDialog) return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      if (currentQuestion) {
        const letterIndex = ['A', 'B', 'C', 'D'].indexOf(
          event.key.toUpperCase(),
        )
        if (letterIndex >= 0 && letterIndex < options.length) {
          event.preventDefault()
          onSelectAnswer(currentQuestion.id, options[letterIndex])
          return
        }
      }

      if (event.key === 'ArrowLeft' && safeIndex > 0) {
        event.preventDefault()
        onSetCurrentIndex(safeIndex - 1)
      } else if (
        event.key === 'ArrowRight' &&
        safeIndex < TOTAL_EXAM - 1
      ) {
        event.preventDefault()
        onSetCurrentIndex(safeIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentQuestion,
    onSelectAnswer,
    onSetCurrentIndex,
    options,
    safeIndex,
    showSubmitDialog,
  ])

  function handleConfirmSubmit() {
    if (submittedRef.current || submitting) return
    submittedRef.current = true
    setSubmitting(true)
    setShowSubmitDialog(false)
    onSubmit()
  }

  function goTo(index: number) {
    onSetCurrentIndex(index)
  }

  const sectionLabel = isIdentification
    ? 'Section B • Identification'
    : 'Section A • Multiple Choice'

  return (
    <div className="animate-fade-up pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Items 1–{TOTAL_EXAM} • One combined attempt</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Comprehensive Examination
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Answer 20 multiple-choice items, then 10 identification items in the
            same attempt. Your work saves automatically, and you submit once for
            one combined score out of {TOTAL_EXAM}.
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="btn-secondary shrink-0 self-start sm:self-auto"
        >
          <LogOut size={17} aria-hidden="true" />
          Exit to dashboard
        </button>
      </div>

      <div className="card mt-5 p-4 lg:hidden">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
          <span className="text-ink-700">Overall progress</span>
          <span className="text-ink-500">
            {answeredCount} of {TOTAL_EXAM} answered
          </span>
        </div>
        <ProgressBar
          value={progressPercentage}
          label="Overall examination progress"
          className="mt-2"
        />
        <p className="mt-1.5 text-[11px] text-ink-500">
          {sectionCounts.multipleChoice}/20 multiple choice •{' '}
          {sectionCounts.identification}/10 identification
        </p>
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        {/* Question card */}
        <section
          id="exam-question-card"
          className="card scroll-mt-24 overflow-hidden"
          aria-labelledby="exam-question-title"
        >
          <p className="sr-only" aria-live="polite">
            Item {step.id} of {TOTAL_EXAM} • {sectionLabel}
          </p>
          <div className="border-b border-ink-100 bg-white px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-sm font-extrabold text-brand-700">
                  {step.id}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Item {safeIndex + 1} of {TOTAL_EXAM}
                  </p>
                  <p className="text-sm font-semibold text-ink-800">
                    {sectionLabel}
                  </p>
                </div>
              </div>
              <span
                className={[
                  'badge',
                  currentAnswered
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-ink-100 text-ink-500',
                ].join(' ')}
              >
                {currentAnswered ? (
                  <Check size={13} aria-hidden="true" />
                ) : (
                  <AlertCircle size={13} aria-hidden="true" />
                )}
                {currentAnswered ? 'Answered' : 'Not answered'}
              </span>
            </div>
          </div>

          <div
            key={step.id}
            className="animate-question-in px-5 py-6 sm:px-7 sm:py-7"
          >
            {currentQuestion ? (
              <>
                <h2
                  id="exam-question-title"
                  className="text-lg font-bold leading-8 tracking-tight text-ink-900 sm:text-xl"
                >
                  {currentQuestion.question}
                </h2>
                <p className="mt-2 text-sm text-ink-500">Select one answer.</p>

                <div
                  role="radiogroup"
                  aria-labelledby="exam-question-title"
                  className="mt-5 space-y-2.5"
                >
                  {options.map((option, index) => {
                    const selected = selectedAnswer === option
                    const letter = String.fromCharCode(65 + index)
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() =>
                          onSelectAnswer(currentQuestion.id, option)
                        }
                        className={[
                          'group flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4',
                          selected
                            ? 'border-brand-500 bg-brand-50/80 shadow-sm ring-1 ring-brand-500'
                            : 'border-ink-200 bg-white hover:-translate-y-0.5 hover:border-ink-300 hover:bg-ink-50/60 hover:shadow-sm',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors',
                            selected
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-ink-200 bg-ink-50 text-ink-600 group-hover:border-brand-300 group-hover:text-brand-700',
                          ].join(' ')}
                          aria-hidden="true"
                        >
                          {letter}
                        </span>
                        <span
                          className={[
                            'min-w-0 flex-1 pt-1 text-sm leading-6 sm:text-[15px]',
                            selected
                              ? 'font-medium text-brand-950'
                              : 'text-ink-700',
                          ].join(' ')}
                        >
                          {option}
                        </span>
                        <span
                          aria-hidden="true"
                          className={[
                            'mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                            selected
                              ? 'border-brand-600 bg-brand-600'
                              : 'border-ink-300 bg-white group-hover:border-brand-400',
                          ].join(' ')}
                        >
                          {selected && (
                            <span className="size-2 animate-pop rounded-full bg-white" />
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <p className="mt-4 hidden text-[11px] font-medium text-ink-500 sm:block">
                  Keyboard: press A–D to select an answer, or ← → to move
                  between items.
                </p>
              </>
            ) : (
              currentItem && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge bg-emerald-50 text-emerald-700">
                      <LibraryBig size={13} aria-hidden="true" />
                      Word Bank
                    </span>
                    <span className="text-xs font-medium text-ink-500">
                      Use each term only once
                    </span>
                  </div>
                  <h2
                    id="exam-question-title"
                    className="mt-3 text-lg font-bold leading-8 tracking-tight text-ink-900 sm:text-xl"
                  >
                    {currentItem.description}
                  </h2>

                  <div className="mt-5">
                    <label
                      htmlFor={`exam-identification-${currentItem.id}`}
                      className="text-[11px] font-bold uppercase tracking-wider text-ink-500"
                    >
                      Answer for item {currentItem.id}
                    </label>
                    <input
                      id={`exam-identification-${currentItem.id}`}
                      type="text"
                      list="exam-word-bank-terms"
                      value={identificationValue}
                      onChange={(event) =>
                        onSelectIdentificationAnswer(
                          currentItem.id,
                          event.target.value,
                        )
                      }
                      placeholder="Type a term from the Word Bank"
                      autoComplete="off"
                      spellCheck={false}
                      className="blank-input mt-1.5"
                    />
                    <p className="mt-2 text-[11px] leading-5 text-ink-500">
                      Answers are case-insensitive. Spelling must match one of
                      the ten Word Bank terms.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-ink-200 bg-ink-50/60 p-4">
                    {wordBank.map((term, index) => (
                      <div
                        key={term}
                        className="flex items-start gap-2 text-xs font-medium text-ink-700"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold text-brand-700 shadow-sm">
                          {index + 1}
                        </span>
                        <span className="leading-5">{term}</span>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-ink-100 bg-ink-50/40 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              disabled={isFirstStep}
              className="btn-secondary order-1 w-full sm:order-none sm:w-auto"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Previous
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitDialog(true)}
              className={[
                'btn-ghost order-3 col-span-2 w-full sm:order-none sm:w-auto',
                isLastStep ? 'hidden sm:inline-flex' : '',
              ].join(' ')}
            >
              <Send size={16} aria-hidden="true" />
              Submit Exam
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={() => setShowSubmitDialog(true)}
                className="btn-primary order-2 w-full sm:order-none sm:w-auto"
              >
                Review &amp; Submit
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goTo(safeIndex + 1)}
                className="btn-primary order-2 w-full sm:order-none sm:w-auto"
              >
                Next
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-ink-900">Exam progress</h2>
              <span className="text-xs font-semibold text-ink-500">
                {answeredCount}/{TOTAL_EXAM}
              </span>
            </div>
            <ProgressBar
              value={progressPercentage}
              label="Examination progress"
              className="mt-3"
            />
            <p className="mt-2 text-[11px] leading-5 text-ink-500">
              {progressPercentage}% answered • {unansweredCount} remaining
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-ink-500">
              <span>MCQ {sectionCounts.multipleChoice}/20</span>
              <span>Identification {sectionCounts.identification}/10</span>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-ink-700">
                Section A — Multiple choice
              </p>
              <div
                className="mt-2.5 grid grid-cols-5 gap-1.5"
                aria-label="Multiple-choice navigation"
              >
                {questions.map((question, index) => {
                  const answered = Boolean(
                    attempt.answers[String(question.id)]?.trim(),
                  )
                  const current = index === safeIndex
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Item ${question.id}${answered ? ', answered' : ', not answered'}${current ? ', current item' : ''}`}
                      aria-current={current ? 'step' : undefined}
                      className={[
                        'flex aspect-square min-h-[40px] items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200',
                        answered
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-200 bg-white text-ink-600 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50',
                        current
                          ? 'ring-2 ring-brand-400 ring-offset-2'
                          : '',
                      ].join(' ')}
                    >
                      {question.id}
                    </button>
                  )
                })}
              </div>

              <p className="mt-4 text-xs font-semibold text-ink-700">
                Section B — Identification
              </p>
              <div
                className="mt-2.5 grid grid-cols-5 gap-1.5"
                aria-label="Identification navigation"
              >
                {identificationItems.map((item, index) => {
                  const answered = Boolean(
                    attempt.identificationAnswers[String(item.id)]?.trim(),
                  )
                  const stepIndex = questions.length + index
                  const current = stepIndex === safeIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goTo(stepIndex)}
                      aria-label={`Item ${item.id}${answered ? ', answered' : ', not answered'}${current ? ', current item' : ''}`}
                      aria-current={current ? 'step' : undefined}
                      className={[
                        'flex aspect-square min-h-[40px] items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200',
                        answered
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-ink-200 bg-white text-ink-600 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50',
                        current
                          ? 'ring-2 ring-emerald-400 ring-offset-2'
                          : '',
                      ].join(' ')}
                    >
                      {item.id}
                    </button>
                  )
                })}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-brand-600" />
                  MCQ answered
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-emerald-600" />
                  Identification answered
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <LibraryBig size={18} aria-hidden="true" />
              </span>
              <h2 className="text-sm font-bold text-ink-900">Word Bank</h2>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-ink-500">
              Ten terms for Items 21–30. Use each term exactly once.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {wordBank.map((term) => (
                <span
                  key={term}
                  className="rounded-lg border border-ink-200 bg-ink-50 px-2 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-bold text-ink-900">
                  Ready to submit?
                </h2>
                <p className="mt-1 text-xs leading-5 text-ink-500">
                  Check your answers first. Submission is final for this attempt
                  and produces one score out of {TOTAL_EXAM}.
                </p>
              </div>
            </div>
            {unansweredCount > 0 && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
                {unansweredCount}{' '}
                {unansweredCount === 1 ? 'item is' : 'items are'} still
                unanswered.
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowSubmitDialog(true)}
              className="btn-primary mt-4 w-full"
            >
              <ClipboardCheck size={17} aria-hidden="true" />
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={showSubmitDialog}
        title="Submit your examination?"
        description="Are you sure you want to submit your examination? You cannot change your answers after submission."
        confirmLabel={submitting ? 'Submitting…' : 'Confirm Submission'}
        cancelLabel="Cancel"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      >
        <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-3 text-xs leading-5 text-ink-600">
          <span className="font-semibold text-ink-800">
            {answeredCount} of {TOTAL_EXAM}
          </span>{' '}
          items answered
          {unansweredCount > 0
            ? ` • ${unansweredCount} unanswered (not counted as correct)`
            : ' • all items answered'}
          .
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-600">
            Multiple choice:{' '}
            <strong className="font-semibold text-ink-900">
              {sectionCounts.multipleChoice}/20
            </strong>
          </div>
          <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-600">
            Identification:{' '}
            <strong className="font-semibold text-ink-900">
              {sectionCounts.identification}/10
            </strong>
          </div>
        </div>
      </ConfirmDialog>

      <datalist id="exam-word-bank-terms">
        {wordBank.map((term) => (
          <option key={term} value={term} />
        ))}
      </datalist>
    </div>
  )
}
