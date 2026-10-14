import type { ReactNode } from 'react'

export interface Opt<T extends string> { value: T; label: string; icon?: ReactNode }

export function Segmented<T extends string>({ options, value, onChange, label }: { options: Opt<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
