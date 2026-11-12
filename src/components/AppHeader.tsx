import {
  BookOpen,
  ClipboardCheck,
  Cpu,
  LayoutDashboard,
  LibraryBig,
  type LucideIcon,
} from 'lucide-react'
import type { View } from '../types'

interface AppHeaderProps {
  view: View
  onNavigate: (view: View) => void
}

interface NavItem {
  id: View
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'exam', label: 'Exam', icon: ClipboardCheck },
  { id: 'study', label: 'Study', icon: BookOpen },
  { id: 'identification', label: 'Word Bank', icon: LibraryBig },
]

function isActive(view: View, item: View): boolean {
  if (item === 'exam') return view === 'exam' || view === 'results'
  return view === item
}

export function AppHeader({ view, onNavigate }: AppHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex min-w-0 items-center gap-2.5 rounded-xl py-1 text-left"
          aria-label="Embedded Systems Exam Reviewer — go to dashboard"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Cpu size={21} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="block truncate text-sm font-bold leading-tight text-ink-900">
              Embedded Reviewer
            </span>
            <span className="block text-[11px] font-medium leading-tight text-ink-500">
              Exam preparation
            </span>
          </span>
        </button>

        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = isActive(view, id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                className={[
                  'inline-flex min-h-[42px] items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors sm:px-3.5',
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900',
                ].join(' ')}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                <span className="hidden lg:inline">{label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
