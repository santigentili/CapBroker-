export const RAMOS = ['Automotor', 'ART', 'AP', 'Hogar', 'Vida', 'Comercio'] as const
export type Ramo = (typeof RAMOS)[number]

/** conectada: se lee desde la cuenta del productor. pdf: se cargan PDF a mano. */
export type Fuente = 'conectada' | 'pdf'

export interface Compania {
  id: string
  nombre: string
  fuente: Fuente
  ultimaActualizacion: string
}

export interface Asegurado {
  id: string
  nombre: string
  documento: string
  telefono: string
  email: string
}

export type Pago = 'pagada' | 'impaga' | 'sin-dato'

export interface Poliza {
  id: string
  numero: string
  companiaId: string
  aseguradoId: string
  ramo: Ramo
  /** Patente, domicilio u otra referencia del riesgo asegurado. */
  referencia: string
  /** AAAA-MM-DD */
  vencimiento: string
  premio: number
  pago: Pago
  ultimoAviso?: string
}

export interface Comision {
  companiaId: string
  ramo: Ramo
  porcentaje: number
}

export interface Datos {
  modo: 'real' | 'demo'
  companias: Compania[]
  asegurados: Asegurado[]
  polizas: Poliza[]
  comisiones: Comision[]
}
