import { CONDITION_STYLES, type Condition } from './data'

export default function ConditionBadge({
  condition, size = 'sm',
}: { condition: Condition; size?: 'sm' | 'md' }) {
  const s = CONDITION_STYLES[condition] ?? CONDITION_STYLES.Good
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-[0.08em] whitespace-nowrap ${
        size === 'md' ? 'px-3 py-1 text-[0.66rem]' : 'px-2.5 py-[0.2rem] text-[0.58rem]'
      }`}
      style={{
        color: s.fg,
        background: s.bg,
        boxShadow: s.glow ? '0 0 14px rgba(212,168,67,0.45)' : undefined,
        border: s.glow ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {condition}
    </span>
  )
}
