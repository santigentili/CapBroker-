import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChartColumn, RotateCcw, Save } from 'lucide-react'
import { estadoDe, useDatos, useRuta } from '../data/DataContext'
import { RAMOS } from '../data/types'
import type { Ramo } from '../data/types'
import { money } from '../lib/format'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Notice } from '../ui/Notice'
import { PageHeader } from '../ui/PageHeader'
import { Tabs } from '../ui/Tabs'
import { useToast } from '../ui/Toast'

const key = (c: string, r: Ramo) => `${c}|${r}`

export default function Comparativa() {
  const { datos } = useDatos()
  const ruta = useRuta()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'porcentajes' ? 'porcentajes' : 'resumen'

  const inicial = useMemo(() => Object.fromEntries(datos.comisiones.map((c) => [key(c.companiaId, c.ramo), c.porcentaje])), [datos.comisiones])
  const [pcts, setPcts] = useState<Record<string, number>>(inicial)
  const sucio = JSON.stringify(pcts) !== JSON.stringify(inicial)
  const pct = (c: string, r: Ramo) => pcts[key(c, r)] ?? 0

  const activas = datos.polizas.filter((p) => estadoDe(p) !== 'vencida')
  const porCia = datos.companias.map((c) => {
    const ps = activas.filter((p) => p.companiaId === c.id)
    return { c, n: ps.length, premios: ps.reduce((s, p) => s + p.premio, 0), comision: ps.reduce((s, p) => s + (p.premio * pct(c.id, p.ramo)) / 100, 0) }
  })
  const porRamo = RAMOS.map((r) => {
    const ps = activas.filter((p) => p.ramo === r)
    return { r, n: ps.length, premios: ps.reduce((s, p) => s + p.premio, 0), comision: ps.reduce((s, p) => s + (p.premio * pct(p.companiaId, r)) / 100, 0) }
  })
  const tot = { n: activas.length, premios: porCia.reduce((s, x) => s + x.premios, 0), comision: porCia.reduce((s, x) => s + x.comision, 0) }
  const maxCom = Math.max(1, ...porCia.map((x) => x.comision))

  const sinCias = datos.companias.length === 0

  return (
    <>
      <PageHeader title="Comparativa">Cuánto facturás con cada compañía, qué comisión te deja y cuántas pólizas activas tenés.</PageHeader>

      {sinCias ? (
        <section className="panel">
          <EmptyState icon={<ChartColumn size={22} />} title="Todavía no hay compañías para comparar" actions={<Button variant="primary" to={ruta('/configuracion?tab=companias')}>Agregar compañía</Button>}>
            Cuando cargues compañías y pólizas vas a ver acá premios, comisiones y pólizas activas, y vas a poder definir qué porcentaje te paga cada una por ramo.
          </EmptyState>
        </section>
      ) : (
        <Tabs label="Comparativa" active={tab} onChange={(t) => setParams(t === 'resumen' ? {} : { tab: t })} tabs={[{ id: 'resumen', label: 'Resumen' }, { id: 'porcentajes', label: 'Porcentajes de comisión' }]}>
          {tab === 'resumen' ? (
            <div className="stack">
              <Notice>Se calcula sobre las pólizas cargadas que no están vencidas, con los porcentajes de la solapa Porcentajes de comisión.</Notice>
              <section className="panel" aria-labelledby="por-cia">
                <div className="panel-head"><h2 id="por-cia">Por compañía</h2></div>
                <div className="table-wrap">
                  <table className="table table--stack">
                    <thead>
                      <tr>
                        <th scope="col">Compañía</th>
                        <th scope="col" className="num">Pólizas activas</th>
                        <th scope="col" className="num">Premios</th>
                        <th scope="col" className="num">Comisión</th>
                        <th scope="col">Peso en tu comisión</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porCia.map(({ c, n, premios, comision }) => (
                        <tr key={c.id}>
                          <td data-label="Compañía" className="cell-head"><span className="cell-main">{c.nombre}</span></td>
                          <td data-label="Pólizas activas" className="num">{n}</td>
                          <td data-label="Premios" className="num">{money(premios)}</td>
                          <td data-label="Comisión" className="num">{money(comision)}</td>
                          <td data-label="Peso">
                            <div className="bar" role="img" aria-label={`${tot.comision ? Math.round((comision / tot.comision) * 100) : 0}% de la comisión total`}>
                              <span style={{ width: `${(comision / maxCom) * 100}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr><td data-label="Total">Total</td><td data-label="Pólizas activas" className="num">{tot.n}</td><td data-label="Premios" className="num">{money(tot.premios)}</td><td data-label="Comisión" className="num">{money(tot.comision)}</td><td /></tr>
                    </tfoot>
                  </table>
                </div>
              </section>
              <section className="panel" aria-labelledby="por-ramo">
                <div className="panel-head"><h2 id="por-ramo">Por ramo</h2></div>
                <div className="table-wrap">
                  <table className="table table--stack">
                    <thead>
                      <tr><th scope="col">Ramo</th><th scope="col" className="num">Pólizas activas</th><th scope="col" className="num">Premios</th><th scope="col" className="num">Comisión</th></tr>
                    </thead>
                    <tbody>
                      {porRamo.map((x) => (
                        <tr key={x.r}>
                          <td data-label="Ramo" className="cell-head"><span className="cell-main">{x.r}</span></td>
                          <td data-label="Pólizas activas" className="num">{x.n}</td>
                          <td data-label="Premios" className="num">{money(x.premios)}</td>
                          <td data-label="Comisión" className="num">{money(x.comision)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <section className="panel" aria-labelledby="pcts">
              <div className="panel-head">
                <div>
                  <h2 id="pcts">Porcentaje de comisión por compañía y ramo</h2>
                  <p>Cada compañía te paga distinto según el ramo. Editá el porcentaje que corresponda.</p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Compañía</th>
                      {RAMOS.map((r) => <th scope="col" key={r} className="num">{r}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {datos.companias.map((c) => (
                      <tr key={c.id}>
                        <th scope="row" className="rowhead">{c.nombre}</th>
                        {RAMOS.map((r) => (
                          <td key={r} className="num">
                            <label className="pct">
                              <span className="sr-only">{c.nombre}, {r}, porcentaje</span>
                              <input
                                className="input input-num"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                max={100}
                                step={0.5}
                                value={pct(c.id, r)}
                                onChange={(e) => setPcts((p) => ({ ...p, [key(c.id, r)]: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                              />
                              <span aria-hidden>%</span>
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="panel-foot">
                <Button disabled={!sucio} icon={<RotateCcw size={16} aria-hidden />} onClick={() => setPcts(inicial)}>Descartar cambios</Button>
                <Button variant="primary" disabled={!sucio} icon={<Save size={16} aria-hidden />} onClick={() => toast('Simulación: los porcentajes todavía no se guardan en ningún lado.')}>Guardar porcentajes</Button>
              </div>
            </section>
          )}
        </Tabs>
      )}
    </>
  )
}
