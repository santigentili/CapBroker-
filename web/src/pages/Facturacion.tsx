import { Receipt } from 'lucide-react'
import { PageHeader } from '../ui/PageHeader'
import { EmptyState } from '../ui/EmptyState'

export default function Facturacion() {
  return (
    <>
      <PageHeader title="Facturación AFIP">Emisión y seguimiento de comprobantes.</PageHeader>
      <section className="panel">
        <EmptyState icon={<Receipt size={22} />} title="Sección en definición">
          El circuito de facturación con AFIP se define en la próxima etapa. Cuando esté, acá vas a ver los comprobantes emitidos y vas a poder generar nuevos.
        </EmptyState>
      </section>
    </>
  )
}
