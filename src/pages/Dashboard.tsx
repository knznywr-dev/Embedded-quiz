import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  History,
  LibraryBig,
  ListChecks,
  PenLine,
  Play,
  Sparkles,
  Target,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { identificationItemCount, wordBank } from '../data/identification'
import { TOTAL_MCQ } from '../data/questions'
import type { ExamAttempt } from '../lib/attempt'
import { formatDate } from '../lib/format'
import type { View } from '../types'
import { ScoreRing } from '../components/ScoreRing'

interface DashboardProps {
  attempt: ExamAttempt | null
  history: ExamAttempt[]
  onStartExam: () => void
  onNavigate: (view: View) => void
  onViewResult: (attemptId: string) => void
  onRequestClearHistory: () => void
}

interface StatCard {
  label: string
  value: number
  note: string
  icon: LucideIcon
}

const stats: StatCard[] = [
  {
    label: 'Multiple-choice items',
    value: TOTAL_MCQ,
    note: 'Items 1–20 • auto-scored',
    icon: ClipboardCheck,
  },
  {
    label: 'Identification items',
    value: identificationItemCount,
    note: 'Items 21–30 • auto-scored',
    icon: PenLine,
  },
  {
    label: 'Word Bank terms',
    value: wordBank.length,
    note: 'Two-column reference',
    icon: LibraryBig,
  },
  {
    label: 'Total exam items',
    value: TOTAL_MCQ + identificationItemCount,
    note: 'Complete examination set',
    icon: ListChecks,
  },
]

export function Dashboard({
  attempt,
  history,
  onStartExam,
  onNavigate,
  onViewResult,
  onRequestClearHistory,
}: DashboardProps) {
  const activeAttempt = attempt && !attempt.submittedAt ? attempt : null
  const latestResult = history[0] ?? (attempt?.submittedAt ? attempt : null)
  const answeredCount = activeAttempt
    ? Object.values(activeAttempt.answers).filter((answer) => answer.trim())
        .length
    : 0
  const progressPercentage = Math.round((answeredCount / TOTAL_MCQ) * 100)
  const latestScore = latestResult?.score ?? null
  const displayPercentage = latestScore
    ? latestScore.percentage
    : progressPercentage
  const ringLabel = latestScore ? 'Latest score' : 'Progress'

  const primaryLabel = activeAttempt ? 'Continue Exam' : 'Start Exam'
  const PrimaryIcon = activeAttempt ? Play : ClipboardCheck

  return (
    <div className="animate-fade-up space-y-8 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-ink-200/80 bg-white p-6 shadow-soft sm:p-9 lg:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-gradient-to-br from-brand-100 via-brand-50 to-transparent opacity-90 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-indigo-50 opacity-80 blur-2xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_0.85fr] lg:gap-12">
          <div>
            <span className="badge border border-brand-100 bg-brand-50 text-brand-700">
              <Sparkles size={13} aria-hidden="true" />
              Interactive exam reviewer
            </span>
            <h1 className="mt-5 max-w-2xl text-[1.8rem] font-extrabold leading-[1.08] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.9rem]">
              EMBEDDED SYSTEMS
              <span className="mt-1 block text-brand-600">EXAM REVIEWER</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-600">
              Welcome! Practice the multiple-choice examination one question at
              a time, check your answers instantly, and track your progress.
              When you are ready, review the key ideas in Study Mode.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={onStartExam}
                className="btn-primary w-full sm:w-auto"
              >
                <PrimaryIcon size={18} aria-hidden="true" />
                {primaryLabel}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('study')}
                className="btn-secondary w-full sm:w-auto"
              >
                <BookOpen size={18} aria-hidden="true" />
                Study / Review
              </button>
              {latestResult && (
                <button
                  type="button"
                  onClick={() => onViewResult(latestResult.id)}
                  className="btn-ghost w-full sm:w-auto"
                >
                  <Target size={17} aria-hidden="true" />
                  Latest result
                </button>
              )}
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs font-medium text-ink-500">
              <CheckCircle2
                size={15}
                className="text-emerald-600"
                aria-hidden="true"
              />
              Answers save automatically in this browser.
            </p>
          </div>

          {/* Snapshot */}
          <div className="rounded-2xl border border-ink-200/80 bg-ink-50/70 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Your snapshot</p>
                <p className="mt-1 text-sm font-semibold text-ink-800">
                  {activeAttempt
                    ? 'Attempt in progress'
                    : latestScore
                      ? 'Latest submitted score'
                      : 'No attempt started'}
                </p>
              </div>
              <span
                className={[
                  'badge',
                  activeAttempt
                    ? 'bg-amber-50 text-amber-700'
                    : latestScore
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-ink-100 text-ink-600',
                ].join(' ')}
              >
                {activeAttempt ? 'In progress' : latestScore ? 'Submitted' : 'Ready'}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <ScoreRing
                percentage={displayPercentage}
                label={ringLabel}
                tone={
                  latestScore
                    ? latestScore.percentage >= 75
                      ? 'green'
                      : 'brand'
                    : 'brand'
                }
              />
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">Answered</span>
                <span className="font-semibold text-ink-900">
                  {answeredCount} / {TOTAL_MCQ}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs leading-5 text-ink-500">
                {latestScore
                  ? `Most recent score: ${latestScore.correct}/${latestScore.total} (${latestScore.percentage}%)`
                  : activeAttempt
                    ? 'Continue where you left off. Every answer is saved.'
                    : 'Start the exam when you are ready. You can change answers before submitting.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Reviewer at a glance">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <div key={label} className="card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-ink-900">
                  {value}
                </span>
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold leading-tight text-ink-800">
                {label}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-ink-500">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section aria-labelledby="sections-heading" className="space-y-4">
        <div>
          <h2
            id="sections-heading"
            className="text-xl font-bold tracking-tight text-ink-900"
          >
            Examination sections
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Two sections make up the complete reviewer.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="card flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <ClipboardCheck size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="eyebrow">Section A</p>
                  <h3 className="mt-0.5 font-bold text-ink-900">
                    Multiple Choice
                  </h3>
                </div>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">
                Ready
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink-600">
              Items 1–20. One question at a time with four choices, instant
              feedback after submission, and automatic scoring out of 20.
            </p>

            {activeAttempt && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-medium text-ink-500">
                  <span>Saved progress</span>
                  <span>
                    {answeredCount}/{TOTAL_MCQ} answered
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={onStartExam}
                className="btn-primary flex-1"
              >
                {activeAttempt ? (
                  <Play size={17} aria-hidden="true" />
                ) : (
                  <ClipboardCheck size={17} aria-hidden="true" />
                )}
                {primaryLabel}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('study')}
                className="btn-secondary flex-1"
              >
                <BookOpen size={17} aria-hidden="true" />
                Study Mode
              </button>
            </div>
          </article>

          <article className="card flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <PenLine size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="eyebrow">Section B</p>
                  <h3 className="mt-0.5 font-bold text-ink-900">
                    Identification with Word Bank
                  </h3>
                </div>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">
                Scoreable out of {identificationItemCount}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink-600">
              Items 21–30. Ten descriptions cover all 10 Word Bank terms, with
              a verified answer key for each. Use every term exactly once.
            </p>

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3 text-xs leading-5 text-emerald-800">
              Answer the ten items, then check your score out of{' '}
              {identificationItemCount}. This score is separate from the 20
              multiple-choice items.
            </div>

            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => onNavigate('identification')}
                className="btn-secondary w-full sm:w-auto"
              >
                <LibraryBig size={17} aria-hidden="true" />
                Open Identification
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Recent + tips */}
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <History size={19} className="text-brand-600" aria-hidden="true" />
              <h2 className="font-bold text-ink-900">Recent attempts</h2>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={onRequestClearHistory}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-ink-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 size={14} aria-hidden="true" />
                Clear saved results
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-5 py-9 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-white text-ink-500 shadow-sm">
                <History size={20} aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink-700">
                No saved attempts yet
              </p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-ink-500">
                Submit your first exam to see your score and review history here.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {history.slice(0, 4).map((item) => {
                const score = item.score
                if (!score || !item.submittedAt) return null
                return (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900">
                        {score.correct}/{score.total} correct
                        <span className="ml-2 font-normal text-ink-500">
                          ({score.percentage}%)
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {formatDate(item.submittedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewResult(item.id)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 text-xs font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      View results
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <Target size={19} className="text-brand-600" aria-hidden="true" />
            <h2 className="font-bold text-ink-900">Before you begin</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-600">
            <li className="flex gap-2.5">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              Answer all 20 multiple-choice items, then submit once.
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              You can change any answer before final submission.
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              Unanswered items are counted separately, never as correct.
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              Complete the 10 identification items and check your score
              separately.
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              Retaking preserves your saved attempt history.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
