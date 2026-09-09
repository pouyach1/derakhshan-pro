import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.rioproperty.co.za/';
const OUTPUT_ROOT = path.join(process.cwd(), 'website-forensics', 'rioproperty', 'priority-3');

// پوشه‌بندی مجزا برای دارایی‌های اولویت ۳
const DIRS = {
  hoverStates: path.join(OUTPUT_ROOT, 'interactive-hover-states'),
  forms: path.join(OUTPUT_ROOT, 'forms-and-inputs'),
  modals: path.join(OUTPUT_ROOT, 'modals-and-drawers'),
};

const NAV_TIMEOUT = 60000;

// ایجاد پوشه‌ها
Object.values(DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

// -------------------------------------------------------------
// ۱. استخراج حالت‌های Hover و Focus عناصر تعاملی
// -------------------------------------------------------------
async function extractInteractiveStates(page) {
  // شبیه‌سازی Hover و دریافت تغییرات استایل با استفاده از Playwright API
  const interactiveSelector = 'a, button, [role="button"], input[type="submit"], input[type="button"], .btn, .card';
  const interactiveElements = await page.$$(interactiveSelector);

  const hoverReport = [];
  const maxElementsToInspect = 30; // بررسی ۳۰ عنصر اصلی جهت جلوگیی از کندی شدید

  console.log(`  [+] در حال بررسی حالت Hover برای ${Math.min(interactiveElements.length, maxElementsToInspect)} عنصر تعاملی...`);

  for (let i = 0; i < Math.min(interactiveElements.length, maxElementsToInspect); i++) {
    const el = interactiveElements[i];

    try {
      // گرفتن استایل در حالت عادی (Normal State)
      const normalStyles = await el.evaluate((element) => {
        const s = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          text: element.innerText?.trim().slice(0, 30) || '',
          className: typeof element.className === 'string' ? element.className : '',
          backgroundColor: s.backgroundColor,
          color: s.color,
          borderColor: s.borderColor,
          transform: s.transform,
          boxShadow: s.boxShadow,
          opacity: s.opacity,
          transition: s.transition
        };
      });

      // اعمال Hover روی عنصر
      await el.hover();
      await page.waitForTimeout(100); // زمان برای اعمال Transition

      // گرفتن استایل در حالت Hover
      const hoverStyles = await el.evaluate((element) => {
        const s = getComputedStyle(element);
        return {
          backgroundColor: s.backgroundColor,
          color: s.color,
          borderColor: s.borderColor,
          transform: s.transform,
          boxShadow: s.boxShadow,
          opacity: s.opacity
        };
      });

      // بررسی آیا استایل در حالت Hover تغییر کرده است یا خیر
      const hasChanges = 
        normalStyles.backgroundColor !== hoverStyles.backgroundColor ||
        normalStyles.color !== hoverStyles.color ||
        normalStyles.borderColor !== hoverStyles.borderColor ||
        normalStyles.transform !== hoverStyles.transform ||
        normalStyles.boxShadow !== hoverStyles.boxShadow ||
        normalStyles.opacity !== hoverStyles.opacity;

      if (hasChanges) {
        hoverReport.push({
          element: {
            tag: normalStyles.tag,
            text: normalStyles.text,
            className: normalStyles.className
          },
          transition: normalStyles.transition,
          normalState: {
            backgroundColor: normalStyles.backgroundColor,
            color: normalStyles.color,
            borderColor: normalStyles.borderColor,
            transform: normalStyles.transform,
            boxShadow: normalStyles.boxShadow,
            opacity: normalStyles.opacity
          },
          hoverState: hoverStyles
        });
      }
    } catch (e) {
      // نادیده گرفتن المان‌های پنهان یا غیرقابل Hover
    }
  }

  return hoverReport;
}

// -------------------------------------------------------------
// ۲. استخراج فرم‌ها، فیلدها و استایل دقیق ورودی‌ها (Forms & Inputs UI)
// -------------------------------------------------------------
async function extractFormElements(page) {
  return page.evaluate(() => {
    const formsData = [];

    document.querySelectorAll('form').forEach((form, fIdx) => {
      const inputsData = [];

      form.querySelectorAll('input, select, textarea, button').forEach((input) => {
        const s = getComputedStyle(input);
        
        inputsData.push({
          tag: input.tagName.toLowerCase(),
          type: input.getAttribute('type') || 'text',
          name: input.getAttribute('name') || null,
          placeholder: input.getAttribute('placeholder') || null,
          required: input.hasAttribute('required'),
          styles: {
            width: s.width,
            height: s.height,
            padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
            margin: `${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft}`,
            backgroundColor: s.backgroundColor,
            color: s.color,
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
            borderRadius: s.borderRadius,
            outline: s.outline,
            boxShadow: s.boxShadow
          }
        });
      });

      formsData.push({
        formId: form.id || `form-${fIdx + 1}`,
        action: form.getAttribute('action') || null,
        method: form.getAttribute('method') || 'get',
        inputsCount: inputsData.length,
        inputs: inputsData
      });
    });

    return formsData;
  });
}

// -------------------------------------------------------------
// ۳. شناسایی کامپوننت‌های شناور (Modals, Popups, Drawers)
// -------------------------------------------------------------
async function extractFloatingComponents(page) {
  return page.evaluate(() => {
    const floatingElements = [];
    const selectors = '[class*="modal"], [class*="popup"], [class*="drawer"], [class*="overlay"], [class*="dialog"], [role="dialog"]';

    document.querySelectorAll(selectors).forEach((el, idx) => {
      const s = getComputedStyle(el);
      floatingElements.push({
        id: el.id || `floating-${idx + 1}`,
        className: typeof el.className === 'string' ? el.className : '',
        display: s.display,
        visibility: s.visibility,
        position: s.position,
        zIndex: s.zIndex,
        backgroundColor: s.backgroundColor,
        boxShadow: s.boxShadow
      });
    });

    return floatingElements;
  });
}

// -------------------------------------------------------------
// ۴. اجرای فرایند استخراج
// -------------------------------------------------------------
(async () => {
  console.log('=============== [ استخراج اولویت ۳: حالت‌های تعاملی و فرم‌ها ] ===============\n');

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

  console.log('[+] استخراج حالت‌های تعاملی (Hover States) دکمه‌ها و لینک‌ها...');
  const hoverData = await extractInteractiveStates(page);
  const hoverReportPath = path.join(DIRS.hoverStates, 'hover_states_report.json');
  fs.writeFileSync(hoverReportPath, JSON.stringify(hoverData, null, 2), 'utf8');

  console.log('[+] استخراج ساختار فرم‌ها و استایل فیلدهای ورودی...');
  const formsData = await extractFormElements(page);
  const formsReportPath = path.join(DIRS.forms, 'forms_and_inputs_report.json');
  fs.writeFileSync(formsReportPath, JSON.stringify(formsData, null, 2), 'utf8');

  console.log('[+] شناسایی کامپوننت‌های شناور (Modals / Popups / Drawers)...');
  const floatingData = await extractFloatingComponents(page);
  const modalsReportPath = path.join(DIRS.modals, 'floating_components_report.json');
  fs.writeFileSync(modalsReportPath, JSON.stringify(floatingData, null, 2), 'utf8');

  await browser.close();

  console.log('\n========================================================================');
  console.log('✅ فرایند استخراج اولویت ۳ با موفقیت کامل شد!');
  console.log(`📄 گزارش حالت‌های Hover/Focus: ${hoverReportPath}`);
  console.log(`📄 گزارش کامل فرم‌ها و اینپوت‌ها: ${formsReportPath}`);
  console.log(`📄 گزارش مدال‌ها و پاپ‌آپ‌ها: ${modalsReportPath}`);
  console.log('========================================================================');
})();