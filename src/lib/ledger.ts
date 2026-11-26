import type { Paise } from './money'

export type TxType = 'udhaar' | 'jama' | 'sale'
export type PayMethod = 'cash' | 'upi'

export interface Customer {
  id: string
  name: string
  phone?: string
  createdAt: number
  lastRemindedAt?: number
}

export interface Tx {
  /** Stable id, generated when the entry screen opens: doubles as an idempotency key. */
  id: string
  type: TxType
  customerId?: string
  amount: Paise
  note?: string
  method?: PayMethod
  /** Simulated UPI payments are flagged so they are never mistaken for real ones. */
  demo?: boolean
  createdAt: number
  /** Set when the shopkeeper cancels a wrong entry. The entry stays visible, struck through. */
  voidedAt?: number
}

export interface KhataState {
  version: 1
  shop: { name: string; nameLocal: string; upiDemo: string }
  customers: Customer[]
  txs: Tx[]
}

const live = (t: Tx) => !t.voidedAt

/** Balance owed by a customer: udhaar adds, jama subtracts. Sales never touch balances. */
export function balanceOf(txs: Tx[], customerId: string): Paise {
  let b = 0
  for (const t of txs) {
    if (t.customerId !== customerId || !live(t)) continue
    if (t.type === 'udhaar') b += t.amount
    else if (t.type === 'jama') b -= t.amount
  }
  return b
}

export function totalOutstanding(state: KhataState): { total: Paise; owing: number } {
  let total = 0
  let owing = 0
  for (const c of state.customers) {
    const b = balanceOf(state.txs, c.id)
    if (b > 0) {
      total += b
      owing += 1
    }
  }
  return { total, owing }
}

export const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString()

export function todayTotals(txs: Tx[], now = Date.now()) {
  let cashSales = 0
  let udhaar = 0
  let received = 0
  for (const t of txs) {
    if (!live(t) || !sameDay(t.createdAt, now)) continue
    if (t.type === 'sale') cashSales += t.amount
    else if (t.type === 'udhaar') udhaar += t.amount
    else if (t.type === 'jama') received += t.amount
  }
  return { sales: cashSales + udhaar, cashSales, udhaar, received }
}

export interface LedgerRow {
  tx: Tx
  /** Balance after this entry (voided entries carry the balance unchanged). */
  running: Paise
}

/** Oldest → newest with running balance. */
export function ledgerRows(txs: Tx[], customerId: string): LedgerRow[] {
  const rows: LedgerRow[] = []
  let b = 0
  const mine = txs.filter((t) => t.customerId === customerId).sort((a, z) => a.createdAt - z.createdAt)
  for (const t of mine) {
    if (live(t)) b += t.type === 'udhaar' ? t.amount : t.type === 'jama' ? -t.amount : 0
    rows.push({ tx: t, running: b })
  }
  return rows
}

export function lastOf(txs: Tx[], customerId: string, type: TxType): Tx | undefined {
  let found: Tx | undefined
  for (const t of txs) {
    if (t.customerId === customerId && t.type === type && live(t) && (!found || t.createdAt > found.createdAt)) found = t
  }
  return found
}

/** Customers ordered by most recent activity. */
export function recentCustomers(state: KhataState): Customer[] {
  const last = new Map<string, number>()
  for (const t of state.txs) if (t.customerId) last.set(t.customerId, Math.max(last.get(t.customerId) ?? 0, t.createdAt))
  return [...state.customers].sort((a, b) => (last.get(b.id) ?? b.createdAt) - (last.get(a.id) ?? a.createdAt))
}

/** Customers with the most entries in the last 30 days. */
export function frequentCustomers(state: KhataState, now = Date.now()): Customer[] {
  const count = new Map<string, number>()
  for (const t of state.txs) {
    if (t.customerId && now - t.createdAt < 30 * 864e5) count.set(t.customerId, (count.get(t.customerId) ?? 0) + 1)
  }
  return [...state.customers].sort((a, b) => (count.get(b.id) ?? 0) - (count.get(a.id) ?? 0))
}

/** Suggested quick amounts: the customer's usual amounts first, then round values. */
export function quickAmounts(txs: Tx[], customerId: string | undefined, type: TxType): Paise[] {
  const base = [5000, 10000, 20000, 50000]
  if (!customerId) return base
  const freq = new Map<number, number>()
  for (const t of txs) if (t.customerId === customerId && t.type === type && live(t)) freq.set(t.amount, (freq.get(t.amount) ?? 0) + 1)
  const usual = [...freq.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([a]) => a).slice(0, 2)
  const merged = [...usual, ...base.filter((b) => !usual.includes(b))]
  return merged.slice(0, 4).sort((a, b) => a - b)
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}
