import { ArrowDownLeft, BookOpen, ChevronRight, Plus, Settings2, ShoppingBag, UserPlus } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Balance, Mono, RollingAmount, Sheet, relDay } from '../components/bits'
import { useToast } from '../components/Toast'
import { LANGS, useT } from '../lib/i18n'
import { balanceOf, initials, lastOf, recentCustomers, todayTotals, totalOutstanding } from '../lib/ledger'
import { formatINR } from '../lib/money'
import { useRouter } from '../lib/router'
import { useKhata } from '../store/khata'

/** Last total the shopkeeper saw, so a returning Home can roll the figure from old to new. */
let lastSeenTotal: number | null = null

export function Home() {
  const { state, resetDemo } = useKhata()
  const { t, lang, setLang } = useT()
  const { go } = useRouter()
  const { held } = useToast()
  const [settings, setSettings] = useState(false)

  const { total, owing } = totalOutstanding(state)
  const today = todayTotals(state.txs)
  const recent = recentCustomers(state).slice(0, 6)
  const [shown, setShown] = useState(lastSeenTotal ?? total)
  useEffect(() => {
    const id = window.setTimeout(() => setShown(total), 180)
    lastSeenTotal = total
    return () => window.clearTimeout(id)
  }, [total])

  return (
    <>
      <header className="cloth">
        <div className="cloth-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="shop-local">{state.shop.nameLocal}</h1>
            <p className="shop-en">{state.shop.name}</p>
          </div>
          <button className="icon-btn" aria-label={t.settings} onClick={() => setSettings(true)}>
            <Settings2 size={22} />
          </button>
        </div>
      </header>

      <main className="scroll">
        <section className="page-ruled" aria-labelledby="baaki-h">
          <p className="label" id="baaki-h">
            {t.totalBaaki} · {t.customersOwe(owing)}
          </p>
          <RollingAmount value={shown} className="amount-lg serif" />
          <div className="split">
            <div>
              <p className="label">{t.salesToday}</p>
              <b className="num">{formatINR(today.sales)}</b>
              {today.udhaar > 0 && <small className="num">{t.onUdhaar(formatINR(today.udhaar))}</small>}
            </div>
            <div>
              <p className="label">{t.receivedToday}</p>
              <b className="num is-jama">{formatINR(today.received)}</b>
            </div>
          </div>

          <h2 className="section-h">
            <span>{t.recent}</span>
          </h2>
          <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recent.map((c) => {
              const bal = balanceOf(state.txs, c.id)
              const last = lastOf(state.txs, c.id, 'udhaar')
              return (
                <li key={c.id} style={{ display: 'flex', alignItems: 'stretch' }}>
                  <button
                    className="row"
                    style={{ flex: 1 }}
                    onClick={() => go({ name: 'entry', mode: 'udhaar', cid: c.id })}
                    aria-label={`${t.addUdhaar}: ${c.name}, ${t.baaki} ${formatINR(bal)}`}
                  >
                    <Mono text={initials(c.name)} />
                    <span className="row-name">
                      {c.name}
                      <small>{last ? relDay(last.createdAt, t) : t.newCustomer}</small>
                    </span>
                    {held === c.id ? (
                      <motion.span
                        className="row-amt-wrap is-held"
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ duration: 0.26, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Balance value={bal} className="row-amt" />
                      </motion.span>
                    ) : (
                      <Balance value={bal} className="row-amt" />
                    )}
                  </button>
                  <button className="khata-btn" aria-label={`${t.khata}: ${c.name}`} onClick={() => go({ name: 'ledger', cid: c.id })}>
                    <BookOpen size={20} aria-hidden />
                    <span>{t.khata}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--s-2)' }}>
            <button className="link" onClick={() => go({ name: 'pick', mode: 'udhaar' })}>
              {t.allCustomers(state.customers.length)} <ChevronRight size={18} aria-hidden />
            </button>
            <button className="link" onClick={() => go({ name: 'pick', mode: 'udhaar' })} style={{ gap: 6 }}>
              <UserPlus size={18} aria-hidden /> {t.newCustomer}
            </button>
          </div>
        </section>
      </main>

      <nav className="dock" aria-label="Actions">
        <div className="dock-2">
          <button className="btn btn-outline" onClick={() => go({ name: 'entry', mode: 'sale' })}>
            <ShoppingBag size={20} aria-hidden /> {t.sale}
          </button>
          <button className="btn btn-outline" onClick={() => go({ name: 'pick', mode: 'jama' })}>
            <ArrowDownLeft size={20} aria-hidden /> {t.received}
          </button>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => go({ name: 'pick', mode: 'udhaar' })} data-testid="add-udhaar">
          <Plus size={24} strokeWidth={2.75} aria-hidden /> {t.addUdhaar}
        </button>
      </nav>

      <Sheet open={settings} onClose={() => setSettings(false)} label={t.settings}>
        <h2>{t.settings}</h2>
        <div className="seg" role="group" aria-label="Language" style={{ marginBottom: 'var(--s-4)' }}>
          {LANGS.map((l) => (
            <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        <button
          className="btn btn-outline btn-block"
          onClick={() => {
            resetDemo()
            setSettings(false)
          }}
        >
          {t.resetDemo}
        </button>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 'var(--s-2)' }} onClick={() => setSettings(false)}>
          {t.close}
        </button>
      </Sheet>
    </>
  )
}
