import type { Asegurado, Compania, Poliza } from '../data/types'
import { fmtDate, relativeDays } from './format'

export const PLANTILLA_WHATSAPP =
  'Hola {asegurado}, te escribo por tu póliza {poliza} de {compania} ({ramo}): {estado}. Para no quedarte sin cobertura necesitamos regularizar el pago. Si ya lo hiciste, avisame y lo actualizo. Gracias.'

export const PLANTILLA_MAIL_ASUNTO = 'Tu póliza {poliza} requiere el pago'
export const PLANTILLA_MAIL =
  'Hola {asegurado},\n\nTu póliza {poliza} de {compania} ({ramo}) {estado}. Para no quedarte sin cobertura necesitamos regularizar el pago.\n\nSi ya lo hiciste, respondé este mail y actualizo tu situación.\n\nSaludos.'

export function armar(plantilla: string, p: Poliza, a?: Asegurado, c?: Compania) {
  return plantilla
    .replaceAll('{asegurado}', a?.nombre ?? 'asegurado')
    .replaceAll('{poliza}', p.numero)
    .replaceAll('{compania}', c?.nombre ?? 'la compañía')
    .replaceAll('{ramo}', p.ramo)
    .replaceAll('{vencimiento}', fmtDate(p.vencimiento))
    .replaceAll('{estado}', `${relativeDays(p.vencimiento)} (${fmtDate(p.vencimiento)})`)
}
