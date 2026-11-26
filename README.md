# Bahi (बही): udhaar in one thumb

A digital khata for Indian kirana shopkeepers, made for **Pixelcraft 2026, brief DS-03**. It records credit (udhaar) and sales, keeps a ledger per customer, sends polite payment reminders and collects UPI payments, all one-handed behind a busy counter.

- **Live prototype:** https://bahi-kirana.vercel.app (desktop shows a presentation around the live phone app; mobile opens the app directly)
- **One-page case study:** https://bahi-kirana.vercel.app/case-study.html · PDF in `docs/Bahi-case-study.pdf`
- **Screens:** `screenshots/final/`

## The six screens
1. Shop overview: total baaki, today's sales and received, recent customers in thumb reach
2. Customer picker: recent, frequent, everyone; search and new customer at the bottom
3. Express udhaar entry: keypad, quick amounts, live new-balance preview, "Save ₹250 udhaar", Undo
4. Customer ledger: dated entries with running balance; wrong entries are struck through, not deleted
5. Payment reminder: editable amount, English/हिंदी/मराठी, WhatsApp or SMS (opens the app, never sends on its own)
6. UPI collection: full or part payment, demo QR, pending/success/failed/cancelled, or cash

**Core flow:** Home → tap customer → 2 5 0 → Save. That's 5 taps.

## Honest status
- UPI, payment links and messaging are **simulated** and labelled DEMO. All names and numbers are fictional.
- Not yet tested with real shopkeepers; see `docs/TEST_PLAN.md` for the protocol.

## Run it
```bash
npm install
npm run dev          # http://localhost:5173
npm test             # ledger maths unit tests
npm run e2e          # Playwright flows + axe accessibility checks
npm run build
```

## Stack
React 19, Vite, TypeScript, Motion, Lucide icons, qrcode.react. Data lives on the device (localStorage), and money is stored as integer paise; balances are always derived from the transaction list. CI runs on GitHub Actions (lint, tests, build, Impeccable design detector, Playwright), and Vercel deploys every push to `main`.

## Credits and AI use
Fonts: Martel and Hind (SIL OFL). Icons: Lucide (ISC). Design process: Impeccable (pbakaus/impeccable) and Taste Skill. Built with Claude (Anthropic) as the coding and design-critique assistant, as disclosed in the case study under competition rule 5.
