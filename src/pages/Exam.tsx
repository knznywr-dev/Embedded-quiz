import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  LogOut,
  Send,
} from 'lucide-react'
import { TOTAL_MCQ, questions } from '../data/questions'
import type { ExamAttempt } from '../lib/attempt'
import { getQuestionOptions } from '../lib/attempt'
import { ConfirmDialog } from '../components/ConfirmDialog'

interface ExamProps {
  attempt: ExamAttempt
  onSelectAnswer: (questionId: number, answer: string) => void
  onSetCurrentIndex: (index: number) => void
  onSubmit: () => void
  onExit: () => void
}

export function Exam({
  attempt,
  onSelectAnswer,
  onSetCurrentIndex,
  onSubmit,
  onExit,
}: ExamProps) {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submittedRef = useRef(false)

  const safeIndex = Math.min(
    Math.max(attempt.currentIndex, 0),
    questions.length - 1,
  )
  const currentQuestion = questions[safeIndex]
  const options = getQuestionOptions(
    attempt,
    currentQuestion.id,
    currentQuestion.answer,
    currentQuestion.distractors,
  )
  const selectedAnswer = attempt.answers[String(currentQuestion.id)] ?? null
  const answeredCount = questions.filter((question) =>
    Boolean(attempt.answers[String(question.id)]?.trim()),
  ).length
  const unansweredCount = TOTAL_MCQ - answeredCount
  const progressPercentage = Math.round((answeredCount / TOTAL_MCQ) * 100)
  const isLastQuestion = safeIndex === questions.length - 1
  const isFirstQuestion = safeIndex === 0

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

      const letterIndex = ['A', 'B', 'C', 'D'].indexOf(
        event.key.toUpperCase(),
      )
      if (letterIndex >= 0 && letterIndex < options.length) {
        event.preventDefault()
        onSelectAnswer(currentQuestion.id, options[letterIndex])
        return
      }

      if (event.key === 'ArrowLeft' && safeIndex > 0) {
        event.preventDefault()
        onSetCurrentIndex(safeIndex - 1)
      } else if (
        event.key === 'ArrowRight' &&
        safeIndex < questions.length - 1
      ) {
        event.preventDefault()
        onSetCurrentIndex(safeIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentQuestion.id,
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

  return (
    <div className="animate-fade-up pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Section A • Items 1–20</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Multiple Choice Examination
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Select one answer per question. Your selections are saved as you go,
            and you can change them before submitting.
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
            {answeredCount} of {TOTAL_MCQ} answered
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-ink-500">
          {progressPercentage}% complete
        </p>
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Question card */}
        <section
          id="exam-question-card"
          className="card scroll-mt-24 overflow-hidden"
          aria-labelledby="exam-question-title"
        >
          <p className="sr-only" aria-live="polite">
            Question {safeIndex + 1} of {TOTAL_MCQ}
          </p>
          <div className="border-b border-ink-100 bg-white px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-sm font-extrabold text-brand-700">
                  {currentQuestion.id}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Question {safeIndex + 1} of {TOTAL_MCQ}
                  </p>
                  <p className="text-sm font-semibold text-ink-800">
                    Item {currentQuestion.id}
                  </p>
                </div>
              </div>
              <span
                className={[
                  'badge',
                  selectedAnswer
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-ink-100 text-ink-500',
                ].join(' ')}
              >
                {selectedAnswer ? (
                  <Check size={13} aria-hidden="true" />
                ) : (
                  <AlertCircle size={13} aria-hidden="true" />
                )}
                {selectedAnswer ? 'Answered' : 'Not answered'}
              </span>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
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
                      'group flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 sm:p-4',
                      selected
                        ? 'border-brand-500 bg-brand-50/80 shadow-sm ring-1 ring-brand-500'
                        : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50/60',
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
                        selected ? 'font-medium text-brand-950' : 'text-ink-700',
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
                        <span className="size-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="mt-4 hidden text-[11px] font-medium text-ink-500 sm:block">
              Keyboard: press A–D to select an answer, or ← → to move between
              questions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-ink-100 bg-ink-50/40 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              disabled={isFirstQuestion}
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
                isLastQuestion ? 'hidden sm:inline-flex' : '',
              ].join(' ')}
            >
              <Send size={16} aria-hidden="true" />
              Submit Exam
            </button>

            {isLastQuestion ? (
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
                {answeredCount}/{TOTAL_MCQ}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] leading-5 text-ink-500">
              {progressPercentage}% answered • {unansweredCount} remaining
            </p>

            <div className="mt-5">
              <p className="text-xs font-semibold text-ink-700">
                Question navigation
              </p>
              <div
                className="mt-2.5 grid grid-cols-5 gap-1.5"
                aria-label="Question navigation"
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
                      aria-label={`Question ${question.id}${answered ? ', answered' : ', not answered'}${current ? ', current question' : ''}`}
                      aria-current={current ? 'step' : undefined}
                      className={[
                        'flex aspect-square min-h-[40px] items-center justify-center rounded-lg border text-xs font-bold transition-all',
                        answered
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:bg-brand-50',
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
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-brand-600" />
                  Answered
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm border border-ink-300 bg-white" />
                  Unanswered
                </span>
              </div>
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
                  Check your answers first. Submission is final for this attempt.
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
            {answeredCount} of {TOTAL_MCQ}
          </span>{' '}
          items answered
          {unansweredCount > 0
            ? ` • ${unansweredCount} unanswered (not counted as correct)`
            : ' • all questions answered'}
          .
        </div>
      </ConfirmDialog>
    </div>
  )
}
