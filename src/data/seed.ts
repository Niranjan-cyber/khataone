import type { KhataState, Tx } from '../lib/ledger'
import { rupees } from '../lib/money'

/** Fictional demo data. Every name and number here is invented. */
const PEOPLE: [string, string, string?][] = [
  ['c1', 'Suresh Patil', '98200 1XXXX'],
  ['c2', 'Meena Joshi', '98923 4XXXX'],
  ['c3', 'Rafiq Shaikh', '97690 2XXXX'],
  ['c4', 'Gopal Yadav'],
  ['c5', 'Anita Deshmukh', '90040 7XXXX'],
  ['c6', 'Lakshmi Iyer'],
  ['c7', 'Harpreet Singh', '99300 5XXXX'],
  ['c8', 'Sunita Pawar'],
  ['c9', 'Imran Khan'],
  ['c10', 'Kavita More'],
  ['c11', 'Ramesh Gupta'],
  ['c12', 'Pooja Kulkarni'],
]

// [customer, daysAgo, hour, type, rupees, note?, method?]
type Row = [string, number, number, Tx['type'], number, string?, Tx['method']?]
const ROWS: Row[] = [
  ['c1', 21, 10, 'udhaar', 600, 'Monthly ration'],
  ['c1', 14, 18, 'udhaar', 400, 'Oil, dal'],
  ['c1', 9, 11, 'jama', 500, undefined, 'cash'],
  ['c1', 3, 19, 'udhaar', 250, 'Grocery'],
  ['c1', 1, 9, 'udhaar', 250, 'Grocery'],
  ['c2', 12, 17, 'udhaar', 780, 'Atta, sugar'],
  ['c2', 0, 8, 'jama', 300, undefined, 'upi'],
  ['c3', 25, 12, 'udhaar', 1500, 'Monthly ration'],
  ['c3', 12, 16, 'jama', 600, undefined, 'cash'],
  ['c3', 6, 19, 'udhaar', 1100, 'Rice 25kg'],
  ['c3', 1, 8, 'udhaar', 140, 'Milk, bread'],
  ['c4', 20, 11, 'udhaar', 860, 'Atta 10kg, oil'],
  ['c4', 7, 18, 'udhaar', 460, 'Atta 10kg'],
  ['c4', 7, 19, 'jama', 460, undefined, 'upi'],
  ['c5', 10, 10, 'udhaar', 320, 'Biscuits, tea'],
  ['c5', 4, 17, 'jama', 320, undefined, 'cash'],
  ['c6', 16, 9, 'udhaar', 1240, 'Monthly ration'],
  ['c6', 2, 18, 'jama', 1000, undefined, 'upi'],
  ['c7', 8, 20, 'udhaar', 2350, 'Party order'],
  ['c8', 5, 11, 'udhaar', 190, 'Vegetables'],
  ['c8', 2, 12, 'udhaar', 85, 'Soap'],
  ['c9', 30, 10, 'udhaar', 3200, 'Monthly ration'],
  ['c9', 15, 19, 'jama', 1500, undefined, 'cash'],
  ['c10', 3, 9, 'udhaar', 520, 'Rava, ghee'],
  ['c11', 11, 18, 'udhaar', 975, 'Rice, dal'],
  ['c12', 2, 17, 'udhaar', 210, 'Snacks'],
]

const SALES: [number, number][] = [
  [0, 1840], [0, 960], [0, 1220], [0, 430],
]

export function seedState(now = Date.now()): KhataState {
  const at = (daysAgo: number, hour: number, minute = 0) => {
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    d.setHours(hour, minute, 0, 0)
    // Keep "today" entries in the past so the clock never shows future times.
    return Math.min(d.getTime(), now - 60_000 * (daysAgo === 0 ? 20 : 0))
  }
  const txs: Tx[] = ROWS.map(([cid, days, hour, type, r, note, method], i) => ({
    id: `seed-${i}`,
    type,
    customerId: cid,
    amount: rupees(r),
    note,
    method,
    createdAt: at(days, hour, (i * 7) % 60),
  }))
  SALES.forEach(([days, r], i) => txs.push({ id: `seed-sale-${i}`, type: 'sale', amount: rupees(r), createdAt: at(days, 8 + i, 12), method: 'cash' }))
  return {
    version: 1,
    shop: { name: 'Shree Ganesh Kirana', nameLocal: 'श्री गणेश किराना', upiDemo: 'shreeganesh.demo@upi' },
    customers: PEOPLE.map(([id, name, phone], i) => ({ id, name, phone, createdAt: now - (60 - i) * 864e5 })),
    txs,
  }
}
