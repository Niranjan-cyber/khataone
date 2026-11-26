import { ArrowLeft, BellRing, IndianRupee, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { Fragment, useState } from 'react'
import { useToast } from '../components/Toast'
import { RollingAmount, Sheet, TxLabel, relDay, shortDate, shortTime } from '../components/bits'
import { useT } from '../lib/i18n'
import { balanceOf, lastOf, ledgerRows, sameDay, type Tx } from '../lib/ledger'
import { formatINR } from '../lib/money'
import { useRouter } from '../lib/router'
import { useKhata } from '../store/khata'

export function Ledger({ cid }: { cid: string }) {
  const { state, customer, voidTx } = useKhata()
  const { t, lang } = useT()
  const { go, back } = useRouter()
  const { held, show } = useToast()
  const [open, setOpen] = useState<Tx | null>(null)
  const c = customer(cid)
  if (!c) return null

  const bal = balanceOf(state.txs, c.id)
  const lastPay = lastOf(state.txs, c.id, 'jama')
  const rows = ledgerRows(state.txs, c.id).reverse()
  const newestId = rows[0]?.tx.id

  return (
    <>
      <header className="cloth">
        <div className="cloth-row">
          <button className="icon-btn" aria-label={t.back} onClick={() => back()}>
            <ArrowLeft size={22} />
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 className="cloth-title">{c.name}</h1>
            {c.phone && <p className="cloth-sub num">{c.phone}</p>}
          </div>
        </div>
        <div style={{ marginTop: 'var(--s-4)', paddingLeft: 4 }}>
          <p className="cloth-sub">{bal < 0 ? t.advance : t.baaki}</p>
          <RollingAmount value={Math.abs(bal)} className="amount-lg serif" />
          <p className="cloth-sub num" style={{ marginTop: 2 }}>
            {lastPay ? `${t.lastPaid}: ${formatINR(lastPay.amount)} · ${relDay(lastPay.createdAt, t)}` : t.never}
            {c.lastRemindedAt ? ` · ${t.lastReminded(relDay(c.lastRemindedAt, t))}` : ''}
          </p>
        </div>
      </header>

      <main className="scroll">
        <div className="page-ruled" style={{ paddingTop: 'var(--s-2)' }}>
          {rows.length === 0 && <p style={{ padding: 'var(--s-6) 0', color: 'var(--ink-2)' }}>{t.ledgerEmpty}</p>}
          <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rows.map(({ tx, running }, i) => {
              const prev = rows[i - 1]?.tx
              const newDay = !prev || !sameDay(prev.createdAt, tx.createdAt)
              const fresh = tx.id === newestId && held === c.id
              return (
                <Fragment key={tx.id}>
                  {newDay && (
                    <li className="day-h" aria-hidden>
                      {relDay(tx.createdAt, t)} · {shortDate(tx.createdAt, lang)}
                    </li>
                  )}
                  <li>
                    <motion.button
                      className={`lrow ${tx.voidedAt ? 'is-void' : ''} ${fresh ? 'held' : ''}`}
                      onClick={() => setOpen(tx)}
                      initial={fresh ? { clipPath: 'inset(0 100% 0 0)' } : false}
                      animate={{ clipPath: 'inset(0 0% 0 0)' }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="lrow-main">
                        <TxLabel type={tx.type} />
                        <span className="lrow-note">
                          {tx.note || (tx.method === 'upi' ? t.upi : tx.method === 'cash' ? t.cash : '')}
                          {tx.demo && <span className="demo-badge" style={{ marginLeft: 6 }}>{t.demo}</span>}
                        </span>
                        <span className="lrow-time num">{shortTime(tx.createdAt)}</span>
                      </span>
                      <span className="lrow-amt">
                        <b className={`num ${tx.type === 'udhaar' ? 'is-udhaar' : 'is-jama'}`}>
                          {tx.type === 'udhaar' ? '+' : '−'}
                          {formatINR(tx.amount)}
                        </b>
                        {tx.voidedAt ? (
                          <small>{t.cancelled}</small>
                        ) : (
                          <small className="num">
                            {t.baaki} {formatINR(running)}
                          </small>
                        )}
                      </span>
                    </motion.button>
                  </li>
                </Fragment>
              )
            })}
          </ol>
        </div>
      </main>

      <nav className="dock" aria-label="Customer actions">
        <div className="dock-2">
          <button className="btn btn-outline" onClick={() => go({ name: 'remind', cid: c.id })} disabled={bal <= 0}>
            <BellRing size={20} aria-hidden /> {t.remind}
          </button>
          <button className="btn btn-outline" onClick={() => go({ name: 'collect', cid: c.id })} style={{ color: 'var(--jama)', borderColor: 'var(--jama)' }}>
            <IndianRupee size={20} aria-hidden /> {t.collect}
          </button>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => go({ name: 'entry', mode: 'udhaar', cid: c.id })}>
          <Plus size={24} strokeWidth={2.75} aria-hidden /> {t.addUdhaar}
        </button>
      </nav>

      <Sheet open={!!open} onClose={() => setOpen(null)} label="Entry">
        {open && (
          <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
            <TxLabel type={open.type} />
            <p className="amount-lg serif num" style={{ fontSize: '2.5rem' }}>
              {formatINR(open.amount)}
            </p>
            <p className="num" style={{ color: 'var(--ink-2)' }}>
              {shortDate(open.createdAt, lang)}, {shortTime(open.createdAt)}
              {open.note ? ` · ${open.note}` : ''}
              {open.method ? ` · ${open.method === 'upi' ? t.upi : t.cash}` : ''}
            </p>
            {open.demo && <p className="entry-warn">{t.demoNote}</p>}
            {open.voidedAt ? (
              <p style={{ color: 'var(--ink-2)' }}>{t.cancelled}</p>
            ) : (
              <>
                <p style={{ color: 'var(--ink-2)', fontSize: 'var(--t-sm)' }}>{t.cancelHelp}</p>
                <button
                  className="btn btn-outline btn-block"
                  style={{ color: 'var(--udhaar)', borderColor: 'var(--udhaar)' }}
                  onClick={() => {
                    voidTx(open.id)
                    setOpen(null)
                    show({ title: t.entryCancelled, heldId: c.id })
                  }}
                >
                  {t.cancelEntry}
                </button>
              </>
            )}
            <button className="btn btn-ghost btn-block" onClick={() => setOpen(null)}>
              {t.keepEntry}
            </button>
          </div>
        )}
      </Sheet>
    </>
  )
}
