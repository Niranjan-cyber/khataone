# Project status: Bahi (Pixelcraft 2026, DS-03)

_Last updated: 27 Nov 2026_

## Done
- **Setup:** React/Vite/TS repo; Impeccable 4.11.1 installed with its design-checker hook; Taste Skill 2.5.1 present. Public GitHub repo (Niranjan-cyber/khataone) with Actions CI. Vercel auto-deploys `main` to https://bahi-kirana.vercel.app.
- **Direction:** three directions sketched (home + keypad each) through Impeccable's concept roll. The user chose **Bahi, the red-cloth khata**. The contract is in `.impeccable/surfaces/src-app-tsx.md`.
- **Name:** renamed KhataOne → **Bahi** because khataone.vercel.app is an unrelated live product.
- **Six screens built** with EN/HI/MR, offline persistence, undo, cancel-entry, partial/full payments, simulated UPI states, and a WhatsApp/SMS reminder.
- **Desktop showcase:** headline, guided ₹250 scenario with live step ticks and a demo stopwatch, jump links to all six screens, language switch, reset.
- **Case study:** one A4 page (`public/case-study.html`, `docs/Bahi-case-study.pdf`).

## Evidence
| Check | Result |
|---|---|
| Unit tests (ledger maths, duplicates, zero/negative) | 11/11 pass |
| Playwright flows (3-tap udhaar + undo, double tap, zero, new customer + reload, part/full UPI + cash, cancel entry, reminder languages) | 7/7 pass |
| axe-core WCAG 2.2 AA on six screens | 0 serious/critical |
| Impeccable first-viewport (390, 1440) | all checks ok |
| Impeccable finish review | round 1: 8 material fixes; round 2: 3 regressions; final verdict **ship** (covers scored fixes) |

Bugs found by testing and fixed: a payment was subtracted twice in "baaki after"; an `aria-label` on a span; overflow at 320px; a keypad clipped on short screens; a stale Undo toast leaking to the next screen.

## Not done / risks
- **No human usability testing.** The under-10s claim is a design target (5 taps). The protocol is in `docs/TEST_PLAN.md`.
- Hindi and Marathi copy was written without a native-speaker review.
- UPI and messaging are simulated.
- The repo name is still `khataone`; renaming it on GitHub is optional.
- The detector keeps one deliberate "side-tab" warning (the gold lip on the primary button, a world device).

## Next
1. Submit: the live link plus the case study PDF on the Pixelcraft page.
2. If time allows: time 3–5 shopkeepers and update the case study table.
3. Round 2 (problems revealed 28 Nov, 12:00 IST): reuse the system in DESIGN.md.
