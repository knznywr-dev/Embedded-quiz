import { useEffect, useState } from 'react'
import { AppFooter } from './components/AppFooter'
import { AppHeader } from './components/AppHeader'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Dashboard } from './pages/Dashboard'
import { Exam } from './pages/Exam'
import { Identification } from './pages/Identification'
import { Results } from './pages/Results'
import { Study } from './pages/Study'
import {
  createAttempt,
  loadAttempt,
  loadHistory,
  saveAttempt,
  saveHistory,
  type ExamAttempt,
} from './lib/attempt'
import { scoreMultipleChoice } from './lib/scoring'
import type { View } from './types'

export default function App() {
  const [attempt, setAttempt] = useState<ExamAttempt | null>(() =>
    loadAttempt(),
  )
  const [history, setHistory] = useState<ExamAttempt[]>(() => loadHistory())
  const [view, setView] = useState<View>('dashboard')
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)

  useEffect(() => {
    saveAttempt(attempt)
  }, [attempt])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  function openExam() {
    if (attempt && !attempt.submittedAt) {
      setView('exam')
      return
    }
    const fresh = createAttempt()
    setAttempt(fresh)
    setReviewAttemptId(null)
    setView('exam')
  }

  function handleNavigate(nextView: View) {
    if (nextView === 'exam') {
      openExam()
      return
    }
    if (nextView === 'results') {
      setView('results')
      return
    }
    setView(nextView)
  }

  function handleSelectAnswer(questionId: number, answer: string) {
    setAttempt((current) => {
      if (!current || current.submittedAt) return current
      return {
        ...current,
        answers: { ...current.answers, [String(questionId)]: answer },
      }
    })
  }

  function handleSetCurrentIndex(index: number) {
    setAttempt((current) => {
      if (!current || current.submittedAt) return current
      return { ...current, currentIndex: index }
    })
  }

  function handleSubmit() {
    if (!attempt || attempt.submittedAt) return
    const score = scoreMultipleChoice(attempt.answers)
    const submitted: ExamAttempt = {
      ...attempt,
      submittedAt: new Date().toISOString(),
      score,
    }
    setAttempt(submitted)
    setHistory((previous) => [
      submitted,
      ...previous.filter((item) => item.id !== submitted.id),
    ])
    setReviewAttemptId(submitted.id)
    setView('results')
  }

  function handleRetake() {
    const fresh = createAttempt()
    setAttempt(fresh)
    setReviewAttemptId(null)
    setView('exam')
  }

  function handleViewResult(attemptId: string) {
    setReviewAttemptId(attemptId)
    setView('results')
  }

  function handleConfirmClearHistory() {
    setHistory([])
    saveHistory([])
    if (attempt?.submittedAt) {
      setAttempt(null)
      saveAttempt(null)
    }
    setReviewAttemptId(null)
    setShowClearDialog(false)
    setView('dashboard')
  }

  let displayedResult: ExamAttempt | null = null
  if (reviewAttemptId) {
    displayedResult =
      history.find((item) => item.id === reviewAttemptId) ??
      (attempt?.id === reviewAttemptId ? attempt : null)
  }
  if (!displayedResult) {
    displayedResult =
      attempt?.submittedAt && attempt.score
        ? attempt
        : (history[0] ?? null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader view={view} onNavigate={handleNavigate} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {view === 'dashboard' && (
          <Dashboard
            attempt={attempt}
            history={history}
            onStartExam={openExam}
            onNavigate={handleNavigate}
            onViewResult={handleViewResult}
            onRequestClearHistory={() => setShowClearDialog(true)}
          />
        )}

        {view === 'exam' &&
          (attempt && !attempt.submittedAt ? (
            <Exam
              attempt={attempt}
              onSelectAnswer={handleSelectAnswer}
              onSetCurrentIndex={handleSetCurrentIndex}
              onSubmit={handleSubmit}
              onExit={() => setView('dashboard')}
            />
          ) : (
            <div className="py-12">
              <div className="card mx-auto max-w-lg p-8 text-center">
                <h1 className="text-xl font-bold text-ink-900">
                  No active examination
                </h1>
                <p className="mt-2 text-sm leading-6 text-ink-500">
                  Start a new attempt to answer the 20 multiple-choice items.
                </p>
                <button
                  type="button"
                  onClick={openExam}
                  className="btn-primary mt-6"
                >
                  Start Exam
                </button>
              </div>
            </div>
          ))}

        {view === 'study' && (
          <Study
            onNavigate={(target) => {
              if (target === 'exam') {
                openExam()
              } else {
                handleNavigate(target)
              }
            }}
          />
        )}

        {view === 'identification' && (
          <Identification
            onNavigate={(target) => {
              if (target === 'exam') {
                openExam()
              } else {
                handleNavigate(target)
              }
            }}
          />
        )}

        {view === 'results' && (
          <Results
            attempt={displayedResult}
            onRetake={handleRetake}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <AppFooter />

      <ConfirmDialog
        open={showClearDialog}
        title="Clear all saved results?"
        description="This permanently removes every saved attempt result from this browser. Your current multiple-choice score history cannot be recovered. This action cannot be undone."
        confirmLabel="Clear Saved Results"
        cancelLabel="Keep Results"
        tone="danger"
        onConfirm={handleConfirmClearHistory}
        onCancel={() => setShowClearDialog(false)}
      >
        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-800">
          {history.length} saved{' '}
          {history.length === 1 ? 'result will' : 'results will'} be deleted.
        </div>
      </ConfirmDialog>
    </div>
  )
}
