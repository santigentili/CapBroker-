import { useState } from 'react'
import { Mail, MessageCircle, Send, X, Layers } from 'lucide-react'
import { useDatos, useRuta } from '../data/DataContext'
import type { Poliza } from '../data/types'
import { armar, PLANTILLA_MAIL, PLANTILLA_MAIL_ASUNTO, PLANTILLA_WHATSAPP } from '../lib/avisos'
import { plural } from '../lib/format'
import { Button } from '../ui/Button'
import { Notice } from '../ui/Notice'
import { Segmented } from '../ui/Segmented'
import { TextArea } from '../ui/Field'
import { EmptyState } from '../ui/EmptyState'
import { Upload, Plug } from 'lucide-react'

export type Canal = 'whatsapp' | 'mail' | 'ambos'

/** Estado vacío de la versión principal: enseña qué cargar, no inventa nada. */
export function SinCartera({ title = 'Todavía no hay pólizas cargadas' }: { title?: string }) {
  const ruta = useRuta()
  return (
    <EmptyState
      icon={<Layers size={22} />}
      title={title}
      actions={
        <>
          <Button variant="primary" to={ruta('/configuracion?tab=companias')} icon={<Plug size={17} aria-hidden />}>Conectar una compañía</Button>
          <Button to={ruta('/configuracion?tab=companias')} icon={<Upload size={17} aria-hidden />}>Cargar pólizas desde PDF</Button>
        </>
      }
    >
      Conectá la cuenta de una compañía o cargá sus PDF. Con eso aparecen acá las pólizas, los vencimientos y la búsqueda.
    </EmptyState>
  )
}

export function AvisoPanel({ polizas, onClose, onSend }: { polizas: Poliza[]; onClose: () => void; onSend: (canal: Canal) => void }) {
  const { asegurado, compania } = useDatos()
  const [canal, setCanal] = useState<Canal>('whatsapp')
  const [wa, setWa] = useState(PLANTILLA_WHATSAPP)
  const [mail, setMail] = useState(PLANTILLA_MAIL)
  const [enviando, setEnviando] = useState(false)

  const primera = polizas[0]
  const a = primera && asegurado(primera.aseguradoId)
  const c = primera && compania(primera.companiaId)
  const sinTel = polizas.filter((p) => !asegurado(p.aseguradoId)?.telefono).length
  const sinMail = polizas.filter((p) => !asegurado(p.aseguradoId)?.email).length
  const usaWa = canal !== 'mail'
  const usaMail = canal !== 'whatsapp'

  const enviar = () => {
    setEnviando(true)
    window.setTimeout(() => { setEnviando(false); onSend(canal) }, 600)
  }

  return (
    <section className="panel" aria-label="Avisar vencimiento">
      <div className="panel-head">
        <div>
          <h2>Avisar vencimiento</h2>
          <p>{polizas.length} {plural(polizas.length, 'asegurado', 'asegurados')}</p>
        </div>
        <Button variant="quiet" size="sm" label="Cerrar panel de aviso" icon={<X size={17} aria-hidden />} onClick={onClose} />
      </div>
      <div className="panel-pad stack-sm">
        <div className="field">
          <span className="field-label" id="canal-label">Por dónde avisar</span>
          <Segmented
            label="Canal de aviso"
            value={canal}
            onChange={setCanal}
            options={[
              { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} aria-hidden /> },
              { value: 'mail', label: 'Mail', icon: <Mail size={16} aria-hidden /> },
              { value: 'ambos', label: 'Ambos' },
            ]}
          />
        </div>
        {usaWa && sinTel > 0 && <Notice tone="warn">{sinTel} {plural(sinTel, 'asegurado no tiene', 'asegurados no tienen')} teléfono cargado.</Notice>}
        {usaMail && sinMail > 0 && <Notice tone="warn">{sinMail} {plural(sinMail, 'asegurado no tiene', 'asegurados no tienen')} mail cargado.</Notice>}
        {usaWa && (
          <TextArea label="Mensaje de WhatsApp" value={wa} onChange={(e) => setWa(e.target.value)} hint="Podés usar {asegurado}, {poliza}, {compania}, {ramo}, {vencimiento} y {estado}." />
        )}
        {usaMail && (
          <TextArea label={`Mail (asunto: ${PLANTILLA_MAIL_ASUNTO})`} value={mail} onChange={(e) => setMail(e.target.value)} rows={7} />
        )}
        {primera && (
          <div className="preview">
            <span className="field-label">Así lo recibe {a?.nombre ?? 'el asegurado'}</span>
            <p>{armar(usaWa ? wa : mail, primera, a, c)}</p>
          </div>
        )}
      </div>
      <div className="panel-foot">
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" icon={<Send size={16} aria-hidden />} loading={enviando} onClick={enviar}>
          Enviar {polizas.length > 1 ? `a ${polizas.length}` : 'aviso'}
        </Button>
      </div>
    </section>
  )
}
