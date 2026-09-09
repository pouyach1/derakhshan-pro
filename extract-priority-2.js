import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = 'https://www.rioproperty.co.za/';
const OUTPUT_ROOT = path.join(process.cwd(), 'website-forensics', 'rioproperty', 'priority-2');

// پوشه‌بندی مجزا برای دارایی‌های اولویت ۲
const DIRS = {
  images: path.join(OUTPUT_ROOT, 'high-res-images'),
  css: path.join(OUTPUT_ROOT, 'stylesheets'),
  layout: path.join(OUTPUT_ROOT, 'layout-and-breakpoints'),
};

const NAV_TIMEOUT = 60000;

// ایجاد پوشه‌ها
Object.values(DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

function safeName(str) {
  return String(str || 'asset').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 100);
}

// -------------------------------------------------------------
// ۱. شنود شبکه برای دانلود تصاویر باکیفیت
// -------------------------------------------------------------
function setupImageInterceptor(page) {
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      const isImage = 
        /\.(webp|avif|png|jpe?g|gif|tiff?)(\?|$)/i.test(url) || 
        /^image\/(webp|avif|png|jpeg|gif)/i.test(contentType);

      // نادیده گرفتن آیکون‌ها و تصویرهای بسیار کوچک مانند data:image/gif
      if (isImage && response.ok() && !url.includes('favicon')) {
        const buffer = await response.buffer();
        if (!buffer || buffer.length < 2000) return; // فیلتر تصاویر زیر ۲ کیلوبایت (آیکون‌های ریز)

        const cleanUrl = new URL(url);
        const ext = path.extname(cleanUrl.pathname) || '.webp';
        const filename = `${safeName(cleanUrl.pathname)}_${sha1(buffer).slice(0, 8)}${ext}`;
        const savePath = path.join(DIRS.images, filename);

        if (!fs.existsSync(savePath)) {
          fs.writeFileSync(savePath, buffer);
          console.log(`  [Image Saved] -> ${filename}`);
        }
      }
    } catch (e) {
      // نادیده گرفتن خطاهای فرعی شبکه
    }
  });
}

// -------------------------------------------------------------
// ۲. استخراج تمامی فایل‌ها و قوانین CSS به همراه Media Queryها
// -------------------------------------------------------------
async function extractCSSAndStyles(page) {
  return page.evaluate(() => {
    const rawStylesheets = [];
    const mediaQueries = [];

    // استخراج تمام Style Sheetها
    for (const sheet of [...document.styleSheets]) {
      try {
        const href = sheet.href || 'inline-style';
        const rules = [];

        for (const rule of [...sheet.cssRules]) {
          rules.push(rule.cssText);

          // استخراج Breakpointها و Media Queryها
          if (rule.type === CSSRule.MEDIA_RULE) {
            mediaQueries.push({
              mediaText: rule.media.mediaText,
              rulesCount: rule.cssRules.length,
            });
          }
        }

        rawStylesheets.push({
          href,
          rulesCount: rules.length,
          content: rules.join('\n')
        });
      } catch (e) {
        // نادیده گرفتن محدودیت‌های Cross-Origin استایل‌های خارجی
      }
    }

    return { rawStylesheets, mediaQueries };
  });
}

// -------------------------------------------------------------
// ۳. استخراج ساختار هندسی بخش‌های کلیدی (Layout Inspector)
// -------------------------------------------------------------
async function extractLayoutStructure(page) {
  return page.evaluate(() => {
    const layoutNodes = [];
    const mainSections = document.querySelectorAll('header, footer, main, section, nav, [class*="hero"], [class*="grid"], [class*="container"]');

    mainSections.forEach((el, idx) => {
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // ذخیره فقط المان‌های مرئی و با اندازه مشخص
      if (rect.width > 0 && rect.height > 0) {
        layoutNodes.push({
          id: el.id || `section-${idx + 1}`,
          tag: el.tagName.toLowerCase(),
          className: typeof el.className === 'string' ? el.className : '',
          layoutType: s.display, // flex, grid, block
          dimensions: {
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          },
          computedLayout: {
            display: s.display,
            flexDirection: s.flexDirection,
            gridTemplateColumns: s.gridTemplateColumns,
            gap: s.gap,
            padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
            margin: `${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft}`
          }
        });
      }
    });

    return layoutNodes;
  });
}

// -------------------------------------------------------------
// ۴. اجرای فرایند استخراج
// -------------------------------------------------------------
(async () => {
  console.log('=============== [ استخراج اولویت ۲: تصاویر باکیفیت و استایل‌های CSS ] ===============\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  // فعال‌سازی موتور دریافت تصاویر
  setupImageInterceptor(page);

  console.log(`[+] در حال بارگیری صفحه: ${BASE_URL}`);
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  } catch (e) {
    console.log('[-] هشدار لود اولیه، ادامه عملیات...');
  }

  await new Promise((r) => setTimeout(r, 2000));

  console.log('[+] اسکرول کامل صفحه جهت دریافت تمامی تصاویر و Lazy-loadها...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalDistance = 0;
      const distance = 400;
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

  await new Promise((r) => setTimeout(r, 2000));

  console.log('[+] استخراج قوانین CSS و Media Queryها...');
  const cssData = await extractCSSAndStyles(page);

  // ذخیره‌سازی فایل‌های استایل مستخرج به صورت فایل CSS
  cssData.rawStylesheets.forEach((sheet, idx) => {
    const filename = `stylesheet_${idx + 1}_${safeName(sheet.href)}.css`;
    fs.writeFileSync(path.join(DIRS.css, filename), sheet.content, 'utf8');
  });

  console.log('[+] استخراج ساختار هندسی و Breakpointهای چیدمان...');
  const layoutData = await extractLayoutStructure(page);

  // ذخیره گزارش نهایی چیدمان و ساختار CSS
  const layoutReportPath = path.join(DIRS.layout, 'layout_and_responsive_report.json');
  fs.writeFileSync(
    layoutReportPath, 
    JSON.stringify({ mediaQueries: cssData.mediaQueries, layoutNodes: layoutData }, null, 2), 
    'utf8'
  );

  await browser.close();

  console.log('\n========================================================================');
  console.log('✅ فرایند استخراج اولویت ۲ با موفقیت کامل شد!');
  console.log(`📁 تصاویر باکیفیت: ${DIRS.images}`);
  console.log(`📁 استایل‌های CSS: ${DIRS.css}`);
  console.log(`📄 گزارش چیدمان و واکنش‌گرایی: ${layoutReportPath}`);
  console.log('========================================================================');
})();