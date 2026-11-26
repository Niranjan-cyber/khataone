---
name: Bahi
description: The shop's red-cloth bahi-khata, opened on the counter. One hand. One glance. One transaction.
colors:
  cloth: "#7e1a1a"
  cloth-deep: "#5f1212"
  cloth-ink: "#fbefd9"
  cloth-muted: "#ecc9a6"
  gold: "#e2a11b"
  gold-deep: "#b97f0c"
  page: "#fbf6ec"
  page-2: "#f4ecdc"
  paper-white: "#fffdf8"
  rule: "#e6d9c4"
  rule-strong: "#cdbba2"
  margin-red: "#c95a4a"
  ink: "#1f1a17"
  ink-2: "#5e5148"
  ink-3: "#75685d"
  udhaar: "#9a2d22"
  udhaar-wash: "#f6dcd5"
  jama: "#2f6b45"
  jama-wash: "#d9eadc"
  sale: "#4b4f7a"
  warn: "#8a5a00"
  warn-wash: "#fbe9bf"
  focus: "#1d5fd1"
typography:
  amount-xl:
    fontFamily: "Martel, Noto Serif Devanagari, Georgia, serif"
    fontSize: "5.5rem"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"lnum\""
  amount-lg:
    fontFamily: "Martel, Noto Serif Devanagari, Georgia, serif"
    fontSize: "3.75rem"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\", \"lnum\""
  headline:
    fontFamily: "Martel, Noto Serif Devanagari, Georgia, serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1.25
  title:
    fontFamily: "Martel, Noto Serif Devanagari, Georgia, serif"
    fontSize: "1.3125rem"
    fontWeight: 800
    lineHeight: 1.2
  section:
    fontFamily: "Martel, Noto Serif Devanagari, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 800
  body-lg:
    fontFamily: "Hind, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Hind, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Hind, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  tag:
    fontFamily: "Hind, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.04em"
  keypad:
    fontFamily: "Hind, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    fontFeature: "\"tnum\", \"lnum\""
rounded:
  sm: "6px"
  md: "10px"
  lg: "18px"
  pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "20px"
  s-6: "24px"
  s-8: "32px"
  s-10: "40px"
  gutter: "20px"
  tap: "48px"
  tap-lg: "60px"
components:
  button-primary:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.cloth-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.tap-lg}"
  button-primary-hover:
    backgroundColor: "{colors.cloth-deep}"
  button-jama:
    backgroundColor: "{colors.jama}"
    textColor: "#f4faf5"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.tap}"
  button-outline:
    backgroundColor: "{colors.page}"
    textColor: "{colors.cloth}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.tap}"
  button-outline-hover:
    backgroundColor: "{colors.page-2}"
  button-ghost:
    textColor: "{colors.ink-2}"
    height: "{spacing.tap}"
  chip:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "{spacing.tap}"
  chip-selected:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.cloth-ink}"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "52px"
  demo-badge:
    backgroundColor: "{colors.warn-wash}"
    textColor: "{colors.warn}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  mono-tile:
    backgroundColor: "{colors.page-2}"
    textColor: "{colors.cloth}"
    rounded: "{rounded.sm}"
    size: "44px"
  ledger-row:
    textColor: "{colors.ink}"
    height: "64px"
  keypad-key:
    textColor: "{colors.ink}"
    typography: "{typography.keypad}"
    height: "clamp(54px, 7.6vh, 66px)"
  toast:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.cloth-ink}"
    rounded: "{rounded.sm}"
    height: "64px"
---

# Design System: Bahi

## Overview

**Creative North Star: "The Red-Cloth Bahi, Open on the Counter"**

Every screen is a spread of the shopkeeper's own account book. The top of the screen is the book's maroon bookcloth cover, woven and closed off by a turmeric-gold double rule like a binding stitch. Below it lies the warm ledger page: cream paper, a red double margin rule down the left, and hairline ruled lines in place of cards. Money is written on the page in a heavy Devanagari-Latin serif with tabular figures. Interface words are set in a plain, sturdy Hindi-Latin sans. The world deliberately rejects the category default of a blue app bar, a white card stack and a floating add button.

Density is a counter tool, not a dashboard: rows are 64px tall, every target is at least 48px, and the frequent actions sit in a bottom dock within thumb reach. Colour carries meaning only alongside a word and an arrow. Depth is mostly material (cloth and paper, rules and margins); shadows are kept for the few things that float above the page.

Motion is the act of writing. A saved entry inks onto its line with a left-to-right clip reveal (260ms), balance digits roll into fixed cells so nothing reflows, and the changed balance stays highlighted like a fresh pen mark until the next tap.

**Key Characteristics:**
- Maroon woven bookcloth header on every screen, closed by a gold double rule.
- Cream ledger page with a red double margin rule and hairline ruled rows; no cards.
- Martel 800–900 for amounts, names-as-headings and screen titles; Hind for all UI text.
- Money direction is always word + arrow icon + ink colour (UDHAAR red ↗, JAMA green ↙).
- One strict tabular numeral grid for all money; digits sit in fixed cells and never reflow.
- Everything frequent lives in the bottom dock; a single lipped maroon primary button.
- Every simulated payment and message element carries a DEMO badge.

## Colors

A two-material palette: deep maroon cloth with turmeric gold above, warm cream paper with brown-black ink below, plus two money inks that are never used decoratively.

### Primary
- **Bookcloth Maroon** (cloth): the header band of every screen, the toast, the primary button fill, selected chips and segments, links and monogram initials. It owns whole regions rather than appearing as a sprinkled accent.
- **Deep Bookcloth** (cloth-deep): hover and pressed state of maroon fills.
- **Cloth Ink** (cloth-ink): text and icons on cloth.
- **Faded Cloth Ink** (cloth-muted): secondary text on cloth (English shop name, subtitles, toast detail) and the 1.5px outline of icon buttons on cloth (at 55% alpha).

### Secondary
- **Turmeric Gold** (gold): the binding device only. The double rule under the header, on top of sheets and toasts, the 3px inset lip of the primary button, the toast's Undo label and timer bar, the underline on a held balance, the waiting-for-payment pulse, and text selection.
- **Deep Turmeric** (gold-deep): reserved darker gold for gold-on-light needs.

### Tertiary: money inks
- **Udhaar Red Ink** (udhaar): credit given, balances due, failed or cancelled payment text. Its wash (udhaar-wash) backs failed/cancelled payment status.
- **Jama Green Ink** (jama): money received, advances, the Received/Collect buttons. Its wash (jama-wash) is the green tint companion.
- **Sale Indigo** (sale): the SALE tag only, so sales never read as credit or payment.
- **Demo Amber** (warn) on **Demo Wash** (warn-wash): the DEMO badge, simulator legend, offline bar, overpay warning, and the held-balance highlight.

### Neutral
- **Ledger Cream** (page): the page and dock background, outline-button fill.
- **Worn Page** (page-2): row hover, monogram tile fill, pay-status background.
- **Paper White** (paper-white): the writable surfaces: inputs, the reminder message bubble, the QR plate.
- **Hairline Rule** (rule): row dividers, split lines, keypad grid; also the row pressed state.
- **Strong Rule** (rule-strong): day headers' underline, chip and segment borders, input stroke, sheet grip, empty-amount placeholder, the dock's top double rule.
- **Margin Red** (margin-red): the double margin rule of the ledger page and the underline beneath the entry amount.
- **Ink / Ink 2 / Ink 3** (ink, ink-2, ink-3): primary text, labels and secondary text, timestamps and placeholders.
- **Focus Blue** (focus): the 3px focus outline, the one colour outside the world, kept for unmistakable keyboard focus.

### Named Rules
**The Word-Arrow-Ink Rule.** Udhaar and jama are never colour alone: red ink always arrives with the word UDHAAR and an arrow-up-right, green ink with JAMA and an arrow-down-left. A red or green figure without its word is a defect.

**The Gold Is Binding Rule.** Gold appears only as the book's binding: double rules, the primary button's lip, and marks of a fresh entry. It is never a fill, a background or a body-text colour on the page.

**The Cloth Owns Regions Rule.** Maroon fills whole bands (header, toast, primary action), not small decorative accents scattered over the page.

## Typography

**Display Font:** Martel (with Noto Serif Devanagari, Georgia, serif)
**Body Font:** Hind (with Noto Sans Devanagari, system-ui, sans-serif)

**Character:** A heavy ledger serif for what would be written in ink (amounts, customer names as headings, the shop's name), beside a plain, sturdy sans for everything the interface says. Both carry Devanagari and Latin, so Hindi and Marathi sit at the same weight and baseline as English.

### Hierarchy
- **Amount XL** (Martel 900, 5.5rem capped by viewport width, 1.1, -0.02em): the amount being typed on the entry screen; drops to 3.75rem on phones under 700px tall.
- **Amount LG** (Martel 900, 3.75rem, 1.1, -0.01em): total baaki on Home; 3rem below 360px wide; 2.5rem for the cancel-confirmation amount and the QR amount.
- **Headline** (Martel 800, 1.625rem, 1.25): the shop's local-script name in the header, split figures (sales | received), payment result.
- **Title** (Martel 800, 1.3125rem, 1.2): screen titles in the cloth band, sheet titles, row amounts and ledger-row amounts.
- **Section** (Martel 800, 1.125rem): section headings on the page.
- **Body Large** (Hind 600, 1.125rem, 1.25): customer names in rows, button and chip labels.
- **Body** (Hind 400, 1rem, 1.45): default text, ledger notes, the reminder message (1.5 line-height).
- **Label** (Hind 500–600, 0.875rem): field labels above figures and inputs, day headers (700), subtitles.
- **Tag** (Hind 700, 0.8125rem, 0.04em, uppercase): UDHAAR / JAMA / SALE direction tags and DEMO.

### Named Rules
**The Tabular Ledger Rule.** Every money figure uses tabular, lining numerals (`tnum`, `lnum`) and sits in a fixed-width cell grid; a balance changing value must never shift the layout around it.

**The Keypad Speaks Hind Rule.** Keypad digits are Hind 600 at 1.875rem, not Martel. Martel's numerals render old-style at key size and read as uneven; the keys are interface, the amount above them is ink.

**The Ink Is Serif Rule.** Martel is for things written in the book (amounts, names as headings, titles). Interface text, labels, buttons and tags are Hind.

## Layout

A single mobile column, 20px gutter (14px below 360px wide), arranged as cloth band on top, scrolling ledger page in the middle, and a fixed bottom dock.

- **The ledger page** pads 52px on the left to clear the red double margin rule drawn at 34px (40px and 24px below 360px wide). Content is rows on hairlines, not boxed groups.
- **Rows** are 64px minimum: a 44px monogram tile, a name block, and a right-aligned amount column. On Home a dashed-divided 56px Khata column sits beside each row to open the ledger.
- **The dock** pads 12px / 16px plus the safe-area inset and holds the frequent actions: a two-up row of outline buttons (Sale, Received) above a full-width primary button. On the customer picker the search field lives in the dock, in the thumb zone.
- **Spacing rhythm** is a 4px base (4, 8, 12, 16, 20, 24, 32, 40).
- **The entry screen** omits the margin rule on purpose: the amount is centered and the keypad runs full width, edge to edge, as a 3-column grid of hairline cells pushed to the bottom. Under 700px tall, the keypad keys shrink to 48px and the header tightens so the whole keypad and the save button fit on one screen.
- **Desktop presentation** wraps the same app for judges: the whole page becomes the closed maroon khata (woven cloth background) with a 410px phone frame at the center, a story and task-timer column on the left, and a screen index on the right (a three-column grid that collapses to two below 1240px).

## Elevation & Depth

Depth comes from the materials: woven cloth above, flat paper below, divided by double rules and hairlines. The page has no shadows at rest. Shadows exist only for the layers that truly float over the book.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 -8px 30px rgba(55, 20, 10, 0.18)`): bottom sheets rising over the page.
- **Toast** (`box-shadow: 0 8px 24px rgba(31, 26, 23, 0.28)`): the saved-entry toast with Undo.
- **Message bubble** (`box-shadow: 0 1px 1px rgba(31, 26, 23, 0.08)`): the reminder preview, a barely-lifted chat bubble.
- **Phone frame** (desktop only, `0 30px 70px rgba(30, 6, 4, 0.55), 0 8px 18px rgba(30, 6, 4, 0.35)`): the phone resting on the cloth.

### Named Rules
**The Flat Page Rule.** Nothing on the ledger page casts a shadow. Grouping is done with ruled lines, the margin rule and whitespace; a shadowed card on the page breaks the book.

**The Double-Rule Binding Rule.** Every boundary between cloth and page, and every surface that rises over the page, is closed by a double rule: 6px gold under the header, 5px gold on top of sheets and toasts, and a 4px strong-rule double line on top of the dock.

## Shapes

Mostly square paper geometry with soft, small corners on anything touchable. Buttons, segments, inputs and pay-status panels use gently curved corners (10px); monogram tiles, badges and the toast use tighter corners (6px); bottom sheets round only their top corners (18px). Chips are full pills; icon buttons are circles. Rows, the keypad and ledger lines have no corners at all: they are ruled lines on the page. The cloth's woven texture is two crossing repeating diagonal hairline gradients (45° light, -45° dark) over the maroon.

## Components

### Buttons
Tactile and heavy, sized for a thumb at a busy counter.
- **Shape:** gently curved (10px), 48px minimum height, Hind 700.
- **Primary:** Bookcloth Maroon fill, Cloth Ink text, 60px tall at 1.3125rem, with a 3px inset gold lip along the bottom edge (`box-shadow: inset 0 -3px 0 gold`). This is the only lipped button. It echoes the header's gold double rule and marks the single most important action on a screen (Add udhaar, Save).
- **Hover / Press:** hover deepens to Deep Bookcloth; press nudges down 1px and scales to 0.985 (90ms). Disabled primary turns a flat warm grey (#b9a79a) with no lip.
- **Jama:** flat Jama Green fill with pale text, no lip. Used for Save on a payment received.
- **Outline:** 1.5px maroon stroke on Ledger Cream, maroon text; hover goes to Worn Page. Recoloured to jama or udhaar ink when the action is directional (Collect, Cancel entry).
- **Ghost:** underlined Ink 2 text, for Close.
- **Icon button:** 48px circle; on cloth it carries a faded cloth-ink outline and scales to 0.92 when pressed.

### Chips and Segments
- **Chips:** 48px pills with a 1.5px strong-rule border on cream; selected chips fill with maroon. Used for quick amounts (a four-up grid on the entry screen) and filters.
- **Segmented control:** 1.5px strong-rule outline, 10px corners, equal columns; the pressed segment fills with maroon. Used for language and Cash | UPI.

### Rows (signature)
- **Customer row:** 64px, monogram tile (44px, worn-page fill, strong-rule border, maroon Martel initials) + name (Hind 600 18px) with a one-line meta + right-aligned Martel amount in its direction ink. Hover Worn Page, press Hairline Rule.
- **Ledger row:** note and time on the left, Martel amount with its UDHAAR/JAMA tag and the running balance on the right, grouped under day headers with a strong-rule underline. A reversed entry is struck through at 55% opacity, never deleted.
- **Held balance:** the balance that just changed is marked like a fresh pen entry: Demo Wash highlight spread 6px around it and a 2px gold underline offset 6px, inked in with the 260ms clip reveal, kept until the next tap.

### Inputs / Fields
- **Style:** 52px tall, Paper White, 1.5px strong-rule stroke, 10px corners, 18px text, Ink 3 placeholder.
- **Focus:** stroke turns maroon with a 3px maroon halo at 15% alpha. Everything else focusable uses the 3px Focus Blue outline, offset 2px.

### Header (cloth band)
Woven maroon band with cloth-ink text and a 6px gold double rule at its foot. Home shows the shop's name in local script (Martel 800, 26px) over the English name; other screens show a back icon button, a Martel title and a muted subtitle with the current baaki.

### Bottom Dock
Ledger Cream with a strong-rule double line on top; outline actions in a two-up grid above a full-width primary action.

### Keypad
A full-width 3 × 4 grid of hairline cells (1–9, 00, 0, delete), clamp(54px, 7.6vh, 66px) tall, Hind digits; hover Worn Page, press Hairline Rule. No margin rule on this screen.

### Toast (saved entry)
A strip of woven cloth floating above the dock: 6px corners, 5px gold double rule on top, title in cloth ink with the new balance in muted ink, an uppercase gold UNDO button and a 3px gold timer bar draining along the bottom edge.

### Sheet
Ledger Cream, 18px top corners, 5px gold double rule on top, a 40 × 4px strong-rule grip, Martel 800 title, sheet shadow over a warm 42% scrim. Slides up in 280ms on the standard ease-out curve.

### DEMO Badge
A 24px amber tag (Demo Wash fill, Demo Amber text, #e7c779 border, 6px corners, 0.06em tracking) on every simulated payment and message element: the UPI screen header, the payment simulator legend, demo-recorded ledger entries and the reminder bubble. On the QR itself it becomes a rotated stamp (-12°, 2px amber border). The simulator controls sit inside a dashed amber fieldset.

## Do's and Don'ts

### Do:
- **Do** open every screen with the woven maroon cloth band closed by the 6px gold double rule.
- **Do** put content on the cream page as ruled rows (1px Hairline Rule dividers, 64px minimum) with the red double margin rule at the left.
- **Do** show money direction as word + arrow + ink every time: UDHAAR in red with arrow-up-right, JAMA in green with arrow-down-left.
- **Do** set every money figure in Martel with tabular lining numerals, in fixed cells that never reflow.
- **Do** keep keypad digits in Hind 600, and leave the margin rule off the entry screen so the keypad spans the full width.
- **Do** keep the 3px gold inset lip for the single primary maroon button; every other button is flat.
- **Do** mark every simulated payment or message element with the DEMO badge.
- **Do** keep every touch target at least 48px (60px for the primary action) and place frequent actions in the bottom dock.
- **Do** close sheets and toasts with the gold double rule, and the dock with the strong-rule double line.

### Don't:
- **Don't** use a blue app bar, a white card stack or a floating add button: the category default this world exists to refuse.
- **Don't** put shadowed cards on the ledger page; shadows belong only to sheets, toasts and the reminder bubble.
- **Don't** put a gold lip on any button other than the primary, including the Jama save button.
- **Don't** use red or green ink without its word and arrow, or use them decoratively.
- **Don't** use gold as a fill or a body-text colour on the cream page.
- **Don't** confirm with dialogs; record, then offer Undo in the toast.
