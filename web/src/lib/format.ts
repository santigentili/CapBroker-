const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const fecha = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
const fechaLarga = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

export const money = (n: number) => ars.format(n)

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() + n)
  return x
}

export const today = () => {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

export const fmtDate = (iso: string) => fecha.format(parseISO(iso)).replace('.', '')
export const fmtToday = () => {
  const s = fechaLarga.format(new Date())
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Días hasta el vencimiento. Negativo = ya venció. */
export function daysUntil(iso: string): number {
  return Math.round((parseISO(iso).getTime() - today().getTime()) / 86_400_000)
}

export function relativeDays(iso: string): string {
  const d = daysUntil(iso)
  if (d === 0) return 'vence hoy'
  if (d === 1) return 'vence mañana'
  if (d > 1) return `vence en ${d} días`
  if (d === -1) return 'venció ayer'
  return `venció hace ${Math.abs(d)} días`
}

/** Normaliza para buscar sin tildes ni mayúsculas ni espacios. */
export const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[\s.-]+/g, '')

export const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios)
