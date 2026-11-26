import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'pick'; mode: 'udhaar' | 'jama' }
  | { name: 'entry'; mode: 'udhaar' | 'jama' | 'sale'; cid?: string }
  | { name: 'ledger'; cid: string }
  | { name: 'remind'; cid: string }
  | { name: 'collect'; cid: string }

export function parse(hash: string): Route {
  const [name, a, b] = hash.replace(/^#\/?/, '').split('/')
  switch (name) {
    case 'pick':
      return { name: 'pick', mode: a === 'jama' ? 'jama' : 'udhaar' }
    case 'entry':
      return { name: 'entry', mode: a === 'jama' || a === 'sale' ? a : 'udhaar', cid: b || undefined }
    case 'ledger':
    case 'remind':
    case 'collect':
      return a ? { name, cid: a } : { name: 'home' }
    default:
      return { name: 'home' }
  }
}

export function toHash(r: Route): string {
  switch (r.name) {
    case 'home':
      return '#/'
    case 'pick':
      return `#/pick/${r.mode}`
    case 'entry':
      return `#/entry/${r.mode}${r.cid ? `/${r.cid}` : ''}`
    default:
      return `#/${r.name}/${r.cid}`
  }
}

const DEPTH: Record<Route['name'], number> = { home: 0, pick: 1, ledger: 1, entry: 2, remind: 2, collect: 2 }

interface RouterCtx {
  route: Route
  /** +1 forward, -1 back: drives the slide direction. */
  dir: number
  go: (r: Route, opts?: { replace?: boolean }) => void
  back: (fallback?: Route) => void
}
const Ctx = createContext<RouterCtx | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parse(location.hash))
  const [dir, setDir] = useState(1)
  const depthRef = useRef(DEPTH[route.name])
  /** How many in-app entries we pushed, so Back never leaves the app. */
  const stack = useRef(0)

  useEffect(() => {
    const on = () => {
      const r = parse(location.hash)
      const d = DEPTH[r.name]
      setDir(d >= depthRef.current ? 1 : -1)
      depthRef.current = d
      setRoute(r)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = useCallback((r: Route, opts?: { replace?: boolean }) => {
    const h = toHash(r)
    if (opts?.replace) {
      history.replaceState(null, '', h)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    } else {
      stack.current += 1
      location.hash = h
    }
  }, [])

  const back = useCallback(
    (fallback: Route = { name: 'home' }) => {
      if (stack.current > 0) {
        stack.current -= 1
        history.back()
      } else go(fallback, { replace: true })
    },
    [go],
  )

  return <Ctx.Provider value={{ route, dir, go, back }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useRouter outside RouterProvider')
  return v
}
