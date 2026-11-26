/** Keep only whole-rupee digits typed into a text field, max 6 digits. */
export function pressKeyless(v: string): string {
  return v.replace(/\D/g, '').replace(/^0+/, '').slice(0, 6)
}
