import { chromium } from '@playwright/test'
const b = await chromium.launch(); const p = await b.newPage()
await p.goto('http://localhost:5173/case-study.html'); await p.waitForLoadState('networkidle')
await p.pdf({ path: 'docs/Bahi-case-study.pdf', format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } })
await p.setViewportSize({ width: 900, height: 1300 }); await p.screenshot({ path: '.impeccable/review/case-study.png', fullPage: true })
console.log('sheet px', await p.evaluate(() => document.querySelector('.sheet').scrollHeight)); await b.close()
