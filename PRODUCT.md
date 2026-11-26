# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

(Mobile-first web app, used on budget Android phones. A desktop presentation wraps the same app for competition judges.)

## Stack

React + Vite + TypeScript, Motion for interaction, local persistence (localStorage / IndexedDB), deployed on Vercel with GitHub Actions CI. Chosen by the user's brief.

## Users

**Primary:** owners of small kirana (neighbourhood grocery) stores in India. Many are first-time or low-confidence smartphone users, some older, many most comfortable in Hindi or a regional language (Marathi supported). They use cheap Android phones, often with unreliable internet.

**Situation:** standing behind a busy counter, often serving several customers at once, one hand holding goods or cash, the phone in the other. A regular customer says "Bhaiya, ₹250 khate mein daal dena" (put ₹250 on my account) and walks away.

**Job:** record credit (udhaar) accurately in seconds without breaking service; later see who owes what, remind people politely, and collect money by UPI or cash.

**Secondary audience:** Pixelcraft 2026 judges evaluating the prototype on desktop.

## Product Purpose

KhataOne replaces the paper udhaar notebook. It records credit and sales, keeps a ledger per customer, sends respectful payment reminders, and collects UPI payments.

Success: an existing customer's credit is recorded from the home screen in under 10 seconds with one hand, and every balance on every screen is correct.

## Positioning

Built around one move: **customer → amount → save**, with no form, no confirmation screen and an undo afterwards. Competing khata apps put credit entry behind a customer page and a multi-field form. KhataOne puts recent customers and the keypad within thumb reach from the first screen.

Brand line: "One hand. One glance. One transaction." Headline: "Less time on hisaab. More time on dukaan."

## Operating Context

- The counter: bright daylight or a single tube light, a noisy shop, interruptions.
- The phone is used one-handed, right or left thumb, sometimes with wet or dusty fingers.
- The paper khata: one page per customer, dated entries, running balances, a familiar ritual.
- Money vocabulary the users already speak: udhaar (credit given), jama / payment received, baaki (balance due), hisaab (accounts), khata (ledger), dukaan (shop).
- WhatsApp is the default way to message customers. UPI QR codes (PhonePe, GPay, Paytm) are on every counter.

## Capabilities and Constraints

Must demonstrate (competition brief DS-03):
- Adding a credit entry in under 10 seconds.
- A customer ledger.
- A payment-reminder flow.
Also: recording sales, accepting UPI payments.

Six primary screens: shop overview, customer picker, express credit entry, customer ledger, payment reminder, UPI collection. Other states live in sheets and overlays.

Constraints:
- Money is stored as integer paise; balances are derived from the transaction list, never stored separately.
- Undo or reversal instead of confirmation dialogs. Duplicate taps must never create duplicate entries.
- Works offline: everything is stored on the device.
- UPI and messaging are **simulated** and clearly labelled DEMO. No real UPI IDs, merchant credentials or automatic message sending.
- English, Hindi and Marathi.

Out of scope: inventory, analytics dashboards, chatbots, rewards, login.

## Brand Commitments

- Name: KhataOne. Demo shop: Shree Ganesh Kirana.
- Reminder tone: respectful and relationship-preserving ("Namaste Suresh ji … please pay whenever convenient"). Never collection-agency language.
- Original identity. The references (Wise, Cash App, Square, CRED, Linear, Monzo, PhonePe Business) set the craft level only: no copied branding, assets or layouts.

## Evidence on Hand

- No real user research, interviews or usability tests exist. Testing with shopkeepers is not possible before submission. Do not invent findings, quotes or metrics; label desk research as desk research.
- All customer data is fictional demo data.
- AI tools must be disclosed in the case study (competition rule 5).

## Product Principles

1. Speed of credit entry beats everything else on the screen.
2. Money meaning is never ambiguous: direction is shown with a word, an icon and a colour together.
3. Everything frequent sits in the bottom half, within thumb reach.
4. Recognition over recall: faces, names and recent amounts instead of searching and typing.
5. Respect: for the shopkeeper's time and for the customer relationship.

## Accessibility & Inclusion

WCAG 2.2 AA contrast; touch targets of at least 48px; large type for amounts and names; no meaning carried by colour alone; works for older and first-time users; full Hindi and Marathi text without overflow; reduced-motion support.
