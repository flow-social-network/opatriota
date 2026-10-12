import { chromium, type Browser, type Page } from 'playwright'

export class PlaywrightAdapter {
  private browser?: Browser
  private page?: Page
  async open(url: string) { this.browser ??= await chromium.launch({ headless: true }); this.page = await this.browser.newPage({ viewport: { width: 1440, height: 900 } }); await this.page.goto(url, { waitUntil: 'networkidle' }); return { title: await this.page.title(), url: this.page.url() } }
  async snapshot() { if (!this.page) throw new Error('BROWSER_NOT_OPEN'); return { title: await this.page.title(), text: (await this.page.locator('body').innerText()).slice(0, 10000) } }
  async click(selector: string) { if (!this.page) throw new Error('BROWSER_NOT_OPEN'); await this.page.locator(selector).click(); return this.snapshot() }
  async fill(selector: string, value: string) { if (!this.page) throw new Error('BROWSER_NOT_OPEN'); await this.page.locator(selector).fill(value); return this.snapshot() }
  async screenshot(path: string) { if (!this.page) throw new Error('BROWSER_NOT_OPEN'); await this.page.screenshot({ path, fullPage: true }); return path }
  async close() { await this.browser?.close(); this.browser = undefined; this.page = undefined }
}
