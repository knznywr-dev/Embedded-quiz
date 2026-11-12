import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'brand' | 'danger'
  children?: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'brand',
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 20)

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (active === last || !dialogRef.current.contains(active))
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onCancel])

  if (!open) return null

  const Icon = tone === 'danger' ? Trash2 : AlertTriangle
  const iconClasses =
    tone === 'danger'
      ? 'bg-rose-50 text-rose-600'
      : 'bg-amber-50 text-amber-600'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md animate-scale-in rounded-2xl border border-ink-200 bg-white p-5 shadow-lifted sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}>
            <Icon size={22} aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="-mr-1 -mt-1 flex size-10 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
            aria-label="Close dialog"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <h2
          id={titleId}
          className="mt-4 text-lg font-bold tracking-tight text-ink-900"
        >
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm leading-6 text-ink-600">
          {description}
        </p>
        {children}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="btn-secondary w-full sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${tone === 'danger' ? 'btn-danger' : 'btn-primary'} w-full sm:w-auto`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
