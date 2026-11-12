import { Cpu } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="no-print mt-auto border-t border-ink-200/70 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <Cpu size={15} aria-hidden="true" />
          Embedded Systems Exam Reviewer
        </p>
        <p className="text-ink-500">
          Progress is saved locally in this browser. No account required.
        </p>
      </div>
    </footer>
  )
}
