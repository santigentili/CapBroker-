import { useMemo, useState } from 'react'
import { BellRing, Check } from 'lucide-react'
import { estadoDe, useDatos } from '../data/DataContext'
import type { Poliza } from '../data/types'
import { fmtDate, plural, relativeDays, toISO, today } from '../lib/format'
import { Button } from '../ui/Button'
import { PagoBadge } from '../ui/Badge'
import { Check as CheckBox } from '../ui/Field'
import { EmptyState } from '../ui/EmptyState'
import { PageHeader } from '../ui/PageHeader'
import { Tabs } from '../ui/Tabs'
import { useToast } from '../ui/Toast'
import { AvisoPanel, SinCartera } from './shared'
import type { Canal } from './shared'

type Vista = 'vencidas' | 'por-vencer'
const NOMBRE_CANAL: Record<Canal, string> = { whatsapp: 'WhatsApp', mail: 'mail', ambos: 'WhatsApp y mail' }

export default function Vencimientos() {
  const { datos, asegurado, compania } = useDatos()
  const toast = useToast()
  const [vista, setVista] = useState<Vista>('vencidas')
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set())
  const [avisando, setAvisando] = useState<string[] | null>(null)
  const [avisos, setAvisos] = useState<Record<string, string>>({})

  const porOrden = (a: Poliza, b: Poliza) => a.vencimiento.localeCompare(b.vencimiento)
  const vencidas = useMemo(() => datos.polizas.filter((p) => estadoDe(p) === 'vencida').sort(porOrden), [datos.polizas])
  const porVencer = useMemo(() => datos.polizas.filter((p) => estadoDe(p) === 'por-vencer').sort(porOrden), [datos.polizas])
  const lista = vista === 'vencidas' ? vencidas : porVencer
  const visibles = new Set(lista.map((p) => p.id))
  const marcadasVisibles = [...marcadas].filter((id) => visibles.has(id))
  const todas = lista.length > 0 && marcadasVisibles.length === lista.length

  const cambiarVista = (v: string) => { setVista(v as Vista); setMarcadas(new Set()); setAvisando(null) }
  const alternar = (id: string) => setMarcadas((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const alternarTodas = () => setMarcadas(todas ? new Set() : new Set(lista.map((p) => p.id)))

  const polizasAvisando = (avisando ?? []).map((id) => datos.polizas.find((p) => p.id === id)).filter((p): p is Poliza => !!p)

  const enviado = (canal: Canal) => {
    const hoy = toISO(today())
    setAvisos((a) => ({ ...a, ...Object.fromEntries(polizasAvisando.map((p) => [p.id, hoy])) }))
    toast(`Simulación: no se envió ningún mensaje real. Habría salido por ${NOMBRE_CANAL[canal]} a ${polizasAvisando.length} ${plural(polizasAvisando.length, 'asegurado', 'asegurados')}.`)
    setAvisando(null)
    setMarcadas(new Set())
  }

  return (
    <>
      <PageHeader
        title="Vencimientos"
        actions={
          marcadasVisibles.length > 0 && (
            <Button variant="primary" icon={<BellRing size={17} aria-hidden />} onClick={() => setAvisando(marcadasVisibles)}>
              Avisar a {marcadasVisibles.length} {plural(marcadasVisibles.length, 'seleccionada', 'seleccionadas')}
            </Button>
          )
        }
      >
        Pólizas que pasaron su fecha sin figurar pagas, y las que vencen en los próximos 30 días.
      </PageHeader>

      {datos.polizas.length === 0 ? (
        <section className="panel"><SinCartera title="Todavía no hay vencimientos para mostrar" /></section>
      ) : (
        <div className={avisando ? 'split-wide' : ''}>
          <section>
            <Tabs
              label="Tipo de vencimiento"
              active={vista}
              onChange={cambiarVista}
              tabs={[{ id: 'vencidas', label: 'Vencidas', count: vencidas.length }, { id: 'por-vencer', label: 'Por vencer', count: porVencer.length }]}
            >
              <div className="panel">
                {lista.length === 0 ? (
                  <EmptyState icon={<Check size={22} />} title={vista === 'vencidas' ? 'No hay pólizas vencidas' : 'No hay pólizas por vencer'}>
                    {vista === 'vencidas' ? 'Todas las pólizas con fecha cumplida figuran pagas.' : 'Ninguna póliza vence en los próximos 30 días.'}
                  </EmptyState>
                ) : (
                  <div className="table-wrap">
                    <table className="table table--stack">
                      <thead>
                        <tr>
                          <th scope="col" className="cell-check">
                            <CheckBox label={<span className="sr-only">Seleccionar todas</span>} checked={todas} onChange={alternarTodas} />
                          </th>
                          <th scope="col">Asegurado</th>
                          <th scope="col">{vista === 'vencidas' ? 'Venció' : 'Vence'}</th>
                          <th scope="col">Pago y aviso</th>
                          <th scope="col"><span className="sr-only">Acción</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lista.map((p) => {
                          const ultimo = avisos[p.id] ?? p.ultimoAviso
                          const nombre = asegurado(p.aseguradoId)?.nombre ?? ''
                          return (
                            <tr key={p.id} data-selected={marcadas.has(p.id)}>
                              <td data-label="" className="cell-check">
                                <CheckBox label={<span className="sr-only">Seleccionar {nombre}</span>} checked={marcadas.has(p.id)} onChange={() => alternar(p.id)} />
                              </td>
                              <td data-label="Asegurado" className="cell-head">
                                <span className="cell-main">{nombre}</span>
                                <div className="cell-sub">{p.numero} · {compania(p.companiaId)?.nombre} · {p.ramo}</div>
                              </td>
                              <td data-label={vista === 'vencidas' ? 'Venció' : 'Vence'} className="nowrap">
                                {fmtDate(p.vencimiento)}
                                <div className="cell-sub">{relativeDays(p.vencimiento)}</div>
                              </td>
                              <td data-label="Pago y aviso">
                                <div>
                                  <PagoBadge pago={p.pago} />
                                  <div className="cell-sub">{ultimo ? `Último aviso: ${fmtDate(ultimo)}` : 'Sin avisar'}</div>
                                </div>
                              </td>
                              <td data-label="" className="nowrap">
                                <Button size="sm" icon={<BellRing size={15} aria-hidden />} onClick={() => setAvisando([p.id])}>Avisar</Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Tabs>
          </section>
          {avisando && polizasAvisando.length > 0 && (
            <div className="detail">
              <AvisoPanel polizas={polizasAvisando} onClose={() => setAvisando(null)} onSend={enviado} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
