import { ArrowLeft, ArrowRight, Delete, PencilLine } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '../components/Toast'
import { Balance } from '../components/bits'
import { useT } from '../lib/i18n'
import { balanceOf, quickAmounts, type PayMethod } from '../lib/ledger'
import { bufferToPaise, formatINR, pressKey } from '../lib/money'
import { useRouter } from '../lib/router'
import { newId, useKhata } from '../store/khata'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'back'] as const

export function Entry({ mode, cid }: { mode: 'udhaar' | 'jama' | 'sale'; cid?: string }) {
  const { state, addTx, undoTx, customer } = useKhata()
  const { t } = useT()
  const { back, go } = useRouter()
  const { show } = useToast()
  const c = customer(cid)

  const [buf, setBuf] = useState('')
  const [note, setNote] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const [method, setMethod] = useState<PayMethod>('cash')
  const [saving, setSaving] = useState(false)
  // One id per visit to this screen: repeated taps can only ever write this one entry.
  const [txId] = useState(() => newId('tx'))
  const savedRef = useRef(false)

  const amount = bufferToPaise(buf)
  const before = c ? balanceOf(state.txs, c.id) : 0
  const after = mode === 'udhaar' ? before + amount : mode === 'jama' ? before - amount : before
  const quick = quickAmounts(state.txs, c?.id, mode)

  const press = useCallback((k: string) => setBuf((b) => pressKey(b, k)), [])

  const save = useCallback(() => {
    if (savedRef.current || amount <= 0) return
    savedRef.current = true
    setSaving(true)
    addTx({
      id: txId,
      type: mode,
      customerId: c?.id,
      amount,
      note: note.trim() || undefined,
      method: mode === 'udhaar' ? undefined : method,
      createdAt: Date.now(),
    })
    const amt = formatINR(amount)
    show({
      title: mode === 'udhaar' ? t.toastUdhaar(amt, c?.name ?? '') : mode === 'jama' ? t.toastJama(amt, c?.name ?? '') : t.toastSale(amt),
      detail: c ? `${t.newBaaki} ${formatINR(after)}` : undefined,
      heldId: c?.id,
      onUndo: () => {
        undoTx(txId)
        show({ title: t.undone })
      },
    })
    back()
  }, [amount, addTx, txId, mode, c, note, method, show, t, after, undoTx, back])

  // Hardware keyboard support (desktop judges, Bluetooth keypads).
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
      if (/^\d$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') press('back')
      else if (e.key === 'Enter') save()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [press, save])

  const missing = mode !== 'sale' && !c
  useEffect(() => {
    if (missing) go({ name: 'home' }, { replace: true })
  }, [missing, go])
  if (missing) return null

  const label = mode === 'udhaar' ? t.udhaarAmount : mode === 'jama' ? t.jamaAmount : t.saleAmount
  const cta = amount <= 0 ? t.enterAmount : mode === 'udhaar' ? t.saveUdhaar(formatINR(amount)) : mode === 'jama' ? t.saveJama(formatINR(amount)) : t.saveSale(formatINR(amount))
  const overpay = mode === 'jama' && amount > before && before > 0

  return (
    <>
      <header className="cloth" style={{ paddingBottom: 'var(--s-3)' }}>
        <div className="cloth-row">
          <button className="icon-btn" aria-label={t.back} onClick={() => back()}>
            <ArrowLeft size={22} />
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 className="cloth-title">{c ? c.name : t.sale}</h1>
            {c && (
              <p className="cloth-sub num">
                {t.baakiNow} <Balance value={before} />
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="entry">
        <div className="entry-amount">
          <p className="label">{label}</p>
          <output className={`entry-figure serif num ${amount === 0 ? 'is-empty' : ''} entry-${mode}`} aria-live="polite" data-testid="amount" style={{ fontSize: buf.length >= 6 ? 'min(var(--t-amount-xl), 15vw)' : buf.length >= 4 ? 'min(var(--t-amount-xl), 19vw)' : 'min(var(--t-amount-xl), 23vw)' }}>
            <span className="rupee">₹</span>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={buf.length}
                initial={{ opacity: 0.4, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {amount === 0 ? '0' : new Intl.NumberFormat('en-IN').format(amount / 100)}
              </motion.span>
            </AnimatePresence>
          </output>
          {c && (
            <p className="entry-preview num" aria-live="polite">
              {t.baaki} <span className="from">{formatINR(before)}</span>
              <ArrowRight size={16} aria-hidden />
              <b className={after > before ? 'is-udhaar' : after < before ? 'is-jama' : ''} data-testid="after">
                {after < 0 ? `${formatINR(-after)} ${t.advance}` : formatINR(after)}
              </b>
            </p>
          )}
          {overpay && <p className="entry-warn">{t.tooMuch(formatINR(before))}</p>}
        </div>

        <div className="entry-tools">
          <div className="quick" role="group" aria-label="Quick amounts">
            {quick.map((q) => (
              <button key={q} className="chip num" onClick={() => setBuf(String(q / 100))}>
                {formatINR(q)}
              </button>
            ))}
          </div>
          {mode !== 'udhaar' && (
            <div className="seg" role="group" aria-label="Payment method">
              {(['cash', 'upi'] as const).map((m) => (
                <button key={m} aria-pressed={method === m} onClick={() => setMethod(m)}>
                  {m === 'cash' ? t.cash : t.upi}
                </button>
              ))}
            </div>
          )}
          {noteOpen ? (
            <input
              className="input"
              placeholder={t.notePlaceholder}
              aria-label={t.addNote}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={60}
              autoFocus
            />
          ) : (
            <button className="link note-link" onClick={() => setNoteOpen(true)}>
              <PencilLine size={18} aria-hidden /> {t.addNote}
            </button>
          )}
        </div>

        <div className="keypad num" role="group" aria-label="Keypad">
          {KEYS.map((k) => (
            <button key={k} className="key" onClick={() => press(k)} aria-label={k === 'back' ? 'Delete digit' : k}>
              {k === 'back' ? <Delete size={26} aria-hidden /> : k}
            </button>
          ))}
        </div>
      </main>

      <div className="dock">
        <button
          className={`btn btn-block ${mode === 'jama' ? 'btn-jama' : 'btn-primary'}`}
          style={{ minHeight: 'var(--tap-lg)', fontSize: 'var(--t-xl)' }}
          disabled={amount <= 0 || saving}
          onClick={save}
          data-testid="save"
        >
          {cta}
        </button>
      </div>
    </>
  )
}
