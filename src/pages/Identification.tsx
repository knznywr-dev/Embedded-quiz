import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Info,
  LibraryBig,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react'
import {
  identificationDirections,
  identificationHeading,
  identificationItemCount,
  identificationItems,
  isIdentificationConfigured,
  wordBank,
} from '../data/identification'
import { scoreIdentification } from '../lib/scoring'
import {
  loadIdentificationProgress,
  saveIdentificationProgress,
  type IdentificationProgress,
} from '../lib/identificationProgress'

interface IdentificationProps {
  onNavigate: (view: 'dashboard' | 'exam' | 'study') => void
}

export function Identification({ onNavigate }: IdentificationProps) {
  const [progress, setProgress] = useState<IdentificationProgress>(() =>
    loadIdentificationProgress(),
  )
  const answers = progress.answers
  const checked = progress.checked
  const score = checked ? scoreIdentification(answers) : null
  const firstId = identificationItems[0]?.id ?? 21
  const lastId = identificationItems[identificationItems.length - 1]?.id ?? 30

  useEffect(() => {
    saveIdentificationProgress(progress)
  }, [progress])

  function updateAnswer(id: number, value: string) {
    setProgress((current) => ({
      answers: { ...current.answers, [String(id)]: value },
      checked: false,
    }))
  }

  function resetAnswers() {
    setProgress({ answers: {}, checked: false })
  }

  return (
    <div className="animate-fade-up space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            Section B • Items {firstId}–{lastId}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Identification with Word Bank
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Choose the correct term from the 10-term Word Bank for each of the
            ten descriptions. Use each term only once. This section is scored
            separately out of {identificationItemCount}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="btn-secondary"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('study')}
            className="btn-primary"
          >
            <BookOpen size={17} aria-hidden="true" />
            Study MCQs
          </button>
        </div>
      </div>

      {/* Section status */}
      <section
        className={[
          'rounded-2xl border p-5 sm:p-6',
          isIdentificationConfigured
            ? 'border-emerald-200 bg-emerald-50/70'
            : 'border-amber-200 bg-amber-50/70',
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              'flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm',
              isIdentificationConfigured ? 'text-emerald-600' : 'text-amber-600',
            ].join(' ')}
          >
            {isIdentificationConfigured ? (
              <CheckCircle2 size={21} aria-hidden="true" />
            ) : (
              <ShieldAlert size={21} aria-hidden="true" />
            )}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-ink-900">
                {isIdentificationConfigured
                  ? 'Section complete and scoreable'
                  : 'Section data incomplete'}
              </h2>
              <span
                className={[
                  'badge',
                  isIdentificationConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800',
                ].join(' ')}
              >
                {isIdentificationConfigured
                  ? `Scoreable out of ${identificationItemCount}`
                  : 'Excluded from score'}
              </span>
            </div>
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-ink-700">
              {isIdentificationConfigured
                ? `All ten descriptions and verified answer keys are ready. Answer below, then check your score out of ${identificationItemCount}. This score is separate from the 20 multiple-choice items.`
                : 'Add a description and verified answer for every identification item to enable scoring. The section remains excluded from the multiple-choice result until it is complete.'}
            </p>
            <p className="mt-2 text-xs leading-5 text-ink-600">
              {isIdentificationConfigured
                ? 'Each Word Bank term is used exactly once. Your answers are saved in this browser.'
                : 'No partial score is shown for an incomplete section.'}
            </p>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        {/* Questions + directions */}
        <section className="card overflow-hidden">
          <div className="border-b border-ink-100 px-5 py-5 sm:px-7">
            <h2 className="text-base font-bold leading-7 text-ink-900 sm:text-lg">
              {identificationHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              <span className="font-semibold text-ink-800">Directions:</span>{' '}
              {identificationDirections}
            </p>
          </div>

          <ol className="divide-y divide-ink-100">
            {identificationItems.map((item) => {
              const review = score?.review.find(
                (entry) => entry.questionId === item.id,
              )
              const inputId = `identification-answer-${item.id}`
              const feedbackId = `identification-feedback-${item.id}`
              return (
                <li key={item.id} className="px-5 py-5 sm:px-7 sm:py-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-xs font-bold text-ink-700">
                      {item.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      {item.description ? (
                        <p className="text-sm font-medium leading-6 text-ink-800">
                          {item.description}
                        </p>
                      ) : (
                        <p className="text-sm italic leading-6 text-ink-500">
                          Description not supplied in the source material.
                        </p>
                      )}

                      <div className="mt-3">
                        <label
                          htmlFor={inputId}
                          className="text-[11px] font-bold uppercase tracking-wider text-ink-500"
                        >
                          Answer for item {item.id}
                        </label>
                        {isIdentificationConfigured ? (
                          <>
                            <input
                              id={inputId}
                              type="text"
                              list="word-bank-terms"
                              value={answers[String(item.id)] ?? ''}
                              onChange={(event) =>
                                updateAnswer(item.id, event.target.value)
                              }
                              placeholder="Type a term from the Word Bank"
                              autoComplete="off"
                              spellCheck={false}
                              aria-invalid={review?.status === 'incorrect'}
                              aria-describedby={review ? feedbackId : undefined}
                              className="blank-input mt-1.5"
                            />
                            {review && (
                              <p
                                id={feedbackId}
                                className={[
                                  'mt-2 rounded-lg px-3 py-2 text-xs font-medium leading-5',
                                  review.status === 'correct'
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : review.status === 'incorrect'
                                      ? 'bg-rose-50 text-rose-800'
                                      : 'bg-ink-100 text-ink-600',
                                ].join(' ')}
                              >
                                {review.status === 'correct'
                                  ? `Correct — ${item.acceptedAnswers[0]}`
                                  : review.status === 'incorrect'
                                    ? `Incorrect — correct answer: ${item.acceptedAnswers[0]}`
                                    : 'Unanswered'}
                              </p>
                            )}
                            {review && item.explanation && (
                              <p className="mt-2 text-xs leading-5 text-ink-500">
                                {item.explanation}
                              </p>
                            )}
                          </>
                        ) : (
                          <input
                            id={inputId}
                            type="text"
                            disabled
                            placeholder="Blank"
                            aria-label={`Answer blank for item ${item.id} — section not configured`}
                            className="blank-input mt-1.5"
                          />
                        )}
                      </div>

                      {!isIdentificationConfigured && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                          <Info size={13} aria-hidden="true" />
                          Awaiting a verified description and answer key
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="flex flex-col gap-3 border-t border-ink-100 bg-ink-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs leading-5 text-ink-500" aria-live="polite">
              {score
                ? `You scored ${score.correct}/${score.total} (${score.percentage}%). ${score.incorrect} incorrect, ${score.unanswered} unanswered.`
                : isIdentificationConfigured
                  ? 'Answers are checked against the verified key.'
                  : 'This section is not included in the multiple-choice result.'}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {isIdentificationConfigured ? (
                <>
                  <button
                    type="button"
                    onClick={resetAnswers}
                    className="btn-secondary"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProgress((current) => ({
                        ...current,
                        checked: true,
                      }))
                    }
                    className="btn-primary"
                  >
                    <ClipboardCheck size={17} aria-hidden="true" />
                    {checked ? 'Check Again' : 'Check Answers'}
                  </button>
                </>
              ) : (
                <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 text-xs font-semibold text-ink-500">
                  <Info size={15} aria-hidden="true" />
                  Check Answers unlocks after setup
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Word bank */}
        <aside className="order-first space-y-4 lg:order-last lg:sticky lg:top-20">
          <div className="card p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <LibraryBig size={19} aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow">Reference</p>
                <h2 className="text-sm font-bold text-ink-900">Word Bank</h2>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-ink-500">
              Ten terms. Use each term exactly once.
            </p>

            <ol className="mt-4 grid grid-flow-col grid-cols-2 grid-rows-5 gap-x-3 gap-y-2.5">
              {wordBank.map((term, index) => (
                <li key={term} className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-brand-50 text-[10px] font-bold text-brand-700">
                    {index + 1}
                  </span>
                  <span className="min-w-0 text-xs font-medium leading-5 text-ink-800 sm:text-[13px]">
                    {term}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50/60 px-3 py-2.5 text-[11px] leading-5 text-ink-500">
              All 10 terms are used exactly once in Items {firstId}–{lastId}.
            </div>
          </div>

          {score && (
            <div className="card p-5">
              <p className="eyebrow">Identification score</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  data-testid="identification-score"
                  className="text-3xl font-extrabold text-ink-900"
                >
                  {score.correct}
                </span>
                <span className="text-sm font-semibold text-ink-500">
                  / {score.total}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className={[
                    'h-full rounded-full transition-all duration-500',
                    score.percentage >= 75 ? 'bg-emerald-500' : 'bg-brand-600',
                  ].join(' ')}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-500">
                {score.percentage}% • {score.incorrect} incorrect •{' '}
                {score.unanswered} unanswered
              </p>
              <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-[11px] leading-5 text-brand-800">
                This section is scored separately from the 20 multiple-choice
                items.
              </p>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                <Info size={18} aria-hidden="true" />
              </span>
              <h2 className="text-sm font-bold text-ink-900">
                How scoring works
              </h2>
            </div>
            <ul className="mt-3 space-y-2.5 text-[11px] leading-5 text-ink-600">
              <li>Write one Word Bank term in each answer blank.</li>
              <li>
                Answers are case-insensitive, but spelling must match the
                selected term.
              </li>
              <li>
                Select <span className="font-semibold">Check Answers</span> to
                see your score, corrections, and explanations.
              </li>
              <li>Unanswered items are counted separately, never as correct.</li>
            </ul>
          </div>
        </aside>
      </div>

      <datalist id="word-bank-terms">
        {wordBank.map((term) => (
          <option key={term} value={term} />
        ))}
      </datalist>
    </div>
  )
}
