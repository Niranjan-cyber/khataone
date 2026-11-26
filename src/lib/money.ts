/** All money is integer paise. ₹1 = 100 paise. */
export type Paise = number

export const rupees = (r: number): Paise => Math.round(r * 100)

const grouping = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
const groupingFine = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** ₹1,23,456 — Indian digit grouping; paise shown only when non-zero. */
export function formatINR(p: Paise, opts: { sign?: boolean } = {}): string {
  const abs = Math.abs(p)
  const body = abs % 100 === 0 ? grouping.format(abs / 100) : groupingFine.format(abs / 100)
  const sign = p < 0 ? '−' : opts.sign && p > 0 ? '+' : ''
  return `${sign}₹${body}`
}

/** Largest amount a single entry accepts: ₹9,99,999. */
export const MAX_ENTRY: Paise = rupees(999_999)

/** Keypad buffer (whole rupees as a digit string) → paise. */
export function bufferToPaise(buf: string): Paise {
  if (!buf) return 0
  return rupees(Number(buf))
}

/** Apply a keypad key to a rupee digit buffer. Returns the same buffer when the key would overflow. */
export function pressKey(buf: string, key: string): string {
  if (key === 'back') return buf.slice(0, -1)
  if (key === 'clear') return ''
  const next = (buf === '0' ? '' : buf) + key
  const trimmed = next.replace(/^0+/, '')
  if (trimmed.length > 6) return buf
  return trimmed
}
