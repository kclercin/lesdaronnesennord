// scripts/capture-baseline.mjs
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE ?? 'http://localhost:9000'
const OUT = process.env.OUT ?? 'docs/superpowers/baseline'

const PAGES = [
  ['accueil', '/'],
  ['nos-ateliers', '/nos-ateliers'],
  ['la-zd-theque', '/la-zd-theque'],
  ['le-lab', '/le-lab'],
  ['contact', '/contact'],
  ['404', '/page-qui-nexiste-pas'],
]

const WIDTHS = [360, 860, 1440]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    // les polices Google arrivent après networkidle et décalent la mise en page
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true })
    console.log(`${name}-${width}.png`)
  }
  await page.close()
}

await browser.close()
