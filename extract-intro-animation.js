import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.rioproperty.co.za/';
const OUTPUT_DIR = path.join(process.cwd(), 'website-forensics', 'rioproperty', 'intro-animation');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  console.log('=============== [ استخراج تخصصی انیمیشن ورود (Intro Animation) ] ===============\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  // ۱. شنود کدهای جاوااسکریپت و انیمیشن‌های لودر قبل از بارگیری کامل
  const scriptEvents = [];
  page.on('console', msg => {
    if (msg.text().toLowerCase().includes('loader') || msg.text().toLowerCase().includes('animation')) {
      scriptEvents.push(msg.text());
    }
  });

  console.log(`[+] در حال بارگیری اولیه صفحه جهت ضبط انیمیشن ورود...`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // ۲. استخراج ساختار HTML مربوط به Preloader و Overlay
  const introStructure = await page.evaluate(() => {
    const loaderSelectors = [
      '[class*="loader"]', '[class*="preloader"]', '[class*="intro"]', 
      '[id*="loader"]', '[id*="preloader"]', '[id*="intro"]',
      '.w-embed-youtubecover', '[data-w-id]'
    ];

    const foundElements = [];
    loaderSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        const s = getComputedStyle(el);
        foundElements.push({
          selector,
          tagName: el.tagName.toLowerCase(),
          className: el.className,
          id: el.id,
          htmlContent: el.outerHTML.slice(0, 500), // برش خروجی جهت خوانایی
          computedStyles: {
            display: s.display,
            visibility: s.visibility,
            opacity: s.opacity,
            position: s.position,
            zIndex: s.zIndex,
            transform: s.transform,
            transition: s.transition,
            animation: s.animation
          }
        });
      });
    });

    // استخراج تمام keyframeهای مربوط به intro یا fade در CSS
    const cssKeyframes = [];
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule.type === CSSRule.KEYFRAMES_RULE) {
            if (rule.name.toLowerCase().includes('loader') || 
                rule.name.toLowerCase().includes('intro') || 
                rule.name.toLowerCase().includes('fade') ||
                rule.name.toLowerCase().includes('scale')) {
              cssKeyframes.push({
                name: rule.name,
                cssText: rule.cssText
              });
            }
          }
        });
      } catch (e) {}
    });

    return {
      foundElements,
      cssKeyframes
    };
  });

  // ۳. ذخیره گزارش استخراج
  const reportPath = path.join(OUTPUT_DIR, 'intro_animation_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(introStructure, null, 2), 'utf8');

  await browser.close();

  console.log('\n========================================================================');
  console.log('✅ استخراج انیمیشن ورود با موفقیت انجام شد!');
  console.log(`📄 فایل گزارش ذخیره شده در: ${reportPath}`);
  console.log('========================================================================');
})();