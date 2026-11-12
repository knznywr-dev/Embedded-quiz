interface ProgressBarProps {
  value: number
  className?: string
  barClassName?: string
  label?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({
  value,
  className = '',
  barClassName = 'bg-brand-600',
  label,
  size = 'md',
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)))

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      aria-label={label}
      className={[
        'relative overflow-hidden rounded-full bg-ink-100',
        size === 'sm' ? 'h-1.5' : 'h-2',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'relative h-full rounded-full transition-[width] duration-700 ease-out',
          barClassName,
        ].join(' ')}
        style={{ width: `${safeValue}%` }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
      </div>
    </div>
  )
}
