import { describe, expect, it } from 'vitest'
import { balanceOf, ledgerRows, todayTotals, totalOutstanding, type KhataState, type Tx } from '../../src/lib/ledger'
import { bufferToPaise, formatINR, pressKey, rupees } from '../../src/lib/money'
import { reducer } from '../../src/store/khata'
import { seedState } from '../../src/data/seed'

const tx = (p: Partial<Tx>): Tx => ({ id: Math.random().toString(36), type: 'udhaar', customerId: 'a', amount: rupees(100), createdAt: Date.now(), ...p })
const base = (): KhataState => ({ version: 1, shop: { name: 'S', nameLocal: 'S', upiDemo: 'x@upi' }, customers: [{ id: 'a', name: 'A', createdAt: 0 }], txs: [] })

describe('money', () => {
  it('formats with Indian grouping', () => {
    expect(formatINR(rupees(1250))).toBe('₹1,250')
    expect(formatINR(rupees(123456))).toBe('₹1,23,456')
    expect(formatINR(rupees(999999))).toBe('₹9,99,999')
    expect(formatINR(13750)).toBe('₹137.50')
  })
  it('keypad never exceeds 6 digits and strips leading zeros', () => {
    let b = ''
    for (const k of ['0', '0', '1', '3', '7']) b = pressKey(b, k)
    expect(b).toBe('137')
    expect(bufferToPaise(b)).toBe(13700)
    b = '999999'
    expect(pressKey(b, '9')).toBe('999999')
    expect(pressKey('12', 'back')).toBe('1')
  })
})

describe('ledger maths', () => {
  it('credit increases, payment decreases, sales never touch balance', () => {
    const txs = [tx({ amount: rupees(500) }), tx({ type: 'jama', amount: rupees(200) }), tx({ type: 'sale', customerId: undefined, amount: rupees(999) })]
    expect(balanceOf(txs, 'a')).toBe(rupees(300))
  })
  it('partial then full repayment reaches zero', () => {
    const txs = [tx({ amount: rupees(1250) }), tx({ type: 'jama', amount: rupees(500) }), tx({ type: 'jama', amount: rupees(750) })]
    expect(balanceOf(txs, 'a')).toBe(0)
  })
  it('voided entries are excluded but stay in the history', () => {
    const txs = [tx({ amount: rupees(250) }), tx({ amount: rupees(2500), voidedAt: 1 })]
    expect(balanceOf(txs, 'a')).toBe(rupees(250))
    expect(ledgerRows(txs, 'a')).toHaveLength(2)
  })
  it('running balances are ordered oldest to newest', () => {
    const txs = [tx({ amount: rupees(100), createdAt: 2 }), tx({ amount: rupees(50), createdAt: 1 }), tx({ type: 'jama', amount: rupees(30), createdAt: 3 })]
    expect(ledgerRows(txs, 'a').map((r) => r.running)).toEqual([5000, 15000, 12000])
  })
  it('today totals count udhaar as a sale and jama as received', () => {
    const now = Date.now()
    const t = todayTotals([tx({ amount: 25000, createdAt: now }), tx({ type: 'sale', customerId: undefined, amount: 10000, createdAt: now }), tx({ type: 'jama', amount: 5000, createdAt: now })], now)
    expect(t).toMatchObject({ sales: 35000, udhaar: 25000, received: 5000 })
  })
  it('seed data is internally consistent', () => {
    const s = seedState()
    const { total } = totalOutstanding(s)
    expect(total).toBe(s.customers.reduce((n, c) => n + Math.max(0, balanceOf(s.txs, c.id)), 0))
    expect(balanceOf(s.txs, 'c1')).toBe(rupees(1000))
  })
})

describe('reducer safety', () => {
  it('ignores duplicate submissions of the same entry', () => {
    const t = tx({ id: 'same' })
    let s = reducer(base(), { type: 'add-tx', tx: t })
    s = reducer(s, { type: 'add-tx', tx: t })
    expect(s.txs).toHaveLength(1)
  })
  it('rejects zero, negative and fractional-paise amounts', () => {
    for (const amount of [0, -100, 10.5]) expect(reducer(base(), { type: 'add-tx', tx: tx({ amount }) }).txs).toHaveLength(0)
  })
  it('undo removes exactly the entry', () => {
    let s = reducer(base(), { type: 'add-tx', tx: tx({ id: 'k' }) })
    s = reducer(s, { type: 'add-tx', tx: tx({ id: 'j' }) })
    s = reducer(s, { type: 'undo-tx', id: 'k' })
    expect(s.txs.map((x) => x.id)).toEqual(['j'])
  })
})
