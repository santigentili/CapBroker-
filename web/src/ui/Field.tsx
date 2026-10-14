import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface Common { label: string; hint?: string; className?: string }

export function TextField({ label, hint, className = '', ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="input" aria-describedby={hint ? `${id}-h` : undefined} {...rest} />
      {hint && <span id={`${id}-h`} className="field-hint">{hint}</span>}
    </div>
  )
}

export function SelectField({ label, hint, className = '', children, ...rest }: Common & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" aria-describedby={hint ? `${id}-h` : undefined} {...rest}>{children}</select>
      {hint && <span id={`${id}-h`} className="field-hint">{hint}</span>}
    </div>
  )
}

export function TextArea({ label, hint, className = '', ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} className="textarea" aria-describedby={hint ? `${id}-h` : undefined} {...rest} />
      {hint && <span id={`${id}-h`} className="field-hint">{hint}</span>}
    </div>
  )
}

export function Check({ label, className = '', ...rest }: { label: ReactNode; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`check ${className}`}>
      <input type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  )
}
