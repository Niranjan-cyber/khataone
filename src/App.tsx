import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { ToastProvider, useToast } from './components/Toast'
import { I18nProvider, useT } from './lib/i18n'
import { RouterProvider, toHash, useRouter, type Route } from './lib/router'
import { Collect } from './screens/Collect'
import { Entry } from './screens/Entry'
import { Home } from './screens/Home'
import { Ledger } from './screens/Ledger'
import { Picker } from './screens/Picker'
import { Remind } from './screens/Remind'
import { Showcase } from './showcase/Showcase'
import { KhataProvider } from './store/khata'

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <Home />
    case 'pick':
      return <Picker mode={route.mode} />
    case 'entry':
      return <Entry mode={route.mode} cid={route.cid} />
    case 'ledger':
      return <Ledger cid={route.cid} />
    case 'remind':
      return <Remind cid={route.cid} />
    case 'collect':
      return <Collect cid={route.cid} />
  }
}

function useOnline() {
  const [on, setOn] = useState(navigator.onLine)
  useEffect(() => {
    const a = () => setOn(true)
    const b = () => setOn(false)
    window.addEventListener('online', a)
    window.addEventListener('offline', b)
    return () => {
      window.removeEventListener('online', a)
      window.removeEventListener('offline', b)
    }
  }, [])
  return on
}

/** The phone app itself. Screens slide like pages turning in a book, fast. */
export function PhoneApp() {
  const { route, dir } = useRouter()
  const { t } = useT()
  const online = useOnline()
  const { dismiss } = useToast()
  // An Undo belongs to the screen it was offered on: moving forward to a new task clears it.
  useEffect(() => {
    if (dir > 0) dismiss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route])
  return (
    <div className="app">
      {!online && <div className="offline">{t.offline}</div>}
      <div style={{ position: 'relative', flex: 1 }}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={toHash(route)}
            className="screen"
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '28%' : '-12%', opacity: d > 0 ? 0 : 1 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-12%' : '28%', opacity: d > 0 ? 1 : 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: dir > 0 ? 2 : 1 }}
          >
            <Screen route={route} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Shell() {
  const wide = useWide()
  return wide ? (
    <Showcase>
      <ToastProvider>
        <PhoneApp />
      </ToastProvider>
    </Showcase>
  ) : (
    <ToastProvider>
      <PhoneApp />
    </ToastProvider>
  )
}

function useWide() {
  const q = '(min-width: 960px)'
  const [wide, setWide] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <I18nProvider>
        <KhataProvider>
          <RouterProvider>
            <Shell />
          </RouterProvider>
        </KhataProvider>
      </I18nProvider>
    </MotionConfig>
  )
}
