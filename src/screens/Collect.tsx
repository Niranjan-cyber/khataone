import { ArrowLeft, CircleCheck, CircleX, Banknote, Share2, Ban } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { useMemo, useRef, useState } from 'react'
import { useToast } from '../components/Toast'
import { useT } from '../lib/i18n'
import { balanceOf, initials } from '../lib/ledger'
import { formatINR, rupees, type Paise } from '../lib/money'
import { useRouter } from '../lib/router'
import { newId, useKhata } from '../store/khata'
import { pressKeyless } from './util'

type Status = 'pending' | 'success' | 'failed' | 'cancelled'

export function Collect({ cid }: { cid: string }) {
  const { state, customer, addTx } = useKhata()
  const { t } = useT()
  const { back } = useRouter()
  const { show } = useToast()
  const c = customer(cid)
  const bal = c ? balanceOf(state.txs, c.id) : 0

  const [custom, setCustom] = useState('')
  const [status, setStatus] = useState<Status>('pending')
  const [paid, setPaid] = useState<Paise>(0)
  const txId = useRef(newId('tx'))
  const attempt = useRef(0)

  const amount: Paise = custom ? rupees(Number(custom)) : Math.max(bal, 0)
  const upi = useMemo(
    () => `upi://pay?pa=${state.shop.upiDemo}&pn=${encodeURIComponent(state.shop.name)}&am=${(amount / 100).toFixed(2)}&cu=INR&tn=DEMO`,
    [amount, state.shop],
  )
  if (!c) return null

  const record = (method: 'upi' | 'cash') => {
    if (amount <= 0) return
    addTx({ id: txId.current, type: 'jama', customerId: c.id, amount, method, demo: method === 'upi' || undefined, createdAt: Date.now() })
    setPaid(amount)
    setStatus('success')
    if (method === 'cash') show({ title: t.toastJama(formatINR(amount), c.name), heldId: c.id })
  }

  const retry = () => {
    attempt.current += 1
    txId.current = newId('tx')
    setStatus('pending')
  }

  // After a successful payment `bal` already includes it: the store is the single source of truth.
  const after = bal

  return (
    <>
      <header className="cloth" style={{ paddingBottom: 'var(--s-3)' }}>
        <div className="cloth-row">
          <button className="icon-btn" aria-label={t.back} onClick={() => back()}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="cloth-title">{t.collectTitle}</h1>
            <p className="cloth-sub num">
              {c.name} · {t.baaki} {formatINR(bal + (status === 'success' ? paid : 0))}
            </p>
          </div>
          <span className="demo-badge" style={{ marginLeft: 'auto' }}>
            {t.demo}
          </span>
        </div>
      </header>

      <main className="scroll">
        <div className="page-ruled" style={{ display: 'grid', gap: 'var(--s-5)', alignContent: 'start' }}>
        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' ? (
            <motion.section
              key="ok"
              className="pay-result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              aria-live="assertive"
            >
              <motion.span initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
                <CircleCheck size={72} strokeWidth={1.6} color="var(--jama)" aria-hidden />
              </motion.span>
              <h2 className="serif">{t.paid}</h2>
              <p className="amount-lg serif num is-jama">{formatINR(paid)}</p>
              <p className="num" style={{ fontSize: 'var(--t-lg)' }}>
                {t.baakiAfter}: <b className="serif">{after <= 0 ? (after === 0 ? t.allPaid : `${formatINR(-after)} ${t.advance}`) : formatINR(after)}</b>
              </p>
            </motion.section>
          ) : (
            <motion.section key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="field" style={{ marginBottom: 'var(--s-4)' }}>
                <label htmlFor="col-amt">{t.amountToCollect}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--s-2)' }}>
                  <button className="chip num" aria-pressed={!custom} onClick={() => setCustom('')} disabled={bal <= 0}>
                    {t.fullBaaki} {formatINR(Math.max(bal, 0))}
                  </button>
                  <input
                    id="col-amt"
                    className="input num"
                    inputMode="numeric"
                    placeholder={t.partial}
                    value={custom}
                    onChange={(e) => {
                      setCustom(pressKeyless(e.target.value))
                      setStatus('pending')
                    }}
                  />
                </div>
              </div>

              <div className="qr-card">
                <div className="qr-head">
                  <span className="mono-tile" aria-hidden>
                    {initials(state.shop.name)}
                  </span>
                  <div>
                    <b>{state.shop.name}</b>
                    <p className="num">{state.shop.upiDemo}</p>
                  </div>
                </div>
                <p className="qr-amt serif num">{formatINR(amount)}</p>
                <div className={`qr ${status !== 'pending' ? 'is-dim' : ''}`}>
                  <QRCodeSVG value={upi} size={188} bgColor="#FFFDF8" fgColor="#1F1A17" level="M" title="Demo UPI QR code" />
                  <span className="qr-demo">{t.demo}</span>
                </div>
                <p className="label" style={{ textAlign: 'center' }}>{t.scanToPay}</p>
              </div>

              <div className={`pay-status s-${status}`} role="status" aria-live="polite">
                {status === 'pending' && (
                  <>
                    <span className="pulse" aria-hidden /> {t.waiting}
                  </>
                )}
                {status === 'failed' && (
                  <>
                    <CircleX size={22} aria-hidden />
                    <span>
                      <b>{t.failed}</b>
                      <br />
                      {t.failedHelp}
                    </span>
                  </>
                )}
                {status === 'cancelled' && (
                  <>
                    <Ban size={22} aria-hidden />
                    <span>
                      <b>{t.cancelledPay}</b>
                      <br />
                      {t.cancelledHelp}
                    </span>
                  </>
                )}
              </div>

              <fieldset className="sim">
                <legend>
                  {t.simulate} <span className="demo-badge">{t.demo}</span>
                </legend>
                <div className="dock-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                  <button className="btn btn-outline" style={{ color: 'var(--jama)', borderColor: 'var(--jama)' }} onClick={() => record('upi')} disabled={amount <= 0 || status !== 'pending'}>
                    {t.simSuccess}
                  </button>
                  <button className="btn btn-outline" onClick={() => setStatus('failed')} disabled={status !== 'pending'}>
                    {t.simFail}
                  </button>
                  <button className="btn btn-outline" onClick={() => setStatus('cancelled')} disabled={status !== 'pending'}>
                    {t.simCancel}
                  </button>
                </div>
                <p style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)', marginTop: 'var(--s-2)' }}>{t.demoNote}</p>
              </fieldset>
            </motion.section>
          )}
        </AnimatePresence>
        </div>
      </main>

      <div className="dock">
        {status === 'success' ? (
          <button className="btn btn-primary btn-block" onClick={() => back()}>
            {t.done}
          </button>
        ) : (
          <>
            {(status === 'failed' || status === 'cancelled') && (
              <button className="btn btn-outline btn-block" onClick={retry}>
                {t.tryAgain}
              </button>
            )}
            <div className="dock-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  const text = `${state.shop.name}: ${formatINR(amount)} · ${upi}`
                  if (navigator.share) navigator.share({ text }).catch(() => {})
                  else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
                }}
                disabled={amount <= 0}
              >
                <Share2 size={20} aria-hidden /> {t.shareLink}
              </button>
              <button className="btn btn-jama" onClick={() => record('cash')} disabled={amount <= 0}>
                <Banknote size={20} aria-hidden /> {t.takeCash}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
