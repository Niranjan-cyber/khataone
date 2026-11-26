import { ArrowDownLeft, ArrowUpRight, ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import type { TxType } from '../lib/ledger'
import { formatINR, type Paise } from '../lib/money'
import { useT } from '../lib/i18n'

/** Direction is never colour alone: word + arrow + colour. */
export function TxLabel({ type }: { type: TxType }) {
  const { t } = useT()
  if (type === 'udhaar')
    return (
      <span className="tag is-udhaar">
        <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden />
        {t.udhaar}
      </span>
    )
  if (type === 'jama')
    return (
      <span className="tag is-jama">
        <ArrowDownLeft size={14} strokeWidth={2.5} aria-hidden />
        {t.jama}
      </span>
    )
  return (
    <span className="tag" style={{ color: 'var(--sale)' }}>
      <ShoppingBag size={13} strokeWidth={2.5} aria-hidden />
      {t.sale}
    </span>
  )
}

/** Balance with its meaning spelled out. */
export function Balance({ value, className = '' }: { value: Paise; className?: string }) {
  const { t } = useT()
  if (value === 0) return <span className={`is-zero ${className}`}>{t.allPaid}</span>
  if (value < 0)
    return (
      <span className={`is-jama ${className}`}>
        {formatINR(-value)}
        <small>{t.advance}</small>
      </span>
    )
  return <span className={`num ${className}`}>{formatINR(value)}</span>
}

/**
 * A money figure whose digits roll into place when the value changes.
 * Each character sits in its own cell so the layout never reflows.
 */
export function RollingAmount({ value, className = '' }: { value: Paise; className?: string }) {
  const text = formatINR(value)
  const prev = useRef(text)
  useEffect(() => {
    prev.current = text
  }, [text])
  const chars = text.split('')
  return (
    <span className={`num ${className}`} data-value={text} style={{ display: 'inline-flex', overflow: 'hidden' }}>
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => (
        <span key={`${i}-${chars.length}`} aria-hidden style={{ display: 'inline-block', position: 'relative' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch}
              style={{ display: 'inline-block' }}
              initial={{ y: '-60%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '60%', opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1], delay: i * 0.015 }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

export function Mono({ text, tone }: { text: string; tone?: 'udhaar' | 'jama' }) {
  return (
    <span
      className="mono-tile"
      aria-hidden
      style={tone === 'jama' ? { color: 'var(--jama)' } : undefined}
    >
      {text}
    </span>
  )
}

export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sheet-grip" aria-hidden />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function relDay(ts: number, t: ReturnType<typeof useT>['t'], now = Date.now()): string {
  const d0 = new Date(now).setHours(0, 0, 0, 0)
  const d1 = new Date(ts).setHours(0, 0, 0, 0)
  const days = Math.round((d0 - d1) / 864e5)
  if (days <= 0) return t.today
  if (days === 1) return t.yesterday
  return t.daysAgo(days)
}

export function shortDate(ts: number, lang: string) {
  return new Date(ts).toLocaleDateString(lang === 'en' ? 'en-IN' : `${lang}-IN`, { day: 'numeric', month: 'short' })
}
export function shortTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}
