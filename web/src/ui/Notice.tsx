import type { ReactNode } from 'react'
import { Info, TriangleAlert, CircleCheck } from 'lucide-react'

export function Notice({ tone = 'neutral', children }: { tone?: 'neutral' | 'warn' | 'bad' | 'ok'; children: ReactNode }) {
  const Icon = tone === 'warn' || tone === 'bad' ? TriangleAlert : tone === 'ok' ? CircleCheck : Info
  return (
    <div className={`notice ${tone === 'neutral' ? '' : `notice-${tone}`}`}>
      <Icon size={18} aria-hidden />
      <div>{children}</div>
    </div>
  )
}
