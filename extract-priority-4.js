import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.rioproperty.co.za/';
const OUTPUT_ROOT = path.join(process.cwd(), 'website-forensics', 'rioproperty', 'priority-4');

// پوشه‌بندی مجزا برای دارایی‌های اولویت ۴
const DIRS = {
  seo: path.join(OUTPUT_ROOT, 'seo-and-metadata'),
  techStack: path.join(OUTPUT_ROOT, 'tech-stack-and-libraries'),
  fonts: path.join(OUTPUT_ROOT, 'web-fonts-and-icons'),
  rawHtml: path.join(OUTPUT_ROOT, 'raw-html-dump')
};

const NAV_TIMEOUT = 60000;

// ایجاد پوشه‌ها
Object.values(DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

// -------------------------------------------------------------
// ۱. استخراج سئو، متاتگ‌ها و داده‌های ساختاریافته (Schema / JSON-LD)
// -------------------------------------------------------------
async function extractSEOData(page) {
  return page.evaluate(() => {
    const metaTags = [];
    document.querySelectorAll('meta').forEach((meta) => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
      const content = meta.getAttribute('content');
      if (name || content) {
        metaTags.push({ name, content });
      }
    });

    // استخراج Schema.org / JSON-LD
    const jsonLdScripts = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        jsonLdScripts.push(JSON.parse(script.innerText));
      } catch (e) {
        jsonLdScripts.push(script.innerText);
      }
    });

    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
    const title = document.title;
    const lang = document.documentElement.getAttribute('lang') || null;

    return {
      title,
      language: lang,
      canonicalUrl: canonical,
      metaCount: metaTags.length,
      metaTags,
      jsonLdSchemas: jsonLdScripts
    };
  });
}

// -------------------------------------------------------------
// ۲. شناسایی فریم‌ورک‌ها، اسکریپت‌ها و تکنولوژی‌های استفاده‌شده
// -------------------------------------------------------------
async function extractTechStack(page) {
  return page.evaluate(() => {
    const scripts = [];
    document.querySelectorAll('script[src]').forEach((s) => {
      scripts.push(s.getAttribute('src'));
    });

    // شناسایی متغیرها و فریم‌ورک‌های معروف متصل به window
    const detectedTech = {
      isWebflow: !!window.Webflow || document.documentElement.classList.contains('w-mod-js'),
      isJQuery: !!window.jQuery || !!window.$,
      isGSAP: !!window.gsap || !!window.TweenMax,
      isReact: !!window.React || !!document.querySelector('[data-reactroot]'),
      isVue: !!window.Vue,
      isGoogleAnalytics: !!window.ga || !!window.gtag || !!window.dataLayer,
      isGoogleTagManager: !!window.google_tag_manager,
      isHotjar: !!window.hj,
      isLottie: !!window.lottie
    };

    return {
      detectedTech,
      externalScriptUrls: scripts
    };
  });
}

// -------------------------------------------------------------
// ۳. شناسایی لینک‌های فونت‌های وب و آیکون‌ست‌ها
// -------------------------------------------------------------
async function extractFontsAndIcons(page) {
  return page.evaluate(() => {
    const fontLinks = [];
    document.querySelectorAll('link[rel*="stylesheet"], link[rel="preconnect"]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.includes('fonts') || href.includes('typekit') || href.includes('fontawesome') || href.includes('icon')) {
        fontLinks.push({
          rel: link.getAttribute('rel'),
          href
        });
      }
    });

    // دریافت تمامی فونت‌های بارگیری‌شده در مرورگر
    const loadedFontFaces = [];
    if (document.fonts) {
      document.fonts.forEach((font) => {
        loadedFontFaces.push({
          family: font.family,
          style: font.style,
          weight: font.weight,
          status: font.status
        });
      });
    }

    return {
      externalFontLinks: fontLinks,
      loadedFontFaces
    };
  });
}

// -------------------------------------------------------------
// ۴. اجرای فرایند استخراج
// -------------------------------------------------------------
(async () => {
  console.log('=============== [ استخراج اولویت ۴: سئو، متاتگ‌ها و تک‌استک ] ===============\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  console.log(`[+] در حال بارگیری صفحه: ${BASE_URL}`);
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  } catch (e) {
    console.log('[-] هشدار لود اولیه، ادامه عملیات...');
  }

  await new Promise((r) => setTimeout(r, 2000));

  console.log('[+] استخراج ساختار SEO، متاتگ‌ها و اسکیماها (Schema)...');
  const seoData = await extractSEOData(page);
  const seoReportPath = path.join(DIRS.seo, 'seo_and_metadata_report.json');
  fs.writeFileSync(seoReportPath, JSON.stringify(seoData, null, 2), 'utf8');

  console.log('[+] استخراج کدهای اسکریپت و شناسایی فریم‌ورک‌ها (Tech Stack)...');
  const techData = await extractTechStack(page);
  const techReportPath = path.join(DIRS.techStack, 'tech_stack_report.json');
  fs.writeFileSync(techReportPath, JSON.stringify(techData, null, 2), 'utf8');

  console.log('[+] استخراج لینک‌های فونت‌ها و آیکون‌ست‌های پروژه...');
  const fontData = await extractFontsAndIcons(page);
  const fontReportPath = path.join(DIRS.fonts, 'fonts_and_icons_report.json');
  fs.writeFileSync(fontReportPath, JSON.stringify(fontData, null, 2), 'utf8');

  console.log('[+] ذخیره خروجی کامل کدهای DOM/HTML خام صفحه...');
  const fullHtml = await page.content();
  const htmlDumpPath = path.join(DIRS.rawHtml, 'index_dump.html');
  fs.writeFileSync(htmlDumpPath, fullHtml, 'utf8');

  await browser.close();

  console.log('\n========================================================================');
  console.log('🎉 فرایند استخراج کامل وب‌سایت (تمامی ۴ اولویت) با موفقیت به پایان رسید!');
  console.log(`📄 گزارش SEO و متاتگ‌ها: ${seoReportPath}`);
  console.log(`📄 گزارش کتابخانه‌ها و اسکریپت‌ها: ${techReportPath}`);
  console.log(`📄 گزارش فونت‌ها و آیکون‌ها: ${fontReportPath}`);
  console.log(`📄 سورس HTML کامل صفحه: ${htmlDumpPath}`);
  console.log('========================================================================');
})();