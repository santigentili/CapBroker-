import { Route, Routes } from 'react-router-dom'
import { Shell } from './app/Shell'
import Inicio from './pages/Inicio'
import Buscador from './pages/Buscador'
import Vencimientos from './pages/Vencimientos'
import Cotizador from './pages/Cotizador'
import Comparativa from './pages/Comparativa'
import Facturacion from './pages/Facturacion'
import Configuracion from './pages/Configuracion'

/** Mismas pantallas dos veces: "/" sin datos y "/test" con datos inventados. */
const pantallas = (
  <>
    <Route index element={<Inicio />} />
    <Route path="buscador" element={<Buscador />} />
    <Route path="vencimientos" element={<Vencimientos />} />
    <Route path="cotizador" element={<Cotizador />} />
    <Route path="comparativa" element={<Comparativa />} />
    <Route path="facturacion" element={<Facturacion />} />
    <Route path="configuracion" element={<Configuracion />} />
  </>
)

export default function App() {
  return (
    <Routes>
      <Route element={<Shell modo="real" />}>{pantallas}</Route>
      <Route path="test" element={<Shell modo="demo" />}>{pantallas}</Route>
      <Route path="*" element={<Shell modo="real" />}>
        <Route path="*" element={<Inicio />} />
      </Route>
    </Routes>
  )
}
