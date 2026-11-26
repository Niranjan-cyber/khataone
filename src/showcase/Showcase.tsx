import { ArrowUpRight, Check, RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LANGS, useT } from '../lib/i18n'
import { useRouter, type Route } from '../lib/router'
import { useKhata } from '../store/khata'

const SCREENS: { n: string; label: string; route: Route }[] = [
  { n: '1', label: 'Shop overview', route: { name: 'home' } },
  { n: '2', label: 'Pick a customer', route: { name: 'pick', mode: 'udhaar' } },
  { n: '3', label: 'Express udhaar entry', route: { name: 'entry', mode: 'udhaar', cid: 'c1' } },
  { n: '4', label: 'Customer khata', route: { name: 'ledger', cid: 'c1' } },
  { n: '5', label: 'Payment reminder', route: { name: 'remind', cid: 'c1' } },
  { n: '6', label: 'UPI collection', route: { name: 'collect', cid: 'c1' } },
]

/** Watches the live prototype and ticks off the judge's guided scenario. */
function useScenario() {
  const { route } = useRouter()
  const { state } = useKhata()
  const startCount = useRef(state.txs.length)
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [t0, setT0] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)

  useEffect(() => {
    // Timer starts on the first tap away from Home, stops when the udhaar is saved.
    if (route.name !== 'home' && t0 === null && elapsed === null) setT0(performance.now())
    setSeen((s) => ({ ...s, [route.name]: true }))
  }, [route, t0, elapsed])

  const fresh = state.txs.slice(startCount.current)
  const saved = fresh.some((x) => x.type === 'udhaar' && !x.voidedAt)
  const collected = fresh.some((x) => x.type === 'jama')

  useEffect(() => {
    if (saved && t0 !== null && elapsed === null) setElapsed((performance.now() - t0) / 1000)
  }, [saved, t0, elapsed])

  const reset = () => {
    startCount.current = state.txs.length
    setSeen({})
    setT0(null)
    setElapsed(null)
  }

  return {
    steps: [
      { label: 'Tap a customer on the home screen (or “Add udhaar”)', done: !!seen.entry },
      { label: 'Type 250 and save the udhaar', done: saved },
      { label: 'Open their khata and see the new balance', done: saved && !!seen.ledger },
      { label: 'Preview a polite reminder', done: !!seen.remind },
      { label: 'Collect by UPI or cash (simulated)', done: collected },
    ],
    elapsed,
    reset,
  }
}

export function Showcase({ children }: { children: ReactNode }) {
  const { go } = useRouter()
  const { resetDemo } = useKhata()
  const { lang, setLang } = useT()
  const { steps, elapsed, reset } = useScenario()

  return (
    <div className="sc" data-enter>
      <div className="sc-wrap">
        <section className="sc-left">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="sc-brand">
              <span className="sc-mark" aria-hidden>
                ₹
              </span>
              Bahi <span className="sc-brand-dv">बही</span>
            </p>
            <h1 className="sc-h1">
              Less time on <em>hisaab</em>.
              <br />
              More time on <em>dukaan</em>.
            </h1>
            <p className="sc-lede">
              A digital khata for kirana shopkeepers. A regular says “₹250 khate mein daal dena” and walks off. With one thumb, the shopkeeper picks the
              customer, types the amount and saves. No form, no confirmation screen, and an Undo if they slip.
            </p>
          </motion.div>

          <motion.div className="sc-task" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="sc-h2">Try it: Suresh Patil buys groceries worth ₹250 on credit.</h2>
            <ol className="sc-steps">
              {steps.map((s, i) => (
                <li key={i} className={s.done ? 'is-done' : ''}>
                  <span className="sc-tick" aria-hidden>
                    {s.done ? <Check size={16} strokeWidth={3} /> : i + 1}
                  </span>
                  <span>
                    {s.label}
                    {s.done && <span className="sr-only"> (done)</span>}
                  </span>
                </li>
              ))}
            </ol>
            <p className="sc-timer num" aria-live="polite">
              {elapsed !== null ? (
                <>
                  Udhaar recorded in <b>{elapsed.toFixed(1)} s</b>, from the home screen to saved.
                </>
              ) : (
                'A stopwatch starts on your first tap and stops when the udhaar is saved.'
              )}
              <small>Demo stopwatch on a desktop mouse, not a usability study with shopkeepers.</small>
            </p>
          </motion.div>
        </section>

        <div className="sc-phone-col">
          <div className="sc-phone" role="region" aria-label="Bahi app prototype">
            {children}
          </div>
          <div className="sc-controls">
            <div className="seg sc-seg" role="group" aria-label="App language">
              {LANGS.map((l) => (
                <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>
                  {l.label}
                </button>
              ))}
            </div>
            <button
              className="sc-reset"
              onClick={() => {
                resetDemo()
                reset()
                go({ name: 'home' }, { replace: true })
              }}
            >
              <RotateCcw size={16} aria-hidden /> Reset demo
            </button>
          </div>
        </div>

        <aside className="sc-right">
          <h2 className="sc-h3">The six screens</h2>
          <ol className="sc-screens">
            {SCREENS.map((s) => (
              <li key={s.n}>
                <button onClick={() => go(s.route)}>
                  <span className="num">{s.n}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
          <h2 className="sc-h3">What is different</h2>
          <ul className="sc-diff">
            <li>
              <b>Customer first, then amount.</b> Recent customers sit in thumb reach on the home screen. The keypad opens already addressed to them.
            </li>
            <li>
              <b>Undo instead of “Are you sure?”</b> The save button repeats the amount; a six-second Undo follows. Wrong old entries are struck through,
              never deleted.
            </li>
            <li>
              <b>Never just a colour.</b> Every entry carries a word (Udhaar / Jama), an arrow and a colour, plus the running balance.
            </li>
            <li>
              <b>Reminders that keep the relationship.</b> “Please pay whenever convenient”, in English, Hindi or Marathi.
            </li>
          </ul>
          <a className="sc-case" href="/case-study.html" target="_blank" rel="noopener">
            Read the one-page case study <ArrowUpRight size={18} aria-hidden />
          </a>
          <p className="sc-foot">
            Pixelcraft 2026 · DS-03 concept. All names, numbers and payments are fictional; UPI and messaging are simulated.
          </p>
        </aside>
      </div>
    </div>
  )
}
