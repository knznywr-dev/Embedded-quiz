import type { CSSProperties } from 'react'

interface ScoreRingProps {
  percentage: number
  size?: number
  label?: string
  tone?: 'brand' | 'green' | 'amber'
}

const toneClasses = {
  brand: 'text-brand-600',
  green: 'text-emerald-600',
  amber: 'text-amber-500',
}

export function ScoreRing({
  percentage,
  size = 148,
  label = 'Score',
  tone = 'brand',
}: ScoreRingProps) {
  const safePercentage = Math.max(0, Math.min(100, Math.round(percentage)))
  const stroke = 9
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safePercentage / 100) * circumference

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${safePercentage} percent`}
    >
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          style={
            {
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              '--ring-circumference': circumference,
              '--ring-offset': offset,
            } as CSSProperties
          }
          className={`${toneClasses[tone]} ring-progress transition-[stroke-dashoffset] duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-ink-900">
          {safePercentage}%
        </span>
        <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          {label}
        </span>
      </div>
    </div>
  )
}
