import type { ReactNode } from 'react'

export function EmptyState({ icon, title, children, actions }: { icon: ReactNode; title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon" aria-hidden>{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
      {actions && <div className="empty-actions">{actions}</div>}
    </div>
  )
}
