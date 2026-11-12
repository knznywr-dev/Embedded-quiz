export interface IdentificationProgress {
  answers: Record<string, string>
  checked: boolean
}

const STORAGE_KEY = 'embedded-reviewer:identification:v1'

const EMPTY_PROGRESS: IdentificationProgress = {
  answers: {},
  checked: false,
}

export function loadIdentificationProgress(): IdentificationProgress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return EMPTY_PROGRESS

    const candidate = parsed as Partial<IdentificationProgress>
    const answers: Record<string, string> = {}
    if (candidate.answers && typeof candidate.answers === 'object') {
      Object.entries(candidate.answers).forEach(([key, value]) => {
        if (typeof value === 'string') answers[key] = value
      })
    }

    return {
      answers,
      checked: candidate.checked === true,
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveIdentificationProgress(
  progress: IdentificationProgress,
): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // The section still works for the current session if storage is blocked.
  }
}

export function clearIdentificationProgress(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}
