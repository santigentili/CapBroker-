import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileUp, Mail, MessageCircle, Plug, Save, Users } from 'lucide-react'
import { useDatos } from '../data/DataContext'
import { PLANTILLA_MAIL, PLANTILLA_MAIL_ASUNTO, PLANTILLA_WHATSAPP } from '../lib/avisos'
import { plural } from '../lib/format'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { FileDrop } from '../ui/FileDrop'
import { TextArea, TextField } from '../ui/Field'
import { Notice } from '../ui/Notice'
import { PageHeader } from '../ui/PageHeader'
import { Segmented } from '../ui/Segmented'
import { Tabs } from '../ui/Tabs'
import { useToast } from '../ui/Toast'

type Metodo = 'conectar' | 'pdf'

function Companias() {
  const { datos } = useDatos()
  const toast = useToast()
  const [metodo, setMetodo] = useState<Metodo>('conectar')
  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [pdfs, setPdfs] = useState<File[]>([])
  const listo = nombre.trim() !== '' && (metodo === 'conectar' ? usuario.trim() !== '' && clave !== '' : pdfs.length > 0)

  return (
    <div className="split">
      <section className="panel" aria-labelledby="nueva">
        <div className="panel-head">
          <div>
            <h2 id="nueva">Agregar una compañía</h2>
            <p>Elegí cómo te llegan los datos de esa compañía.</p>
          </div>
        </div>
        <form className="panel-pad stack-sm" onSubmit={(e) => { e.preventDefault(); toast('Simulación: no se guardó ninguna clave ni archivo. Esta pantalla es solo diseño.'); setClave('') }} autoComplete="off">
          <Segmented<Metodo>
            label="Método"
            value={metodo}
            onChange={setMetodo}
            options={[
              { value: 'conectar', label: 'Conectar mi cuenta', icon: <Plug size={16} aria-hidden /> },
              { value: 'pdf', label: 'Cargar PDF', icon: <FileUp size={16} aria-hidden /> },
            ]}
          />
          <TextField label="Compañía" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          {metodo === 'conectar' ? (
            <>
              <div className="form-grid">
                <TextField label="Usuario o matrícula" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="off" />
                <TextField label="Contraseña" type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="new-password" />
              </div>
              <Notice tone="warn">Todavía no se guarda ninguna clave. Antes de usar claves reales se define cómo se protegen.</Notice>
            </>
          ) : (
            <FileDrop title="Elegí los PDF de pólizas" hint="Podés cargar varios a la vez." accept="application/pdf" multiple onChange={setPdfs} />
          )}
          <div className="row">
            <Button type="submit" variant="primary" disabled={!listo}>{metodo === 'conectar' ? 'Conectar compañía' : 'Cargar PDF'}</Button>
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="cargadas">
        <div className="panel-head"><h2 id="cargadas">Tus compañías</h2></div>
        {datos.companias.length === 0 ? (
          <EmptyState icon={<Plug size={22} />} title="Todavía no agregaste ninguna">Cada compañía que agregues aparece acá con su estado.</EmptyState>
        ) : (
          <ul className="worklist">
            {datos.companias.map((c) => (
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
  )
}

function Asegurados() {
  const { datos } = useDatos()
  const toast = useToast()
  const [files, setFiles] = useState<File[]>([])
  const n = datos.asegurados.length
  return (
    <div className="split">
      <section className="panel" aria-labelledby="imp">
        <div className="panel-head">
          <div>
            <h2 id="imp">Importar asegurados</h2>
            <p>Subí un Excel o un PDF con todos tus asegurados para guardarlos de una vez.</p>
          </div>
        </div>
        <div className="panel-pad stack-sm">
          <FileDrop title="Elegí un archivo" hint="Excel (.xlsx, .xls), CSV o PDF." accept=".xlsx,.xls,.csv,application/pdf" onChange={setFiles} />
        </div>
        <div className="panel-foot">
          <Button variant="primary" disabled={files.length === 0} icon={<Users size={16} aria-hidden />} onClick={() => toast('Simulación: el archivo no se procesó ni se guardó.')}>Importar asegurados</Button>
        </div>
      </section>
      <section className="panel panel-pad" aria-label="Estado">
        <p className="section-title">{n === 0 ? 'Sin asegurados cargados' : `${n} ${plural(n, 'asegurado cargado', 'asegurados cargados')}`}</p>
        <p className="muted small" style={{ marginTop: 'var(--s2)' }}>
          {n === 0 ? 'Después de importar, vas a poder buscarlos y avisarles los vencimientos.' : 'Si volvés a importar, se revisa antes de reemplazar nada.'}
        </p>
      </section>
    </div>
  )
}

function Avisos() {
  const toast = useToast()
  const [canal, setCanal] = useState<'whatsapp' | 'mail' | 'ambos'>('ambos')
  return (
    <section className="panel" aria-labelledby="av">
      <div className="panel-head">
        <div>
          <h2 id="av">Mensajes de aviso</h2>
          <p>Texto que se usa al avisar una póliza vencida. Podés cambiarlo cada vez que avisás.</p>
        </div>
      </div>
      <div className="panel-pad stack-sm">
        <div className="field">
          <span className="field-label">Canal por defecto</span>
          <Segmented
            label="Canal por defecto"
            value={canal}
            onChange={setCanal}
            options={[
              { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} aria-hidden /> },
              { value: 'mail', label: 'Mail', icon: <Mail size={16} aria-hidden /> },
              { value: 'ambos', label: 'Ambos' },
            ]}
          />
        </div>
        <TextArea label="Mensaje de WhatsApp" defaultValue={PLANTILLA_WHATSAPP} hint="Variables: {asegurado}, {poliza}, {compania}, {ramo}, {vencimiento}, {estado}." />
        <TextField label="Asunto del mail" defaultValue={PLANTILLA_MAIL_ASUNTO} />
        <TextArea label="Cuerpo del mail" defaultValue={PLANTILLA_MAIL} rows={8} />
      </div>
      <div className="panel-foot">
        <Button variant="primary" icon={<Save size={16} aria-hidden />} onClick={() => toast('Simulación: los mensajes todavía no se guardan.')}>Guardar mensajes</Button>
      </div>
    </section>
  )
}

export default function Configuracion() {
  const [params, setParams] = useSearchParams()
  const tab = ['companias', 'asegurados', 'avisos'].includes(params.get('tab') ?? '') ? (params.get('tab') as string) : 'companias'
  return (
    <>
      <PageHeader title="Configuración">De dónde salen tus datos y cómo les avisás a tus asegurados.</PageHeader>
      <Tabs label="Configuración" active={tab} onChange={(t) => setParams({ tab: t })} tabs={[{ id: 'companias', label: 'Compañías' }, { id: 'asegurados', label: 'Asegurados' }, { id: 'avisos', label: 'Avisos' }]}>
        {tab === 'companias' ? <Companias /> : tab === 'asegurados' ? <Asegurados /> : <Avisos />}
      </Tabs>
    </>
  )
}
