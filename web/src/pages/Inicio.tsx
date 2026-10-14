import { CalendarClock, Check, Plug, Users, Percent } from 'lucide-react'
import { estadoDe, useDatos, useRuta } from '../data/DataContext'
import { daysUntil, fmtToday, plural, relativeDays } from '../lib/format'
import { Button } from '../ui/Button'
import { EstadoBadge, Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { PageHeader } from '../ui/PageHeader'
import { SinCartera } from './shared'

export default function Inicio() {
  const { datos, asegurado, compania } = useDatos()
  const ruta = useRuta()
  const { polizas, companias, asegurados, comisiones } = datos

  const vencidas = polizas.filter((p) => estadoDe(p) === 'vencida')
  const proximas = polizas.filter((p) => estadoDe(p) === 'por-vencer' && daysUntil(p.vencimiento) <= 7)
  const lista = [...vencidas.sort((a, b) => a.vencimiento.localeCompare(b.vencimiento)), ...proximas.sort((a, b) => a.vencimiento.localeCompare(b.vencimiento))].slice(0, 7)

  const pasos = [
    { ok: companias.length > 0, titulo: 'Conectar compañías o cargar sus PDF', desc: 'De ahí salen las pólizas y los vencimientos.', icon: <Plug size={16} aria-hidden />, to: ruta('/configuracion?tab=companias'), cta: 'Configurar' },
    { ok: asegurados.length > 0, titulo: 'Cargar tus asegurados', desc: 'Con un Excel o un PDF con la lista completa.', icon: <Users size={16} aria-hidden />, to: ruta('/configuracion?tab=asegurados'), cta: 'Cargar' },
    { ok: comisiones.length > 0, titulo: 'Definir tus porcentajes de comisión', desc: 'Por compañía y por ramo.', icon: <Percent size={16} aria-hidden />, to: ruta('/comparativa?tab=porcentajes'), cta: 'Definir' },
  ]
  const todoListo = pasos.every((p) => p.ok)

  return (
    <>
      <PageHeader title="Inicio">{fmtToday()}</PageHeader>
      <div className="split">
        <div className="stack">
          <section className="panel" aria-labelledby="hoy">
            <div className="panel-head">
              <div>
                <h2 id="hoy">Para revisar hoy</h2>
                {polizas.length > 0 && (
                  <p>
                    {vencidas.length} {plural(vencidas.length, 'vencida', 'vencidas')} sin pagar · {proximas.length} {plural(proximas.length, 'vence', 'vencen')} en los próximos 7 días
                  </p>
                )}
              </div>
              {polizas.length > 0 && <Button size="sm" to={ruta('/vencimientos')} icon={<CalendarClock size={16} aria-hidden />}>Ver vencimientos</Button>}
            </div>
            {polizas.length === 0 ? (
              <SinCartera title="Todavía no hay nada para revisar" />
            ) : lista.length === 0 ? (
              <EmptyState icon={<Check size={22} />} title="Todo al día">No hay pólizas vencidas ni por vencer en los próximos 7 días.</EmptyState>
            ) : (
              <ul className="worklist">
                {lista.map((p) => (
                  <li key={p.id}>
                    <div>
                      <div className="cell-main">{asegurado(p.aseguradoId)?.nombre}</div>
                      <div className="cell-sub">
                        {p.numero} · {compania(p.companiaId)?.nombre} · {p.ramo} · {relativeDays(p.vencimiento)}
                      </div>
                    </div>
                    <div className="row">
                      <EstadoBadge estado={estadoDe(p)} />
                      <Button size="sm" to={ruta('/vencimientos')}>Avisar</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="stack">
          {!todoListo && (
            <section className="panel" aria-labelledby="pasos">
              <div className="panel-head"><h2 id="pasos">Primeros pasos</h2></div>
              <ol className="steps">
                {pasos.map((p) => (
                  <li key={p.titulo}>
                    <span className="step-dot" data-done={p.ok} aria-hidden>{p.ok && <Check size={14} strokeWidth={3} />}</span>
                    <div>
                      <div className="step-title">{p.titulo}<span className="sr-only">{p.ok ? ' (hecho)' : ' (pendiente)'}</span></div>
                      <div className="step-desc">{p.desc}</div>
                    </div>
                    {!p.ok && <Button size="sm" to={p.to}>{p.cta}</Button>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          <section className="panel" aria-labelledby="cias">
            <div className="panel-head">
              <h2 id="cias">Compañías</h2>
              {companias.length > 0 && <Button variant="quiet" size="sm" to={ruta('/configuracion?tab=companias')}>Administrar</Button>}
            </div>
            {companias.length === 0 ? (
              <EmptyState icon={<Plug size={22} />} title="Ninguna compañía configurada" actions={<Button variant="primary" to={ruta('/configuracion?tab=companias')}>Agregar compañía</Button>}>
                Acá ves de cuáles te llegan datos y cuándo se actualizaron por última vez.
              </EmptyState>
            ) : (
              <ul className="worklist">
                {companias.map((c) => (
                  <li key={c.id}>
                    <div>
                      <div className="cell-main">{c.nombre}</div>
                      <div className="cell-sub">{c.ultimaActualizacion}</div>
                    </div>
                    <Badge tone={c.fuente === 'conectada' ? 'ok' : 'neutral'}>{c.fuente === 'conectada' ? 'Conectada' : 'Carga por PDF'}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
