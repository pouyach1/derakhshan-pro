import { chromium } from 'playwright';
import path from 'path';
const out = '/opt/cursor/artifacts';
const browser = await chromium.launch({ headless: true, executablePath: '/usr/local/bin/google-chrome', args: ['--no-sandbox','--disable-dev-shm-usage'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fa-IR' })).newPage();

await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(out, 'guest_redirect_login.png') });
console.log('guest url', page.url());

await page.locator('input').first().fill('admin@vorqen.ir');
await page.locator('input').nth(1).fill('123456');
await page.locator('button[type="submit"], button:has-text("ورود")').first().click();
await page.waitForTimeout(2000);
await page.goto('http://localhost:3001/listings', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(out, 'listings_clear_text_prices.png') });

const agentLink = page.locator('a[href^="/agents/"]').first();
if (await agentLink.count()) {
  await agentLink.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, 'agent_profile_resume.png') });
  console.log('agent url', page.url());
}
await browser.close();
console.log('done');
