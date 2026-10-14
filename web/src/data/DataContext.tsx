import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Asegurado, Compania, Datos, Poliza } from './types'
import { daysUntil } from '../lib/format'

export type EstadoPoliza = 'vencida' | 'por-vencer' | 'vigente'

/** Vencida = pasó la fecha y no figura pagada. Pagada tras vencer = renovada. */
export function estadoDe(p: Poliza): EstadoPoliza {
  const d = daysUntil(p.vencimiento)
  if (d < 0) return p.pago === 'pagada' ? 'vigente' : 'vencida'
  if (d <= 30) return 'por-vencer'
  return 'vigente'
}

interface Ctx {
  datos: Datos
  /** Prefijo de rutas: '' en la versión principal, '/test' en la de ejemplo. */
  base: string
  esDemo: boolean
  asegurado: (id: string) => Asegurado | undefined
  compania: (id: string) => Compania | undefined
}

const DataCtx = createContext<Ctx | null>(null)

export function DataProvider({ datos, base, children }: { datos: Datos; base: string; children: ReactNode }) {
  const value = useMemo<Ctx>(() => {
    const aseg = new Map(datos.asegurados.map((a) => [a.id, a]))
    const cias = new Map(datos.companias.map((c) => [c.id, c]))
    return { datos, base, esDemo: datos.modo === 'demo', asegurado: (id) => aseg.get(id), compania: (id) => cias.get(id) }
  }, [datos, base])
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}

export function useDatos() {
  const v = useContext(DataCtx)
  if (!v) throw new Error('useDatos fuera de DataProvider')
  return v
}

/** Arma una ruta interna respetando la versión (principal o /test). */
export function useRuta() {
  const { base } = useDatos()
  return (path = '') => `${base}${path}` || '/'
}
