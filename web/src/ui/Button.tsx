import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'secondary' | 'primary' | 'quiet' | 'danger'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant
  size?: 'md' | 'sm'
  icon?: ReactNode
  loading?: boolean
  to?: string
  /** Botón solo con ícono: exige etiqueta accesible. */
  label?: string
  children?: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', icon, loading, to, label, children, className = '', type = 'button', disabled, ...rest }: Props) {
  const only = !children
  const cls = ['btn', variant !== 'secondary' && `btn-${variant}`, size === 'sm' && 'btn-sm', only && 'btn-icon', className].filter(Boolean).join(' ')
  const inner = (
    <>
      {icon}
      {children}
    </>
  )
  if (to && !disabled) {
    return (
      <Link to={to} className={cls} aria-label={label}>
        {inner}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} disabled={disabled || loading} data-loading={loading || undefined} aria-label={label} {...rest}>
      {inner}
    </button>
  )
}
