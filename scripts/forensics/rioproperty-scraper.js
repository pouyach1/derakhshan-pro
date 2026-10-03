import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = 'https://www.rioproperty.co.za/';
const OUTPUT_ROOT = path.join(process.cwd(), 'website-forensics', 'rioproperty', 'animations');

const DIRS = {
  download: path.join(OUTPUT_ROOT, 'downloaded-assets'),
  screenshot: path.join(OUTPUT_ROOT, 'screenshots'),
  pages: path.join(OUTPUT_ROOT, 'pages'),
};

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const MAX_PAGES = 5;
const NAV_TIMEOUT = 45000;

Object.values(DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function sha1(buf) { return crypto.createHash('sha1').update(buf).digest('hex'); }
function safeName(str) { return String(str || 'home').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 100); }

// تنظیم شنود شبکه برای دانلود خودکار انیمیشن‌ها
function setupNetworkAssetDownloader(page) {
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      const isAnimation = 
        /\.(mp4|webm|gif|svg|json|lottie|wasm)(\?|$)/i.test(url) ||
        /(video\/|image\/svg\+xml|application\/json)/i.test(contentType);

      if (isAnimation && response.ok()) {
        const buffer = await response.buffer();
        if (!buffer || buffer.length === 0) return;

        const cleanUrl = new URL(url);
        const ext = path.extname(cleanUrl.pathname) || '.bin';
        const filename = `${safeName(cleanUrl.pathname)}_${sha1(buffer).slice(0, 8)}${ext}`;
        const savePath = path.join(DIRS.download, filename);

        if (!fs.existsSync(savePath)) {
          fs.writeFileSync(savePath, buffer);
          console.log(`  [Asset Downloaded] -> ${filename}`);
        }
      }
    } catch (e) {
      // نادیده گرفتن خطاهای فرعی دانلود
    }
  });
}

// استخراج المان‌های انیمیشنی
async function extractAnimationData(page) {
  return page.evaluate(() => {
    const animatedElements = [];
    const targets = document.querySelectorAll('video, canvas, svg, [style*="transform"], [style*="transition"], [style*="animation"]');

    targets.forEach((el) => {
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      animatedElements.push({
        tag: el.tagName,
        id: el.id || null,
        className: typeof el.className === 'string' ? el.className : null,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        styles: {
          transform: s.transform,
          transition: s.transition,
          animationName: s.animationName,
          animationDuration: s.animationDuration,
          willChange: s.willChange
        }
      });
    });

    const html = document.documentElement.outerHTML;
    const frameworks = [];
    if (/gsap|greensock/i.test(html)) frameworks.push('GSAP');
    if (/framer-motion/i.test(html)) frameworks.push('Framer Motion');
    if (/lottie/i.test(html)) frameworks.push('Lottie');
    if (/three/i.test(html)) frameworks.push('Three.js');

    return {
      frameworks,
      animatedElementsCount: animatedElements.length,
      elements: animatedElements
    };
  });
}

// اسکرول برای فعال‌سازی انیمیشن‌ها
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalDistance = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalDistance += distance;

        if (totalDistance >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });
}

// تحلیل صفحه
async function analyzePage(page, url, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  await sleep(2000);

  await autoScroll(page);
  await sleep(1000);

  const animationReport = await extractAnimationData(page);
  const pageSlug = safeName(new URL(url).pathname) || 'home';
  const screenshotPath = path.join(DIRS.screenshot, `${pageSlug}_${viewport.name}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  return {
    viewport: viewport.name,
    animationReport,
    screenshot: path.relative(OUTPUT_ROOT, screenshotPath)
  };
}

// اجرای فرایند
(async () => {
  console.log('[+] شروع فرایند استخراج و تحلیل انیمیشن‌ها با Chrome سیستم...');
  
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  setupNetworkAssetDownloader(page);

  const pagesToVisit = [BASE_URL];

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const links = await page.evaluate(() => 
      [...document.querySelectorAll('a[href]')]
        .map(a => a.href)
        .filter(href => href.startsWith(window.location.origin))
    );
    
    for (const link of links) {
      if (!pagesToVisit.includes(link) && pagesToVisit.length < MAX_PAGES) {
        pagesToVisit.push(link);
      }
    }
  } catch (e) {
    console.log('[-] خطا در لینک‌های اولیه.');
  }

  console.log(`[+] تعداد ${pagesToVisit.length} صفحه پیدا شد.`);

  const fullReport = [];

  for (const pageUrl of pagesToVisit) {
    console.log(`\n[->] در حال بررسی: ${pageUrl}`);
    const pageData = { url: pageUrl, viewports: {} };

    for (const vp of VIEWPORTS) {
      try {
        console.log(`  |- سایز: ${vp.name}`);
        const result = await analyzePage(page, pageUrl, vp);
        pageData.viewports[vp.name] = result;
      } catch (err) {
        console.error(`  |- خطا در سایز ${vp.name}: ${err.message}`);
      }
    }

    const reportPath = path.join(DIRS.pages, `${safeName(new URL(pageUrl).pathname || 'home')}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(pageData, null, 2));
    fullReport.push(pageData);
  }

  fs.writeFileSync(path.join(OUTPUT_ROOT, 'summary_report.json'), JSON.stringify(fullReport, null, 2));

  await browser.close();
  console.log('\n[+] عملیات با موفقیت انجام شد و تمام فایل‌ها ذخیره شدند.');
})();