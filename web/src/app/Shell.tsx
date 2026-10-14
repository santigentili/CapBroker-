import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Calculator, CalendarClock, ChartColumn, House, Menu, Receipt, Search, Settings, X } from 'lucide-react'
import { DataProvider, estadoDe, useDatos, useRuta } from '../data/DataContext'
import { datosVacios } from '../data/empty'
import { datosDemo } from '../data/demo'
import { ToastProvider } from '../ui/Toast'
import { Button } from '../ui/Button'

const NAV = [
  { to: '', label: 'Inicio', icon: House, end: true },
  { to: '/buscador', label: 'Buscador', icon: Search },
  { to: '/vencimientos', label: 'Vencimientos', icon: CalendarClock, count: true },
  { to: '/cotizador', label: 'Cotizador', icon: Calculator },
  { to: '/comparativa', label: 'Comparativa', icon: ChartColumn },
  { to: '/facturacion', label: 'Facturación AFIP', icon: Receipt },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]

function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="7" fill="var(--primary)" />
      <path d="M21.5 11.2A6.5 6.5 0 1 0 21.5 20.8" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

function Frame() {
  const { datos, esDemo } = useDatos()
  const ruta = useRuta()
  const nav = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const vencidas = datos.polizas.filter((p) => estadoDe(p) === 'vencida').length

  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    nav(`${ruta('/buscador')}${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <div className="app">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden />}
      <aside className="side" data-open={open} id="menu-lateral">
        <Link to={ruta()} className="brand" aria-label="CapBroker, ir al inicio">
          <Mark />
          <span className="brand-name">CapBroker</span>
        </Link>
        <Button className="side-close" variant="quiet" label="Cerrar menú" icon={<X size={20} aria-hidden />} onClick={() => setOpen(false)} />
        <nav className="nav" aria-label="Principal">
          {NAV.map(({ to, label, icon: Icon, end, count }) => (
            <NavLink key={to} to={ruta(to)} end={end} className="nav-link">
              <Icon size={19} aria-hidden />
              {label}
              {count && vencidas > 0 && <span className="nav-count" aria-label={`${vencidas} vencidas`}>{vencidas}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <span>{esDemo ? 'Versión de ejemplo (datos inventados)' : 'Sin datos cargados'}</span>
        </div>
      </aside>

      <div className="main">
        {esDemo && (
          <div className="demo-banner" role="note">
            <span>Estás viendo datos de ejemplo inventados. Nada de esto es real y no se guarda ni se envía.</span>
            <Link to="/">Ir a la versión sin datos</Link>
          </div>
        )}
        <div className="topbar">
          <Button className="topbar-menu" variant="quiet" label="Abrir menú" aria-expanded={open} aria-controls="menu-lateral" icon={<Menu size={20} aria-hidden />} onClick={() => setOpen(true)} />
          <Link to={ruta()} className="topbar-brand" aria-label="CapBroker">
            <Mark />
            <span>CapBroker</span>
          </Link>
          <form className="topbar-search" role="search" onSubmit={submit}>
            <Search size={18} aria-hidden />
            <input className="input" type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, patente o póliza" aria-label="Buscar por nombre, patente o póliza" autoComplete="off" />
          </form>
        </div>
        <main id="contenido" className="content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function Shell({ modo }: { modo: 'real' | 'demo' }) {
  return (
    <DataProvider datos={modo === 'demo' ? datosDemo : datosVacios} base={modo === 'demo' ? '/test' : ''}>
      <ToastProvider>
        <Frame />
      </ToastProvider>
    </DataProvider>
  )
}
