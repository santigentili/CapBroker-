import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calculator, FileDown, Plug } from 'lucide-react'
import { useDatos, useRuta } from '../data/DataContext'
import type { Ramo } from '../data/types'
import { RAMOS } from '../data/types'
import { money } from '../lib/format'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Check, SelectField, TextField } from '../ui/Field'
import { Notice } from '../ui/Notice'
import { PageHeader } from '../ui/PageHeader'
import { useToast } from '../ui/Toast'

interface Campo { id: string; label: string; type?: string; options?: string[]; hint?: string }
const CAMPOS: Record<Ramo, Campo[]> = {
  Automotor: [
    { id: 'patente', label: 'Patente' },
    { id: 'vehiculo', label: 'Marca, modelo y versión' },
    { id: 'anio', label: 'Año', type: 'number' },
    { id: 'cp', label: 'Código postal' },
    { id: 'uso', label: 'Uso', options: ['Particular', 'Comercial'] },
  ],
  Hogar: [
    { id: 'domicilio', label: 'Domicilio del riesgo' },
    { id: 'tipo', label: 'Tipo de vivienda', options: ['Casa', 'Departamento', 'PH'] },
    { id: 'm2', label: 'Superficie cubierta (m²)', type: 'number' },
    { id: 'suma', label: 'Suma asegurada ($)', type: 'number' },
  ],
  Vida: [
    { id: 'nacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { id: 'suma', label: 'Suma asegurada ($)', type: 'number' },
    { id: 'fuma', label: '¿Fuma?', options: ['No', 'Sí'] },
  ],
  AP: [
    { id: 'actividad', label: 'Actividad' },
    { id: 'nacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { id: 'suma', label: 'Suma asegurada ($)', type: 'number' },
  ],
  ART: [
    { id: 'cuit', label: 'CUIT del empleador' },
    { id: 'empleados', label: 'Cantidad de empleados', type: 'number' },
    { id: 'masa', label: 'Masa salarial mensual ($)', type: 'number' },
  ],
  Comercio: [
    { id: 'rubro', label: 'Rubro' },
    { id: 'domicilio', label: 'Domicilio del local' },
    { id: 'suma', label: 'Suma asegurada ($)', type: 'number' },
  ],
}

/** Número estable a partir de texto, solo para que el ejemplo no cambie en cada render. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
const BASE: Record<Ramo, number> = { Automotor: 520_000, Hogar: 150_000, Vida: 190_000, AP: 65_000, ART: 400_000, Comercio: 430_000 }

export default function Cotizador() {
  const { datos, esDemo, asegurado } = useDatos()
  const ruta = useRuta()
  const toast = useToast()
  const [params] = useSearchParams()
  const previa = datos.polizas.find((p) => p.id === params.get('poliza'))

  const [ramo, setRamo] = useState<Ramo>(previa?.ramo ?? 'Automotor')
  const [valores, setValores] = useState<Record<string, string>>(
    previa ? { patente: previa.ramo === 'Automotor' ? previa.referencia : '', domicilio: previa.ramo === 'Hogar' ? previa.referencia : '', asegurado: asegurado(previa.aseguradoId)?.nombre ?? '' } : {},
  )
  const conectables = datos.companias.filter((c) => c.fuente === 'conectada')
  const [elegidas, setElegidas] = useState<Set<string>>(new Set(conectables.map((c) => c.id)))
  const [cotizando, setCotizando] = useState(false)
  const [resultado, setResultado] = useState<{ id: string; premio: number }[] | null>(null)

  const resRef = useRef<HTMLElement>(null)
  useEffect(() => { if (resultado) resRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [resultado])
  const set = (k: string, v: string) => { setValores((x) => ({ ...x, [k]: v })); setResultado(null) }
  const puede = elegidas.size > 0

  const cotizar = () => {
    setCotizando(true)
    window.setTimeout(() => {
      const semilla = JSON.stringify(valores) + ramo
      setResultado([...elegidas].map((id) => ({ id, premio: Math.round((BASE[ramo] * (0.85 + (hash(semilla + id) % 40) / 100)) / 1000) * 1000 })).sort((a, b) => a.premio - b.premio))
      setCotizando(false)
    }, 900)
  }

  const pct = (cid: string) => datos.comisiones.find((c) => c.companiaId === cid && c.ramo === ramo)?.porcentaje ?? 0
  const campos = useMemo(() => CAMPOS[ramo], [ramo])

  return (
    <>
      <PageHeader title="Cotizador">Cotizá una vez y obtené el precio de cada compañía conectada, sin entrar a cada portal.</PageHeader>

      {previa && <div style={{ marginBottom: 'var(--s4)' }}><Notice>Recotizando la póliza {previa.numero}. Revisá los datos antes de cotizar.</Notice></div>}

      <div className="split">
        <div className="stack">
          <section className="panel" aria-labelledby="que">
            <div className="panel-head"><h2 id="que">Qué querés cotizar</h2></div>
            <div className="panel-pad stack-sm">
              <div className="field">
                <span className="field-label">Ramo</span>
                <div className="segmented" role="group" aria-label="Ramo">
                  {RAMOS.map((r) => (
                    <button key={r} type="button" aria-pressed={ramo === r} onClick={() => { setRamo(r); setResultado(null) }}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="form-grid">
                <TextField className="span-2" label="Asegurado" list="asegurados" value={valores.asegurado ?? ''} onChange={(e) => set('asegurado', e.target.value)} hint="Elegí uno existente o escribí el nombre de una persona nueva." />
                <datalist id="asegurados">{datos.asegurados.map((a) => <option key={a.id} value={a.nombre} />)}</datalist>
                {campos.map((c) =>
                  c.options ? (
                    <SelectField key={`${ramo}-${c.id}`} label={c.label} value={valores[c.id] ?? c.options[0]} onChange={(e) => set(c.id, e.target.value)}>
                      {c.options.map((o) => <option key={o}>{o}</option>)}
                    </SelectField>
                  ) : (
                    <TextField key={`${ramo}-${c.id}`} label={c.label} type={c.type ?? 'text'} inputMode={c.type === 'number' ? 'numeric' : undefined} value={valores[c.id] ?? ''} onChange={(e) => set(c.id, e.target.value)} />
                  ),
                )}
              </div>
            </div>
          </section>

          {resultado && (
            <section className="panel" aria-labelledby="res" ref={resRef} style={{ scrollMarginTop: '6rem' }}>
              <div className="panel-head">
                <div>
                  <h2 id="res">Resultado</h2>
                  <p>De menor a mayor premio. {esDemo && 'Valores inventados para ver el diseño.'}</p>
                </div>
                <Button variant="primary" icon={<FileDown size={17} aria-hidden />} onClick={() => toast('Simulación: acá se generaría el PDF de la cotización.')}>Descargar PDF</Button>
              </div>
              <div className="table-wrap">
                <table className="table table--stack">
                  <thead>
                    <tr><th scope="col">Compañía</th><th scope="col" className="num">Premio</th><th scope="col" className="num">Tu comisión</th><th scope="col"><span className="sr-only">Detalle</span></th></tr>
                  </thead>
                  <tbody>
                    {resultado.map((r, i) => (
                      <tr key={r.id}>
                        <td data-label="Compañía" className="cell-head"><span className="cell-main">{datos.companias.find((c) => c.id === r.id)?.nombre}</span></td>
                        <td data-label="Premio" className="num">{money(r.premio)}</td>
                        <td data-label="Tu comisión" className="num">{money((r.premio * pct(r.id)) / 100)} <span className="cell-sub">({pct(r.id)}%)</span></td>
                        <td data-label="">{i === 0 && <Badge tone="ok">Menor premio</Badge>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <aside className="panel detail" aria-labelledby="cias">
          <div className="panel-head"><h2 id="cias">Compañías</h2></div>
          <div className="panel-pad stack-sm">
            {datos.companias.length === 0 ? (
              <Notice tone="warn">No hay compañías conectadas. Sin una cuenta conectada no se puede cotizar.</Notice>
            ) : (
              <ul className="stack-sm">
                {datos.companias.map((c) => (
                  <li key={c.id}>
                    <Check
                      label={<>{c.nombre}{c.fuente === 'pdf' && <span className="cell-sub"> · carga por PDF, no cotiza</span>}</>}
                      disabled={c.fuente !== 'conectada'}
                      checked={elegidas.has(c.id)}
                      onChange={() => { setResultado(null); setElegidas((s) => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n }) }}
                    />
                  </li>
                ))}
              </ul>
            )}
            {datos.companias.length === 0 && <Button to={ruta('/configuracion?tab=companias')} icon={<Plug size={16} aria-hidden />}>Conectar una compañía</Button>}
          </div>
          <div className="panel-foot">
            <Button variant="primary" disabled={!puede} loading={cotizando} icon={<Calculator size={17} aria-hidden />} onClick={cotizar}>
              {puede ? `Cotizar en ${elegidas.size} ${elegidas.size === 1 ? 'compañía' : 'compañías'}` : 'Cotizar'}
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}
