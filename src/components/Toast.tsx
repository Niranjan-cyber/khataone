import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useT } from '../lib/i18n'

interface ToastData {
  id: number
  title: string
  detail?: string
  onUndo?: () => void
  /** Customer whose balance just changed: the home and ledger screens hold its highlight. */
  heldId?: string
}

interface ToastCtx {
  show: (t: Omit<ToastData, 'id'>) => void
  held: string | null
}
const Ctx = createContext<ToastCtx | null>(null)
const UNDO_MS = 6000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null)
  const [held, setHeld] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((t: Omit<ToastData, 'id'>) => {
    window.clearTimeout(timer.current)
    setToast({ ...t, id: Date.now() })
    if (t.heldId) setHeld(t.heldId)
    timer.current = window.setTimeout(() => setToast(null), t.onUndo ? UNDO_MS : 3500)
  }, [])

  // The changed balance stays marked until the shopkeeper has seen it: cleared by their next tap, not a timer.
  useEffect(() => {
    if (!held) return
    let armed = false
    const arm = window.setTimeout(() => (armed = true), 900)
    const clear = () => armed && setHeld(null)
    window.addEventListener('pointerdown', clear)
    return () => {
      window.clearTimeout(arm)
      window.removeEventListener('pointerdown', clear)
    }
  }, [held])

  return (
    <Ctx.Provider value={{ show, held }}>
      {children}
      <ToastView toast={toast} onClose={() => setToast(null)} />
    </Ctx.Provider>
  )
}

function ToastView({ toast, onClose }: { toast: ToastData | null; onClose: () => void }) {
  const { t } = useT()
  return (
    <div aria-live="polite" role="status">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            style={{ bottom: 'calc(var(--dock-h, 150px) + 8px)' }}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="toast-body">
              <b>{toast.title}</b>
              {toast.detail && <span className="num">{toast.detail}</span>}
            </div>
            {toast.onUndo && (
              <button
                className="toast-undo"
                onClick={() => {
                  toast.onUndo?.()
                  onClose()
                }}
              >
                {t.undo}
              </button>
            )}
            {toast.onUndo && (
              <motion.span
                className="toast-timer"
                style={{ width: '100%' }}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: UNDO_MS / 1000, ease: 'linear' }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useToast outside ToastProvider')
  return v
}
