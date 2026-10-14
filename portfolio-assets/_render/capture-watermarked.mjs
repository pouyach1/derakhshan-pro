/**
 * Capture real UI screenshots (desktop + mobile) and stamp VORQEN logo
 * so plates are not freely reusable without brand attribution.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_RAW = path.join(ROOT, "portfolio-assets", "plates", "raw");
const OUT_FINAL = path.join(ROOT, "portfolio-assets", "plates", "watermarked");
const LOGO = path.join(ROOT, "portfolio-assets", "brand", "vorqen-primary-logo.jpg");
const BASE = process.env.CAPTURE_BASE || "http://127.0.0.1:3000";
const STAFF_PASS = process.env.SEED_ADMIN_PASSWORD || "12345678";

fs.mkdirSync(OUT_RAW, { recursive: true });
fs.mkdirSync(OUT_FINAL, { recursive: true });

const PUBLIC_SHOTS = [
  { id: "01-home", path: "/", wait: 1800, fullPage: false },
  { id: "02-listings", path: "/listings", wait: 1200, fullPage: false },
  { id: "03-contact", path: "/contact", wait: 1200, fullPage: false },
  { id: "04-services", path: "/services", wait: 1000, fullPage: false },
  { id: "05-meet-team", path: "/meet-the-team", wait: 1000, fullPage: false },
];

const ADMIN_SHOTS = [
  { id: "06-admin-dashboard", path: "/admin/dashboard", wait: 1500 },
  { id: "07-admin-properties", path: "/admin/properties", wait: 1200 },
  { id: "08-admin-clients", path: "/admin/clients", wait: 1200 },
];

const AGENT_SHOTS = [
  { id: "09-agent-dashboard", path: "/agent/dashboard", wait: 1500 },
  { id: "10-agent-clients", path: "/agent/clients", wait: 1200 },
];

async function dismissOverlays(page) {
  try {
    // Skip intro / cookie / dialogs if present
    const skip = page.locator('button:has-text("رد کردن"), button:has-text("بستن"), button:has-text("Skip"), [data-intro-skip]');
    if (await skip.first().isVisible({ timeout: 800 }).catch(() => false)) {
      await skip.first().click({ timeout: 1000 }).catch(() => {});
    }
  } catch {
    /* ignore */
  }
  // Press Escape / End intro timers
  await page.keyboard.press("Escape").catch(() => {});
}

async function staffLogin(page, email) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 60000 });
  await dismissOverlays(page);
  const idInput = page.locator('#identifier, input[autocomplete="username"]').first();
  const passInput = page.locator('#password, input[type="password"]').first();
  await idInput.waitFor({ state: "visible", timeout: 15000 });
  await idInput.fill(email);
  await passInput.fill(STAFF_PASS);
  const submit = page.locator('button[type="submit"]').first();
  await Promise.all([
    page.waitForURL(/\/(admin|agent)\//, { timeout: 30000 }),
    submit.click(),
  ]).catch(async () => {
    const err = await page.locator('[role="alert"]').textContent().catch(() => "");
    throw new Error(`Login failed for ${email}: ${err || page.url()}`);
  });
}

async function captureViewport(browser, viewport, label, shots, cookies) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: label === "mobile" ? 2 : 1,
    locale: "fa-IR",
    colorScheme: "light",
  });
  if (cookies?.length) await context.addCookies(cookies);
  const page = await context.newPage();
  const files = [];
  for (const shot of shots) {
    const rawPath = path.join(OUT_RAW, `${label}-${shot.id}.png`);
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
      await page.goto(`${BASE}${shot.path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    });
    await dismissOverlays(page);
    await page.waitForTimeout(shot.wait || 1000);
    // Hide sticky chat widgets / next overlays that clutter
    await page.addStyleTag({
      content: `
        [data-nextjs-toast], nextjs-portal { display: none !important; }
      `,
    }).catch(() => {});
    await page.screenshot({
      path: rawPath,
      fullPage: Boolean(shot.fullPage),
      animations: "disabled",
    });
    files.push({ id: shot.id, rawPath, label });
    console.log("captured", label, shot.id);
  }
  const storage = await context.storageState();
  await context.close();
  return { files, cookies: storage.cookies };
}

async function watermark(rawPath, outPath, label) {
  const img = sharp(rawPath);
  const meta = await img.metadata();
  const w = meta.width || 1440;
  const h = meta.height || 900;

  // Logo size relative to viewport — large enough to brand, hard to crop out cleanly
  const logoW = Math.round(w * (label === "mobile" ? 0.28 : 0.16));
  const logoBuf = await sharp(LOGO)
    .resize({ width: logoW, withoutEnlargement: false })
    .ensureAlpha()
    .png()
    .toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();
  const logoH = logoMeta.height || Math.round(logoW * 0.4);

  // Semi-transparent diagonal wordmark strip + corner logo
  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0"/>
          <stop offset="45%" stop-color="#0a0a0a" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <g opacity="0.22" transform="rotate(-28 ${w * 0.5} ${h * 0.5})">
        <text x="50%" y="42%" text-anchor="middle" font-family="Georgia, serif"
          font-size="${Math.round(w * 0.055)}" fill="#ffffff" letter-spacing="10">VORQEN</text>
        <text x="50%" y="52%" text-anchor="middle" font-family="Georgia, serif"
          font-size="${Math.round(w * 0.022)}" fill="#f0e6d2" letter-spacing="6">PORTFOLIO · NOT FOR REUSE</text>
      </g>
      <rect x="${w - logoW - 28}" y="${h - logoH - 28}" width="${logoW + 16}" height="${logoH + 16}"
        rx="6" fill="#0b0b0b" fill-opacity="0.55"/>
    </svg>
  `);

  await sharp(rawPath)
    .composite([
      { input: svg, top: 0, left: 0 },
      { input: logoBuf, top: h - logoH - 20, left: w - logoW - 20 },
      // Second faint logo top-left so cropping one corner still leaves brand
      {
        input: await sharp(LOGO)
          .resize({ width: Math.round(logoW * 0.7) })
          .ensureAlpha()
          .modulate({ brightness: 1.05 })
          .png()
          .toBuffer()
          .then(async (buf) => {
            // reduce opacity via composite on transparent canvas
            const m = await sharp(buf).metadata();
            return sharp({
              create: {
                width: m.width,
                height: m.height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              },
            })
              .composite([{ input: buf, blend: "over" }])
              .ensureAlpha()
              .composite([
                {
                  input: Buffer.from(
                    `<svg width="${m.width}" height="${m.height}"><rect width="100%" height="100%" fill="white" fill-opacity="0.35"/></svg>`,
                  ),
                  blend: "dest-in",
                },
              ])
              .png()
              .toBuffer();
          }),
        top: 16,
        left: 16,
      },
    ])
    .png({ quality: 92, compressionLevel: 9 })
    .toFile(outPath);
}

async function main() {
  if (!fs.existsSync(LOGO)) throw new Error(`Missing logo: ${LOGO}`);

  const browser = await chromium.launch({ headless: true });
  const desk = { width: 1440, height: 900 };
  const mob = { width: 390, height: 844 };

  // Public (no auth)
  const pubDesk = await captureViewport(browser, desk, "desk", PUBLIC_SHOTS);
  const pubMob = await captureViewport(browser, mob, "mobile", PUBLIC_SHOTS);

  // Admin
  {
    const ctx = await browser.newContext({ viewport: desk, locale: "fa-IR" });
    const page = await ctx.newPage();
    await staffLogin(page, "admin@vorqen.ir");
    const cookies = (await ctx.storageState()).cookies;
    await ctx.close();
    await captureViewport(browser, desk, "desk", ADMIN_SHOTS, cookies);
    await captureViewport(browser, mob, "mobile", ADMIN_SHOTS, cookies);
  }

  // Agent (fresh login)
  {
    const ctx = await browser.newContext({ viewport: desk, locale: "fa-IR" });
    const page = await ctx.newPage();
    await staffLogin(page, "agent@vorqen.ir");
    const cookies = (await ctx.storageState()).cookies;
    await ctx.close();
    await captureViewport(browser, desk, "desk", AGENT_SHOTS, cookies);
    await captureViewport(browser, mob, "mobile", AGENT_SHOTS, cookies);
  }

  await browser.close();

  // Watermark all raw captures
  const rawFiles = fs.readdirSync(OUT_RAW).filter((f) => f.endsWith(".png"));
  for (const file of rawFiles) {
    const label = file.startsWith("mobile-") ? "mobile" : "desk";
    const out = path.join(OUT_FINAL, file.replace(/\.png$/, "-vorqen.png"));
    await watermark(path.join(OUT_RAW, file), out, label);
    console.log("watermarked", out);
  }

  // Also write a curated “top 10” index (desktop pack) for portfolio handoff
  const top10 = [
    "desk-01-home",
    "desk-02-listings",
    "desk-03-contact",
    "desk-04-services",
    "desk-05-meet-team",
    "desk-06-admin-dashboard",
    "desk-07-admin-properties",
    "desk-08-admin-clients",
    "desk-09-agent-dashboard",
    "desk-10-agent-clients",
  ];
  const packDir = path.join(ROOT, "portfolio-assets", "plates", "pack-10");
  fs.mkdirSync(packDir, { recursive: true });
  for (const id of top10) {
    const src = path.join(OUT_FINAL, `${id}-vorqen.png`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(packDir, `${id}-vorqen.png`));
    }
    const msrc = path.join(OUT_FINAL, `${id.replace(/^desk-/, "mobile-")}-vorqen.png`);
    if (fs.existsSync(msrc)) {
      fs.copyFileSync(msrc, path.join(packDir, path.basename(msrc)));
    }
  }

  console.log("DONE", {
    raw: rawFiles.length,
    watermarked: fs.readdirSync(OUT_FINAL).length,
    pack: fs.readdirSync(packDir).length,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
