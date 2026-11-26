import { ArrowLeft, MessageSquareText, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '../components/Toast'
import { pressKeyless } from './util'
import { LANGS, reminderText, useT, type Lang } from '../lib/i18n'
import { balanceOf } from '../lib/ledger'
import { formatINR, rupees } from '../lib/money'
import { useRouter } from '../lib/router'
import { useKhata } from '../store/khata'

export function Remind({ cid }: { cid: string }) {
  const { state, customer, markReminded } = useKhata()
  const { t, lang } = useT()
  const { back } = useRouter()
  const { show } = useToast()
  const c = customer(cid)
  const bal = c ? balanceOf(state.txs, c.id) : 0

  const [msgLang, setMsgLang] = useState<Lang>(lang === 'en' ? 'hi' : lang)
  const [custom, setCustom] = useState<string>('')
  const [link, setLink] = useState(true)

  useEffect(() => setCustom(''), [cid])
  if (!c) return null

  const ask = custom ? Math.min(rupees(Number(custom)), bal) : bal
  // Readable demo link on a reserved example domain; a real build would use a payment provider's short link.
  const upiLink = `pay.example/shree-ganesh/${ask / 100}`
  const text = reminderText(msgLang, {
    name: c.name,
    shop: state.shop.name,
    shopLocal: msgLang === 'en' ? state.shop.name : state.shop.nameLocal,
    amount: formatINR(ask),
    link: link ? upiLink : undefined,
  })

  const send = (via: 'whatsapp' | 'sms') => {
    const enc = encodeURIComponent(text)
    const href = via === 'whatsapp' ? `https://wa.me/?text=${enc}` : `sms:${c.phone?.includes('X') ? '' : c.phone ?? ''}?body=${enc}`
    window.open(href, '_blank', 'noopener')
    markReminded(c.id)
    show({ title: t.remindedNow })
  }

  return (
    <>
      <header className="cloth" style={{ paddingBottom: 'var(--s-3)' }}>
        <div className="cloth-row">
          <button className="icon-btn" aria-label={t.back} onClick={() => back()}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="cloth-title">{t.remindTitle}</h1>
            <p className="cloth-sub num">
              {c.name} · {t.baaki} {formatINR(bal)}
            </p>
          </div>
        </div>
      </header>

      <main className="scroll">
        <div className="page-ruled" style={{ display: 'grid', gap: 'var(--s-5)', alignContent: 'start' }}>
        {bal <= 0 ? (
          <p>{t.nothingDue}</p>
        ) : (
          <>
            <section className="field">
              <label htmlFor="ask">{t.amountToAsk}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--s-2)' }}>
                <button className="chip num" aria-pressed={!custom} onClick={() => setCustom('')}>
                  {t.fullBaaki} {formatINR(bal)}
                </button>
                <input
                  id="ask"
                  className="input num"
                  inputMode="numeric"
                  placeholder="₹ …"
                  value={custom}
                  onChange={(e) => setCustom(pressKeyless(e.target.value))}
                />
              </div>
            </section>

            <section className="field">
              <span id="lang-l" style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--ink-2)' }}>
                {t.language}
              </span>
              <div className="seg" role="group" aria-labelledby="lang-l">
                {LANGS.map((l) => (
                  <button key={l.id} aria-pressed={msgLang === l.id} onClick={() => setMsgLang(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </section>

            <section aria-label={t.preview}>
              <p className="label" style={{ marginBottom: 'var(--s-2)' }}>
                {t.preview}
              </p>
              <div className="chat">
                <div className="bubble" lang={msgLang}>
                  {text.split('\n').map((line, i) => (
                    <p key={i}>{line || ' '}</p>
                  ))}
                  <span className="bubble-meta">{t.demo}</span>
                </div>
              </div>
              <label className="check">
                <input type="checkbox" checked={link} onChange={(e) => setLink(e.target.checked)} />
                {t.includeLink} <span className="demo-badge">{t.demo}</span>
              </label>
            </section>
          </>
        )}
        </div>
      </main>

      {bal > 0 && (
        <div className="dock">
          <p style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)', textAlign: 'center' }}>{t.opensApp('WhatsApp / SMS')}</p>
          <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
            <button className="btn btn-primary" style={{ minHeight: 'var(--tap-lg)' }} onClick={() => send('whatsapp')}>
              <Send size={20} aria-hidden /> {t.sendWhatsApp}
            </button>
            <button className="btn btn-outline" onClick={() => send('sms')}>
              <MessageSquareText size={20} aria-hidden /> {t.sendSms}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
