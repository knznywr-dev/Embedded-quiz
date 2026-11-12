import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  Lightbulb,
} from 'lucide-react'
import { TOTAL_MCQ, questions } from '../data/questions'

interface StudyProps {
  onNavigate: (view: 'dashboard' | 'exam' | 'identification') => void
}

export function Study({ onNavigate }: StudyProps) {
  const [index, setIndex] = useState(0)
  const question = questions[index]
  const progress = Math.round(((index + 1) / TOTAL_MCQ) * 100)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return
      }
      if (event.key === 'ArrowLeft') {
        setIndex((current) => Math.max(0, current - 1))
      } else if (event.key === 'ArrowRight') {
        setIndex((current) => Math.min(TOTAL_MCQ - 1, current + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="animate-fade-up pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Study Mode • All 20 questions</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Review the Key Answers
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Browse every multiple-choice item with its correct answer and a
            short explanation. Study Mode never changes your exam attempt.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="btn-secondary"
          >
            <LayoutDashboard size={17} aria-hidden="true" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('exam')}
            className="btn-primary"
          >
            <ClipboardCheck size={17} aria-hidden="true" />
            Go to Exam
          </button>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <section className="card overflow-hidden" aria-live="polite">
          <div className="border-b border-ink-100 px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-sm font-extrabold text-brand-700">
                  {question.id}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Study card {index + 1} of {TOTAL_MCQ}
                  </p>
                  <p className="text-sm font-semibold text-ink-800">
                    Item {question.id}
                  </p>
                </div>
              </div>
              <span className="badge bg-brand-50 text-brand-700">
                <BookOpen size={13} aria-hidden="true" />
                Study Mode
              </span>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
              Question
            </p>
            <h2 className="mt-2 text-lg font-bold leading-8 tracking-tight text-ink-900 sm:text-xl">
              {question.question}
            </h2>

            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <CheckCircle2 size={15} aria-hidden="true" />
                Correct answer
              </p>
              <p className="mt-2 text-base font-semibold leading-7 text-emerald-950">
                {question.answer}
              </p>
            </div>

            <div className="mt-3 rounded-xl border border-ink-200 bg-ink-50/60 p-4 sm:p-5">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-500">
                <Lightbulb size={15} className="text-amber-500" aria-hidden="true" />
                Explanation
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                {question.explanation}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-ink-100 bg-ink-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
              disabled={index === 0}
              className="btn-secondary w-full sm:w-auto"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Previous
            </button>
            <span className="hidden text-xs text-ink-500 sm:block">
              Use ← → to browse
            </span>
            <button
              type="button"
              onClick={() =>
                setIndex((current) => Math.min(TOTAL_MCQ - 1, current + 1))
              }
              disabled={index === TOTAL_MCQ - 1}
              className="btn-primary w-full sm:w-auto"
            >
              Next
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </section>

        <aside className="card p-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink-900">Study progress</h2>
            <span className="text-xs font-semibold text-ink-500">
              {index + 1}/{TOTAL_MCQ}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-ink-500">{progress}% reviewed</p>

          <div className="mt-5">
            <p className="text-xs font-semibold text-ink-700">
              Jump to a question
            </p>
            <div className="mt-2.5 grid grid-cols-5 gap-1.5">
              {questions.map((item, itemIndex) => {
                const active = itemIndex === index
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`Study question ${item.id}`}
                    className={[
                      'flex aspect-square min-h-[40px] items-center justify-center rounded-lg border text-xs font-bold transition-all',
                      active
                        ? 'border-brand-600 bg-brand-600 text-white ring-2 ring-brand-300 ring-offset-2'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:bg-brand-50',
                    ].join(' ')}
                  >
                    {item.id}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/60 p-3.5">
            <p className="text-xs font-semibold text-brand-800">
              Ready to test yourself?
            </p>
            <p className="mt-1 text-[11px] leading-5 text-brand-700/80">
              Switch to Exam Mode whenever you are ready. This study session
              does not affect your score.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('exam')}
              className="btn-primary mt-3 w-full"
            >
              <ClipboardCheck size={16} aria-hidden="true" />
              Take the Exam
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
