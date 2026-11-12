import { useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleMinus,
  ClipboardCheck,
  LayoutDashboard,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react'
import { isIdentificationConfigured, identificationItemCount } from '../data/identification'
import type { ExamAttempt } from '../lib/attempt'
import type { AnswerStatus } from '../lib/scoring'
import { getPerformance, scoreMultipleChoice } from '../lib/scoring'
import { formatDate } from '../lib/format'
import { ScoreRing } from '../components/ScoreRing'
import type { View } from '../types'

interface ResultsProps {
  attempt: ExamAttempt | null
  onRetake: () => void
  onNavigate: (view: View) => void
}

type ReviewFilter = 'all' | 'wrong'

const statusConfig: Record<
  AnswerStatus,
  { label: string; badge: string; icon: typeof CheckCircle2; ring: string }
> = {
  correct: {
    label: 'Correct',
    badge: 'bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
    ring: 'border-emerald-200',
  },
  incorrect: {
    label: 'Incorrect',
    badge: 'bg-rose-50 text-rose-700',
    icon: XCircle,
    ring: 'border-rose-200',
  },
  unanswered: {
    label: 'Unanswered',
    badge: 'bg-ink-100 text-ink-600',
    icon: CircleMinus,
    ring: 'border-ink-200',
  },
}

export function Results({ attempt, onRetake, onNavigate }: ResultsProps) {
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const reviewRef = useRef<HTMLElement>(null)

  if (!attempt || !attempt.submittedAt) {
    return (
      <div className="animate-fade-up py-12">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <ClipboardCheck size={26} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink-900">
            No submitted attempt yet
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Start the examination and submit your answers to see your results
            and answer review here.
          </p>
          <button
            type="button"
            onClick={onRetake}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            Start Exam
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  const score = attempt.score ?? scoreMultipleChoice(attempt.answers)
  const performance = getPerformance(score.percentage)
  const wrongCount = score.incorrect + score.unanswered
  const visibleReview =
    filter === 'wrong'
      ? score.review.filter((item) => item.status !== 'correct')
      : score.review

  const performanceClasses = {
    excellent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    good: 'bg-brand-50 text-brand-700 border-brand-100',
    fair: 'bg-amber-50 text-amber-700 border-amber-100',
    focus: 'bg-rose-50 text-rose-700 border-rose-100',
  }[performance.tone]

  function showIncorrect() {
    setFilter('wrong')
    window.setTimeout(() => {
      reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }

  function showAll() {
    setFilter('all')
  }

  return (
    <div className="animate-fade-up space-y-6 pb-12">
      {/* Summary */}
      <section className="overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-soft">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:p-10">
          <div>
            <span className="badge border border-emerald-100 bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={14} aria-hidden="true" />
              Examination submitted
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              Your Results
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Submitted {formatDate(attempt.submittedAt)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={`badge border px-3 py-1.5 text-sm ${performanceClasses}`}
              >
                <Target size={15} aria-hidden="true" />
                {performance.label}
              </span>
              <span className="text-sm text-ink-500">
                Multiple-choice score:{' '}
                <strong className="font-semibold text-ink-800">
                  {score.correct}/{score.total}
                </strong>
              </span>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-6 text-ink-600">
              {performance.message}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:max-w-md">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3">
                <p
                  data-testid="result-correct"
                  className="text-xl font-extrabold text-emerald-700"
                >
                  {score.correct}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-emerald-700/80">
                  Correct
                </p>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-3">
                <p
                  data-testid="result-incorrect"
                  className="text-xl font-extrabold text-rose-700"
                >
                  {score.incorrect}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-rose-700/80">
                  Incorrect
                </p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-ink-50 px-3 py-3">
                <p
                  data-testid="result-unanswered"
                  className="text-xl font-extrabold text-ink-700"
                >
                  {score.unanswered}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-ink-500">
                  Unanswered
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-200/80 bg-ink-50/60 p-5">
            <ScoreRing
              percentage={score.percentage}
              size={176}
              label="Final score"
              tone={score.percentage >= 75 ? 'green' : 'brand'}
            />
            <p className="mt-4 text-sm font-semibold text-ink-800">
              {score.correct} out of {score.total} correct
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {score.percentage}% final percentage
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-100 bg-ink-50/40 px-6 py-4 sm:flex-row sm:flex-wrap sm:px-8">
          <button type="button" onClick={onRetake} className="btn-primary">
            <RotateCcw size={17} aria-hidden="true" />
            Retake Exam
          </button>
          <button
            type="button"
            onClick={showIncorrect}
            className="btn-secondary"
            disabled={wrongCount === 0}
          >
            <XCircle size={17} aria-hidden="true" />
            Review Incorrect Answers
            {score.incorrect > 0 && (
              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[11px] font-bold text-rose-700">
                {score.incorrect}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('study')}
            className="btn-secondary"
          >
            <BookOpen size={17} aria-hidden="true" />
            Study Mode
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="btn-ghost sm:ml-auto"
          >
            <LayoutDashboard size={17} aria-hidden="true" />
            Return to Dashboard
          </button>
        </div>
      </section>

      {/* Identification status */}
      <section className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ClipboardCheck size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-ink-900">
              Identification with Word Bank — Items 21–{20 + identificationItemCount}
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-ink-500">
              {isIdentificationConfigured
                ? `The 10-item identification section is configured and scored separately out of ${identificationItemCount}. Open it to answer and check your score.`
                : 'The identification section is not configured, so it is not included in this multiple-choice result.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('identification')}
          className="btn-secondary shrink-0 self-start sm:self-auto"
        >
          Open Identification
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>

      {/* Review */}
      <section ref={reviewRef} className="scroll-mt-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Review Answers
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Your selected answer, the correct answer, and a short explanation
              for each item.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-ink-200 bg-white p-1">
            <button
              type="button"
              onClick={showAll}
              aria-pressed={filter === 'all'}
              className={[
                'min-h-[38px] rounded-lg px-3 text-xs font-semibold transition-colors',
                filter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'text-ink-600 hover:bg-ink-100',
              ].join(' ')}
            >
              All answers ({score.total})
            </button>
            <button
              type="button"
              onClick={showIncorrect}
              aria-pressed={filter === 'wrong'}
              className={[
                'min-h-[38px] rounded-lg px-3 text-xs font-semibold transition-colors',
                filter === 'wrong'
                  ? 'bg-brand-600 text-white'
                  : 'text-ink-600 hover:bg-ink-100',
              ].join(' ')}
            >
              Incorrect &amp; unanswered ({wrongCount})
            </button>
          </div>
        </div>

        {filter === 'wrong' && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/60 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            <XCircle size={15} aria-hidden="true" />
            Showing only items that were answered incorrectly or left unanswered.
          </p>
        )}

        {visibleReview.length === 0 ? (
          <div className="card mt-4 flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} aria-hidden="true" />
            </span>
            <p className="mt-3 font-semibold text-ink-800">
              No incorrect or unanswered items
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Every multiple-choice item was answered correctly.
            </p>
            <button
              type="button"
              onClick={showAll}
              className="btn-secondary mt-5"
            >
              Show all answers
            </button>
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {visibleReview.map((item) => {
              const config = statusConfig[item.status]
              const Icon = config.icon
              return (
                <li
                  key={item.questionId}
                  className={`card overflow-hidden border-l-4 ${config.ring}`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-ink-100 text-xs font-bold text-ink-700">
                          {item.questionId}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                          Item {item.questionId}
                        </span>
                      </span>
                      <span className={`badge ${config.badge}`}>
                        <Icon size={13} aria-hidden="true" />
                        {config.label}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-bold leading-6 text-ink-900 sm:text-[15px]">
                      {item.question}
                    </h3>

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      <div
                        className={[
                          'rounded-xl border px-3.5 py-3',
                          item.status === 'correct'
                            ? 'border-emerald-100 bg-emerald-50/50'
                            : item.status === 'incorrect'
                              ? 'border-rose-100 bg-rose-50/50'
                              : 'border-ink-200 bg-ink-50',
                        ].join(' ')}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                          Your answer
                        </p>
                        <p
                          className={[
                            'mt-1 text-sm leading-6',
                            item.selectedAnswer === null
                              ? 'italic text-ink-500'
                              : 'font-medium text-ink-800',
                          ].join(' ')}
                        >
                          {item.selectedAnswer ?? 'Not answered'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700/80">
                          Correct answer
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-emerald-900">
                          {item.correctAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-ink-100 bg-ink-50/60 px-3.5 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                        Why
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink-600">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      {/* Bottom actions */}
      <section className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-bold text-ink-900">Want another attempt?</h2>
          <p className="mt-1 text-xs leading-5 text-ink-500">
            Retaking starts a fresh attempt and keeps this result in your saved
            history.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="btn-secondary"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Dashboard
          </button>
          <button type="button" onClick={onRetake} className="btn-primary">
            <RotateCcw size={17} aria-hidden="true" />
            Retake Exam
          </button>
        </div>
      </section>
    </div>
  )
}
