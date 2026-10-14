import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Info, X } from 'lucide-react'

interface T { id: number; text: string }
const Ctx = createContext<(text: string) => void>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([])
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setItems((x) => [...x, { id, text }])
    window.setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 6000)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {items.map((t) => (
          <div className="toast" key={t.id}>
            <Info size={18} aria-hidden />
            <span>{t.text}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setItems((x) => x.filter((i) => i.id !== t.id))}>
              <X size={16} aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
