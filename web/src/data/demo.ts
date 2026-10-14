import type { Asegurado, Comision, Compania, Datos, Pago, Poliza, Ramo } from './types'
import { RAMOS } from './types'
import { addDays, today, toISO } from '../lib/format'

/**
 * DATOS INVENTADOS. Solo se usan en /test para ver cómo queda la interfaz.
 * Las compañías son ficticias a propósito: no se asocian datos falsos a marcas reales.
 */
const companias: Compania[] = [
  { id: 'alfa', nombre: 'Alfa Seguros', fuente: 'conectada', ultimaActualizacion: 'hace 2 horas' },
  { id: 'meridiano', nombre: 'Meridiano Cía. de Seguros', fuente: 'conectada', ultimaActualizacion: 'hace 2 horas' },
  { id: 'rioancho', nombre: 'Río Ancho Seguros', fuente: 'conectada', ultimaActualizacion: 'ayer' },
  { id: 'nuevacruz', nombre: 'Nueva Cruz', fuente: 'pdf', ultimaActualizacion: 'PDF cargado hace 5 días' },
  { id: 'cerroalto', nombre: 'Cerro Alto Seguros', fuente: 'pdf', ultimaActualizacion: 'PDF cargado hace 12 días' },
]

const asegurados: Asegurado[] = [
  ['marcos-ibanez', 'Marcos Ibáñez', '28.114.532', '11 5555-0101', 'marcos.ibanez@example.com'],
  ['lucia-ferreyra', 'Lucía Ferreyra', '31.902.771', '11 5555-0102', 'lucia.ferreyra@example.com'],
  ['carlos-sosa', 'Carlos Sosa', '20.455.318', '351 555-0103', 'carlos.sosa@example.com'],
  ['valeria-nunez', 'Valeria Núñez', '34.220.904', '341 555-0104', 'valeria.nunez@example.com'],
  ['panaderia-del-sur', 'Panadería del Sur S.R.L.', '30-71234567-8', '11 5555-0105', 'contacto@example.com'],
  ['diego-pereyra', 'Diego Pereyra', '26.778.045', '261 555-0106', 'diego.pereyra@example.com'],
  ['romina-acosta', 'Romina Acosta', '38.010.226', '11 5555-0107', 'romina.acosta@example.com'],
  ['gustavo-molina', 'Gustavo Molina', '22.309.671', '351 555-0108', 'gustavo.molina@example.com'],
  ['taller-ledesma', 'Taller Ledesma e Hijos', '30-70987654-3', '221 555-0109', 'taller@example.com'],
  ['sofia-benitez', 'Sofía Benítez', '36.540.188', '11 5555-0110', 'sofia.benitez@example.com'],
  ['andres-quiroga', 'Andrés Quiroga', '29.671.300', '299 555-0111', 'andres.quiroga@example.com'],
  ['natalia-rojas', 'Natalia Rojas', '33.118.492', '342 555-0112', 'natalia.rojas@example.com'],
].map(([id, nombre, documento, telefono, email]) => ({ id, nombre, documento, telefono, email }))

type Fila = [string, string, string, Ramo, string, number, number, Pago, number?]
// numero, compañía, asegurado, ramo, referencia, días al vencimiento, premio, pago, días desde último aviso
const filas: Fila[] = [
  ['AU-48211', 'alfa', 'marcos-ibanez', 'Automotor', 'AB 123 CD', -9, 684_000, 'impaga', 3],
  ['AU-48377', 'meridiano', 'lucia-ferreyra', 'Automotor', 'AF 456 GH', -4, 512_000, 'impaga'],
  ['HO-11902', 'rioancho', 'carlos-sosa', 'Hogar', 'Av. Colón 1450, Córdoba', -2, 148_000, 'sin-dato'],
  ['AU-48502', 'alfa', 'valeria-nunez', 'Automotor', 'AC 789 EF', -15, 731_000, 'impaga', 8],
  ['CO-20418', 'meridiano', 'panaderia-del-sur', 'Comercio', 'Panadería, Pasaje Belgrano 220', -1, 396_000, 'impaga'],
  ['AU-48611', 'rioancho', 'diego-pereyra', 'Automotor', 'ABC 321', -6, 455_000, 'pagada'],
  ['VI-30055', 'nuevacruz', 'romina-acosta', 'Vida', 'Vida individual', 3, 186_000, 'impaga'],
  ['AU-48730', 'alfa', 'gustavo-molina', 'Automotor', 'AD 654 IJ', 5, 598_000, 'impaga'],
  ['AP-70114', 'cerroalto', 'sofia-benitez', 'AP', 'Accidentes personales', 8, 64_000, 'impaga'],
  ['HO-12044', 'meridiano', 'natalia-rojas', 'Hogar', 'Bv. Oroño 980, Rosario', 12, 172_000, 'impaga'],
  ['AR-90231', 'rioancho', 'taller-ledesma', 'ART', 'Nómina de 6 empleados', 14, 412_000, 'impaga'],
  ['AU-48902', 'meridiano', 'andres-quiroga', 'Automotor', 'AG 112 KL', 21, 624_000, 'pagada'],
  ['CO-20533', 'alfa', 'taller-ledesma', 'Comercio', 'Taller, Calle 7 N° 1840, La Plata', 26, 508_000, 'impaga'],
  ['AU-49010', 'cerroalto', 'lucia-ferreyra', 'Automotor', 'XYZ 987', 40, 340_000, 'pagada'],
  ['VI-30112', 'alfa', 'marcos-ibanez', 'Vida', 'Vida individual', 55, 204_000, 'pagada'],
  ['HO-12190', 'nuevacruz', 'carlos-sosa', 'Hogar', 'Los Álamos 33, Villa Allende', 70, 133_000, 'pagada'],
  ['AU-49177', 'rioancho', 'romina-acosta', 'Automotor', 'AH 305 MN', 82, 561_000, 'pagada'],
  ['AP-70166', 'meridiano', 'gustavo-molina', 'AP', 'Accidentes personales', 96, 71_000, 'pagada'],
  ['AR-90310', 'alfa', 'panaderia-del-sur', 'ART', 'Nómina de 4 empleados', 110, 389_000, 'pagada'],
  ['AU-49244', 'meridiano', 'sofia-benitez', 'Automotor', 'AJ 778 OP', 130, 702_000, 'pagada'],
  ['CO-20640', 'rioancho', 'panaderia-del-sur', 'Comercio', 'Local, Pasaje Belgrano 220', 150, 441_000, 'pagada'],
  ['HO-12301', 'alfa', 'valeria-nunez', 'Hogar', 'San Lorenzo 2210, Rosario', 175, 156_000, 'pagada'],
]

const hoy = today()
const polizas: Poliza[] = filas.map(([numero, companiaId, aseguradoId, ramo, referencia, dias, premio, pago, aviso]) => ({
  id: numero,
  numero,
  companiaId,
  aseguradoId,
  ramo,
  referencia,
  vencimiento: toISO(addDays(hoy, dias)),
  premio,
  pago,
  ultimoAviso: aviso === undefined ? undefined : toISO(addDays(hoy, -aviso)),
}))

const pct: Record<string, number[]> = {
  //            Auto, ART, AP, Hogar, Vida, Comercio
  alfa: [15, 9, 20, 20, 28, 17],
  meridiano: [14, 10, 22, 19, 26, 16],
  rioancho: [16, 8, 18, 21, 30, 18],
  nuevacruz: [13, 11, 20, 18, 25, 15],
  cerroalto: [15, 9, 19, 20, 27, 16],
}
const comisiones: Comision[] = companias.flatMap((c) =>
  RAMOS.map((ramo, i) => ({ companiaId: c.id, ramo, porcentaje: pct[c.id][i] })),
)

export const datosDemo: Datos = { modo: 'demo', companias, asegurados, polizas, comisiones }
