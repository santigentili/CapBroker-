import { useEffect, useId, useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { Button } from './Button'

/** Solo interfaz: elige archivos y los muestra. No sube nada. */
export function FileDrop({ title, hint, accept, multiple, onChange }: { title: string; hint: string; accept: string; multiple?: boolean; onChange?: (files: File[]) => void }) {
  const id = useId()
  const [files, setFiles] = useState<File[]>([])
  const [over, setOver] = useState(false)
  useEffect(() => onChange?.(files), [files]) // eslint-disable-line react-hooks/exhaustive-deps
  const add = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list)
    setFiles((f) => (multiple ? [...f, ...next] : next.slice(0, 1)))
  }
  return (
    <div className="stack-sm">
      <label
        htmlFor={id}
        className="drop"
        data-over={over}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files) }}
      >
        <Upload size={22} aria-hidden />
        <span className="drop-title">{title}</span>
        <span className="drop-sub">{hint}</span>
        <input id={id} type="file" accept={accept} multiple={multiple} onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      </label>
      {files.length > 0 && (
        <ul className="row" aria-label="Archivos elegidos">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="file-chip">
              <FileText size={15} aria-hidden />
              {f.name}
              <Button variant="quiet" size="sm" label={`Quitar ${f.name}`} icon={<X size={14} aria-hidden />} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
