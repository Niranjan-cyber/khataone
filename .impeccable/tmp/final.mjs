import { chromium, devices } from '@playwright/test'
const base='http://localhost:5173', out='screenshots/final'
const b=await chromium.launch()
const ctx=await b.newContext({ ...devices['Pixel 7'], viewport:{width:390,height:844}, deviceScaleFactor:3, reducedMotion:'reduce' })
const p=await ctx.newPage()
await p.goto(base); await p.evaluate(()=>{localStorage.clear();localStorage.setItem('bahi.lang','en')}); await p.reload()
const keys=async s=>{for(const k of s) await p.locator('.key',{hasText:new RegExp(`^${k}$`)}).click()}
const go=async h=>{await p.goto(base+'/'+h); await p.waitForTimeout(500)}
await go('#/'); await p.screenshot({path:`${out}/1-shop-overview.png`})
await go('#/pick/udhaar'); await p.screenshot({path:`${out}/2-customer-picker.png`})
await go('#/entry/udhaar/c1'); await keys('250'); await p.waitForTimeout(300); await p.screenshot({path:`${out}/3-express-udhaar-entry.png`})
await p.getByTestId('save').click(); await p.waitForTimeout(500); await p.screenshot({path:`${out}/3b-saved-with-undo.png`})
await go('#/ledger/c1'); await p.screenshot({path:`${out}/4-customer-ledger.png`})
await go('#/remind/c1'); await p.screenshot({path:`${out}/5-payment-reminder.png`})
await go('#/collect/c1'); await p.screenshot({path:`${out}/6-upi-collection.png`})
await p.getByRole('button',{name:'Success'}).click(); await p.waitForTimeout(600); await p.screenshot({path:`${out}/6b-upi-success.png`})
const d=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2}); await d.goto(base); await d.evaluate(()=>localStorage.clear()); await d.reload(); await d.waitForTimeout(900); await d.screenshot({path:`${out}/0-desktop-showcase.png`})
await b.close()
