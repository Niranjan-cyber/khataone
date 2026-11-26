import { ArrowLeft, Search, UserPlus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Balance, Mono, Sheet } from '../components/bits'
import { useT } from '../lib/i18n'
import { balanceOf, frequentCustomers, initials, recentCustomers, type Customer } from '../lib/ledger'
import { useRouter } from '../lib/router'
import { useKhata } from '../store/khata'

export function Picker({ mode }: { mode: 'udhaar' | 'jama' }) {
  const { state, addCustomer } = useKhata()
  const { t } = useT()
  const { go, back } = useRouter()
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const pick = (c: Customer) => go({ name: 'entry', mode, cid: c.id }, { replace: true })

  const query = q.trim().toLowerCase()
  const digits = query.replace(/\D/g, '')
  const matches = useMemo(
    () =>
      query
        ? state.customers.filter((c) => c.name.toLowerCase().includes(query) || (digits.length >= 3 && c.phone?.replace(/\D/g, '').includes(digits)))
        : [],
    [state.customers, query, digits],
  )
  const recent = recentCustomers(state).slice(0, 4)
  const frequent = frequentCustomers(state).filter((c) => !recent.some((r) => r.id === c.id)).slice(0, 4)
  const rest = [...state.customers].sort((a, b) => a.name.localeCompare(b.name))

  const row = (c: Customer) => (
    <li key={c.id}>
      <button className="row" onClick={() => pick(c)}>
        <Mono text={initials(c.name)} />
        <span className="row-name">
          {c.name}
          {c.phone && <small className="num">{c.phone}</small>}
        </span>
        <Balance value={balanceOf(state.txs, c.id)} className="row-amt" />
      </button>
    </li>
  )

  const openAdd = (prefill = '') => {
    setName(prefill)
    setPhone('')
    setAdding(true)
  }

  return (
    <>
      <header className="cloth" style={{ paddingBottom: 'var(--s-3)' }}>
        <div className="cloth-row">
          <button className="icon-btn" aria-label={t.back} onClick={() => back()}>
            <ArrowLeft size={22} />
          </button>
          <h1 className="cloth-title">{mode === 'udhaar' ? t.pickTitleUdhaar : t.pickTitleJama}</h1>
        </div>
      </header>

      <main className="scroll">
        <div className="page-ruled" style={{ paddingTop: 1, minHeight: '100%' }}>
        {query ? (
          <section aria-label="Search results">
            {matches.length > 0 ? (
              <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>{matches.map(row)}</ul>
            ) : (
              <div style={{ padding: 'var(--s-6) 0' }}>
                <p style={{ fontSize: 'var(--t-lg)', marginBottom: 'var(--s-3)' }}>{t.noMatch(q.trim())}</p>
                <button className="btn btn-outline btn-block" onClick={() => openAdd(q.trim())}>
                  <UserPlus size={20} aria-hidden /> {t.addAs(q.trim())}
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            <h2 className="section-h">{t.recentList}</h2>
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>{recent.map(row)}</ul>
            {frequent.length > 0 && (
              <>
                <h2 className="section-h">{t.frequent}</h2>
                <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>{frequent.map(row)}</ul>
              </>
            )}
            <h2 className="section-h">{t.everyone}</h2>
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>{rest.map(row)}</ul>
          </>
        )}
        </div>
      </main>

      {/* Search and "new customer" live at the bottom, inside thumb reach. */}
      <div className="dock">
        <div style={{ position: 'relative' }}>
          <Search size={20} aria-hidden style={{ position: 'absolute', left: 14, top: 16, color: 'var(--ink-3)' }} />
          <input
            className="input"
            style={{ paddingLeft: 44, paddingRight: 48 }}
            placeholder={t.search}
            aria-label={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            inputMode="search"
            enterKeyHint="search"
          />
          {q && (
            <button className="icon-btn" aria-label={t.close} onClick={() => setQ('')} style={{ position: 'absolute', right: 2, top: 2 }}>
              <X size={20} />
            </button>
          )}
        </div>
        <button className="btn btn-outline btn-block" onClick={() => openAdd()}>
          <UserPlus size={20} aria-hidden /> {t.newCustomer}
        </button>
      </div>

      <Sheet open={adding} onClose={() => setAdding(false)} label={t.newCustomer}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            const c = addCustomer(name, phone)
            setAdding(false)
            pick(c)
          }}
          style={{ display: 'grid', gap: 'var(--s-3)' }}
        >
          <h2>{t.newCustomer}</h2>
          <div className="field">
            <label htmlFor="nc-name">{t.name}</label>
            <input id="nc-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="nc-phone">{t.phoneOptional}</label>
            <input id="nc-phone" className="input num" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="off" />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={!name.trim()}>
            {t.saveCustomer}
          </button>
        </form>
      </Sheet>
    </>
  )
}
