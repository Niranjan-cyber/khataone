---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: Bahi mobile app (all six screens)

Scope: the mobile-first app (Home, Customer picker, Credit entry, Ledger, Reminder, UPI collect). Mode: Operate.
Audience: kirana owner behind a busy counter, one hand, budget Android. Task: record udhaar in under 10 s; read balances; remind; collect.
Constraints: PRODUCT.md. Money direction always = word + icon + colour. Simulated UPI/messaging labelled DEMO.

## Direction contract

THESIS: The shop's red-cloth bahi-khata, opened on the counter. Refuses the category's blue app bar + white card stack + floating add button.

OWN-WORLD: Maroon bookcloth (#7E1A1A, faint weave) owns the header band of every screen, closed by a turmeric-gold double rule. Below: warm ledger page (#FBF6EC) with a red double margin rule, hairline ruled rows instead of cards. Martel (Devanagari+Latin serif) for amounts and names-as-headings; Hind for UI text. Udhaar = red ink + "UDHAAR" + arrow-up-right; Jama = green ink (#2F6B45) + "JAMA" + arrow-down-left. Buttons: maroon fill with a gold bottom lip; secondary = maroon outline.

STORY: The shopkeeper sees what is owed and today's money at a glance, taps a recent customer or "Add udhaar", types the amount, saves; the entry is written onto the page with the new balance and an Undo. From the ledger they remind politely or collect by UPI/cash.

FIRST VIEWPORT: Cloth band with श्री गणेश किराना + English; total baaki in 60px Martel; sales | received split on ruled lines; a row of recent customers (thumb zone); bottom dock: Sale, Received, and full-width "+ उधार लिखें · Add udhaar".

FORM: Bahi red-cloth khata, my rank 1 (IMPECCABLE'S PICK, user-chosen). seed:15923105ec2a082c

SIGNATURE MOVE: "Writing the entry": on save the new row inks onto the ledger line (clip reveal left→right, 260 ms) and the balance numerals settle; held highlight on the changed balance until seen (raise from Pass & Board).

RAISES: one strict tabular numeral grid for all money (Crouwel); colour fields own whole regions (Zoo); dense customer picker, 7–8 visible (event catalog); fixed-cell digits so balances never reflow (split-flap).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
