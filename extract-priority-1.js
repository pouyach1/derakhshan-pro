import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = 'https://www.rioproperty.co.za/';
const OUTPUT_ROOT = path.join(process.cwd(), 'website-forensics', 'rioproperty', 'priority-1');

// ساختار پوشه‌بندی مجزا برای هر نوع Asset حیاتی
const DIRS = {
  fonts: path.join(OUTPUT_ROOT, 'fonts'),
  logosAndSvgs: path.join(OUTPUT_ROOT, 'logos-and-svgs'),
  colorsAndDesignTokens: path.join(OUTPUT_ROOT, 'design-tokens'),
};

const NAV_TIMEOUT = 60000; // ۶۰ ثانیه مهلت برای لود

// ایجاد پوشه‌ها
Object.values(DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

function safeName(str) {
  return String(str || 'asset').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 100);
}

// -------------------------------------------------------------
// ۱. شنود شبکه برای دانلود سریع فونت‌ها و فایل‌های SVG/Logo
// -------------------------------------------------------------
function setupCriticalAssetInterceptor(page) {
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      const isFont = /\.(woff2?|ttf|eot|otf)(\?|$)/i.test(url) || /font/i.test(contentType);
      const isSvg = /\.svg(\?|$)/i.test(url) || /image\/svg\+xml/i.test(contentType);

      if ((isFont || isSvg) && response.ok()) {
        const buffer = await response.buffer();
        if (!buffer || buffer.length === 0) return;

        const cleanUrl = new URL(url);
        const ext = path.extname(cleanUrl.pathname) || (isFont ? '.woff2' : '.svg');
        const filename = `${safeName(cleanUrl.pathname)}_${sha1(buffer).slice(0, 8)}${ext}`;
        
        const targetDir = isFont ? DIRS.fonts : DIRS.logosAndSvgs;
        const savePath = path.join(targetDir, filename);

        if (!fs.existsSync(savePath)) {
          fs.writeFileSync(savePath, buffer);
          console.log(`  [Asset Saved] (${isFont ? 'FONT' : 'SVG/LOGO'}) -> ${filename}`);
        }
      }
    } catch (e) {
      // نادیده گرفتن خطاهای فرعی دانلود شبکه
    }
  });
}

// -------------------------------------------------------------
// ۲. استخراج دقیق پالت رنگی، متغیرهای CSS و فونت‌ها
// -------------------------------------------------------------
async function extractDesignTokens(page) {
  return page.evaluate(() => {
    const cssVariables = {};
    const colorSet = new Set();
    const fontFamilies = new Set();
    const inlineSvgs = [];

    // ۱. استخراج متغیرهای CSS از تمام استایل‌ها (Root & CSS Variables)
    for (const sheet of [...document.styleSheets]) {
      try {
        const rules = [...sheet.cssRules];
        for (const rule of rules) {
          if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) {
                cssVariables[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch (e) {
        // دسترسی به برخی استایل‌های cross-origin محدود است
      }
    }

    // ۲. پیمایش عناصر DOM برای استخراج رنگ‌های واقعی محاسبه‌شده و Font Familyها
    const allElements = document.querySelectorAll('*');
    const colorRegex = /(rgba?\(.*?\)|hsla?\(.*?\)|#[0-9a-fA-F]{3,8})/g;

    allElements.forEach((el) => {
      const s = getComputedStyle(el);
      
      // جمع‌آوری رنگ‌ها
      [s.color, s.backgroundColor, s.borderColor, s.fill, s.stroke].forEach((val) => {
        if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent' && val !== 'none') {
          const matches = val.match(colorRegex);
          if (matches) {
            matches.forEach((c) => colorSet.add(c));
          }
        }
      });

      // جمع‌آوری Font Familyها
      if (s.fontFamily) {
        s.fontFamily.split(',').forEach((f) => fontFamilies.add(f.trim().replace(/['"]/g, '')));
      }
    });

    // ۳. استخراج کدهای Inline SVG (لوگوهایی که مستقیم در HTML نوشته شده‌اند)
    document.querySelectorAll('svg').forEach((svg, idx) => {
      inlineSvgs.push({
        id: svg.id || `inline-svg-${idx}`,
        className: typeof svg.className === 'string' ? svg.className : '',
        html: svg.outerHTML
      });
    });

    return {
      cssVariables,
      palette: Array.from(colorSet),
      fontFamilies: Array.from(fontFamilies),
      inlineSvgsCount: inlineSvgs.length,
      inlineSvgs
    };
  });
}

// -------------------------------------------------------------
// ۳. اجرای فرایند اصلی استخراج
// -------------------------------------------------------------
(async () => {
  console.log('=============== [ استخراج اولویت ۱: فونت‌ها، رنگ‌ها و لوگوها ] ===============\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  // فعال‌سازی موتور دانلود فایل‌های حیاتی
  setupCriticalAssetInterceptor(page);

  console.log(`[+] در حال بارگیری صفحه اصلی: ${BASE_URL}`);
  
  // اصلاح کلیدی: استفاده از domcontentloaded به‌جای networkidle
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  } catch (e) {
    console.log('[-] هشدار در زمان لود اولیه، ادامه عملیات...');
  }

  // ایجاد وقفه ۲ ثانیه‌ای برای بارگیری کامل Assetهای اولیه
  await new Promise((r) => setTimeout(r, 2000));

  console.log('[+] اسکرول صفحه جهت فعال‌سازی Lazy-loading فونت‌ها و لوگوها...');
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight / 2);
    await new Promise((r) => setTimeout(r, 1500));
    window.scrollTo(0, 0);
  });

  console.log('[+] استخراج پالت رنگی، متغیرهای CSS و تایپوگرافی...');
  const tokensData = await extractDesignTokens(page);

  // ذخیره فایل‌های SVG درونی (Inline SVGs)
  console.log(`[+] ذخیره‌سازی ${tokensData.inlineSvgs.length} عدد لوگو/آیکون SVG اینلاین...`);
  tokensData.inlineSvgs.forEach((svg, idx) => {
    const filename = `inline_logo_${idx + 1}_${safeName(svg.id)}.svg`;
    fs.writeFileSync(path.join(DIRS.logosAndSvgs, filename), svg.html, 'utf8');
  });

  // حذف لیست HTML سنگین از JSON نهایی جهت تمیزی فایل خروجی
  delete tokensData.inlineSvgs;

  // ذخیره‌سازی گزارش جامع Design Tokens
  const reportPath = path.join(DIRS.colorsAndDesignTokens, 'design_tokens.json');
  fs.writeFileSync(reportPath, JSON.stringify(tokensData, null, 2), 'utf8');

  await browser.close();

  console.log('\n========================================================================');
  console.log('✅ فرایند استخراج اولویت ۱ با موفقیت کامل شد!');
  console.log(`📁 فایل‌های فونت: ${DIRS.fonts}`);
  console.log(`📁 لوگوها و آیکون‌ها: ${DIRS.logosAndSvgs}`);
  console.log(`📄 گزارش رنگ‌ها و متغیرها: ${reportPath}`);
  console.log('========================================================================');
})();