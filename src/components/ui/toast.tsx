import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CircleCheck, CircleX, Info, X } from 'lucide-react'
import { ToastContext, type ToastApi } from './use-toast'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const show = useCallback((kind: ToastKind, message: string) => {
    const id = nextId.current++
    setItems((current) => [...current.slice(-3), { id, kind, message }])
    timers.current.set(id, setTimeout(() => dismiss(id), kind === 'error' ? 6000 : 4000))
  }, [dismiss])

  useEffect(() => () => {
    for (const timer of timers.current.values()) clearTimeout(timer)
    timers.current.clear()
  }, [])

  const api = useMemo<ToastApi>(() => ({
    success: (message) => show('success', message),
    error: (message) => show('error', message),
    info: (message) => show('info', message),
  }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-viewport" aria-label="Notifications">
        {items.map((item) => {
          const Icon = item.kind === 'success' ? CircleCheck : item.kind === 'error' ? CircleX : Info
          return (
            <div
              key={item.id}
              className={`app-toast app-toast--${item.kind}`}
              role={item.kind === 'error' ? 'alert' : 'status'}
            >
              <Icon className="app-toast__icon" size={20} aria-hidden="true" />
              <span className="app-toast__message">{item.message}</span>
              <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification">
                <X size={17} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
