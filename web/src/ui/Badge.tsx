import type { ReactNode } from 'react'
import { CircleCheck, Clock, TriangleAlert, Minus } from 'lucide-react'
import type { EstadoPoliza } from '../data/DataContext'
import type { Pago } from '../data/types'

export function Badge({ tone = 'neutral', icon, children }: { tone?: 'neutral' | 'ok' | 'warn' | 'bad'; icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={`badge ${tone === 'neutral' ? '' : `badge-${tone}`}`}>
      {icon}
      {children}
    </span>
  )
}

/** El estado nunca depende solo del color: lleva ícono y texto. */
export function EstadoBadge({ estado }: { estado: EstadoPoliza }) {
  if (estado === 'vencida') return <Badge tone="bad" icon={<TriangleAlert size={13} aria-hidden />}>Vencida</Badge>
  if (estado === 'por-vencer') return <Badge tone="warn" icon={<Clock size={13} aria-hidden />}>Por vencer</Badge>
  return <Badge tone="ok" icon={<CircleCheck size={13} aria-hidden />}>Vigente</Badge>
}

export function PagoBadge({ pago }: { pago: Pago }) {
  if (pago === 'pagada') return <Badge tone="ok" icon={<CircleCheck size={13} aria-hidden />}>Pagada</Badge>
  if (pago === 'impaga') return <Badge tone="bad" icon={<TriangleAlert size={13} aria-hidden />}>Sin pagar</Badge>
  return <Badge icon={<Minus size={13} aria-hidden />}>Sin dato</Badge>
}
