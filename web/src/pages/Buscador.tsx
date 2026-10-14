import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calculator, CalendarClock, Search, SearchX } from 'lucide-react'
import { estadoDe, useDatos, useRuta } from '../data/DataContext'
import type { Poliza, Ramo } from '../data/types'
import { RAMOS } from '../data/types'
import { fmtDate, money, norm, plural, relativeDays } from '../lib/format'
import { Button } from '../ui/Button'
import { EstadoBadge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { SelectField } from '../ui/Field'
import { PageHeader } from '../ui/PageHeader'
import { SinCartera } from './shared'

export default function Buscador() {
  const { datos, asegurado, compania } = useDatos()
  const ruta = useRuta()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [ramo, setRamo] = useState<'' | Ramo>('')
  const [cia, setCia] = useState('')
  const [sel, setSel] = useState<string | null>(null)

  const setQ = (v: string) => setParams(v ? { q: v } : {}, { replace: true })

  const resultados = useMemo(() => {
    const n = norm(q)
    return datos.polizas.filter((p) => {
      if (ramo && p.ramo !== ramo) return false
      if (cia && p.companiaId !== cia) return false
      if (!n) return true
      const a = asegurado(p.aseguradoId)
      return [a?.nombre, a?.documento, p.numero, p.referencia, compania(p.companiaId)?.nombre].some((t) => t && norm(t).includes(n))
    })
  }, [datos.polizas, q, ramo, cia, asegurado, compania])

  const elegida: Poliza | undefined = resultados.find((p) => p.id === sel)
  const a = elegida && asegurado(elegida.aseguradoId)
  const hayDatos = datos.polizas.length > 0

  return (
    <>
      <PageHeader title="Buscador">Encontrá una póliza por nombre, documento, patente, número o domicilio.</PageHeader>

      <div className="search-bar">
        <div className="field grow">
          <label htmlFor="q">Qué buscás</label>
          <div className="input-icon">
            <Search size={18} aria-hidden />
            <input id="q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej.: apellido, AB 123 CD, número de póliza" autoComplete="off" />
          </div>
        </div>
        <SelectField label="Ramo" value={ramo} onChange={(e) => setRamo(e.target.value as '' | Ramo)}>
          <option value="">Todos</option>
          {RAMOS.map((r) => <option key={r}>{r}</option>)}
        </SelectField>
        <SelectField label="Compañía" value={cia} onChange={(e) => setCia(e.target.value)} disabled={datos.companias.length === 0}>
          <option value="">Todas</option>
          {datos.companias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </SelectField>
      </div>

      <div className={elegida ? 'split-wide' : ''}>
        <section className="panel" aria-label="Resultados">
          {!hayDatos ? (
            <SinCartera title="Todavía no hay nada para buscar" />
          ) : resultados.length === 0 ? (
            <EmptyState icon={<SearchX size={22} />} title="No encontré nada con eso" actions={<Button onClick={() => { setQ(''); setRamo(''); setCia('') }}>Limpiar búsqueda</Button>}>
              Probá con menos letras, sin puntos ni espacios en la patente, o quitá los filtros.
            </EmptyState>
          ) : (
            <>
              <div className="panel-head">
                <p role="status">{resultados.length} {plural(resultados.length, 'póliza', 'pólizas')}</p>
              </div>
              <div className="table-wrap">
                <table className="table table--stack">
                  <thead>
                    <tr>
                      <th scope="col">Asegurado</th>
                      <th scope="col">Referencia</th>
                      <th scope="col">Compañía</th>
                      <th scope="col">Ramo</th>
                      <th scope="col">Vencimiento</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((p) => (
                      <tr key={p.id} data-selected={p.id === sel}>
                        <td data-label="Asegurado" className="cell-head">
                          <button type="button" className="row-link" aria-pressed={p.id === sel} onClick={() => setSel(p.id === sel ? null : p.id)}>
                            {asegurado(p.aseguradoId)?.nombre}
                          </button>
                          <div className="cell-sub">{p.numero}</div>
                        </td>
                        <td data-label="Referencia">{p.referencia}</td>
                        <td data-label="Compañía">{compania(p.companiaId)?.nombre}</td>
                        <td data-label="Ramo">{p.ramo}</td>
                        <td data-label="Vencimiento" className="nowrap">
                          {fmtDate(p.vencimiento)}
                          <div className="cell-sub">{relativeDays(p.vencimiento)}</div>
                        </td>
                        <td data-label="Estado"><EstadoBadge estado={estadoDe(p)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {elegida && a && (
          <aside className="panel detail" aria-label="Detalle de la póliza">
            <div className="panel-head">
              <div>
                <h2>{a.nombre}</h2>
                <p>Póliza {elegida.numero}</p>
              </div>
              <EstadoBadge estado={estadoDe(elegida)} />
            </div>
            <div className="panel-pad stack-sm">
              <dl className="dl">
                <dt>Compañía</dt><dd>{compania(elegida.companiaId)?.nombre}</dd>
                <dt>Ramo</dt><dd>{elegida.ramo}</dd>
                <dt>Referencia</dt><dd>{elegida.referencia}</dd>
                <dt>Vencimiento</dt><dd>{fmtDate(elegida.vencimiento)}</dd>
                <dt>Premio</dt><dd>{money(elegida.premio)}</dd>
                <dt>Documento</dt><dd>{a.documento}</dd>
                <dt>Teléfono</dt><dd>{a.telefono}</dd>
                <dt>Mail</dt><dd>{a.email}</dd>
              </dl>
            </div>
            <div className="panel-foot">
              <Button to={ruta(`/cotizador?poliza=${elegida.id}`)} icon={<Calculator size={16} aria-hidden />}>Recotizar</Button>
              <Button variant="primary" to={ruta('/vencimientos')} icon={<CalendarClock size={16} aria-hidden />}>Avisar vencimiento</Button>
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
