import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Customer, KhataState, Tx } from '../lib/ledger'
import { seedState } from '../data/seed'

const KEY = 'bahi.v1'

type Action =
  | { type: 'add-tx'; tx: Tx }
  | { type: 'undo-tx'; id: string }
  | { type: 'void-tx'; id: string; at: number }
  | { type: 'add-customer'; customer: Customer }
  | { type: 'reminded'; customerId: string; at: number }
  | { type: 'reset'; state: KhataState }

export function reducer(state: KhataState, a: Action): KhataState {
  switch (a.type) {
    case 'add-tx':
      // Idempotent: a second tap, a double submit or a re-render never writes the same entry twice.
      if (state.txs.some((t) => t.id === a.tx.id)) return state
      if (!Number.isInteger(a.tx.amount) || a.tx.amount <= 0) return state
      return { ...state, txs: [...state.txs, a.tx] }
    case 'undo-tx':
      return { ...state, txs: state.txs.filter((t) => t.id !== a.id) }
    case 'void-tx':
      return { ...state, txs: state.txs.map((t) => (t.id === a.id && !t.voidedAt ? { ...t, voidedAt: a.at } : t)) }
    case 'add-customer':
      if (state.customers.some((c) => c.id === a.customer.id)) return state
      return { ...state, customers: [...state.customers, a.customer] }
    case 'reminded':
      return { ...state, customers: state.customers.map((c) => (c.id === a.customerId ? { ...c, lastRemindedAt: a.at } : c)) }
    case 'reset':
      return a.state
  }
}

function load(): KhataState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as KhataState
      if (parsed?.version === 1 && Array.isArray(parsed.txs)) return parsed
    }
  } catch {
    /* corrupted or blocked storage: fall back to demo data */
  }
  return seedState()
}

interface Ctx {
  state: KhataState
  addTx: (tx: Tx) => void
  undoTx: (id: string) => void
  voidTx: (id: string) => void
  addCustomer: (name: string, phone?: string) => Customer
  markReminded: (customerId: string) => void
  resetDemo: () => void
  customer: (id: string | undefined) => Customer | undefined
}

const KhataCtx = createContext<Ctx | null>(null)

export const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export function KhataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage full or unavailable: the session keeps working in memory */
    }
  }, [state])

  const addCustomer = useCallback((name: string, phone?: string) => {
    const c: Customer = { id: newId('c'), name: name.trim(), phone: phone?.trim() || undefined, createdAt: Date.now() }
    dispatch({ type: 'add-customer', customer: c })
    return c
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      state,
      addTx: (tx) => dispatch({ type: 'add-tx', tx }),
      undoTx: (id) => dispatch({ type: 'undo-tx', id }),
      voidTx: (id) => dispatch({ type: 'void-tx', id, at: Date.now() }),
      addCustomer,
      markReminded: (customerId) => dispatch({ type: 'reminded', customerId, at: Date.now() }),
      resetDemo: () => dispatch({ type: 'reset', state: seedState() }),
      customer: (id) => state.customers.find((c) => c.id === id),
    }),
    [state, addCustomer],
  )

  return <KhataCtx.Provider value={value}>{children}</KhataCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useKhata() {
  const v = useContext(KhataCtx)
  if (!v) throw new Error('useKhata outside KhataProvider')
  return v
}
