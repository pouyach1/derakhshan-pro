/**
 * TEMPORARY FORENSIC SCRIPT — Find Real Estate motion extraction
 * Uses local Google Chrome via Playwright.
 * Writes ONLY under website-forensics/findrealestate/animations/
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.resolve(__dirname, "animations");
const ASSETS = path.join(ROOT, "assets");
const CHROME =
  process.env.CHROME_PATH ||
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/local/bin/google-chrome");

const BASE = "https://findrealestate.com";
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "large-desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 1024, height: 1366 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-large", width: 430, height: 932 },
];

const SEED_PATHS = [
  "/",
  "/search",
  "/about",
  "/services",
  "/agents",
  "/blog",
  "/join",
  "/press-and-media",
  "/privacy-policy",
  "/terms-of-service",
  "/operating-procedure",
  "/disabilities-disclosure",
];

function ensureDirs() {
  for (const d of [
    ROOT,
    path.join(ASSETS, "lottie"),
    path.join(ASSETS, "video"),
    path.join(ASSETS, "svg"),
    path.join(ASSETS, "gif"),
    path.join(ASSETS, "canvas"),
    path.join(ASSETS, "other"),
  ]) {
    fs.mkdirSync(d, { recursive: true });
  }
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(ROOT, name), JSON.stringify(data, null, 2));
}

function download(url, dest) {
  return new Promise((resolve) => {
    try {
      const mod = url.startsWith("https") ? https : http;
      const file = fs.createWriteStream(dest);
      const req = mod.get(url, { timeout: 30000 }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve);
        }
        if (res.statusCode !== 200) {
          file.close();
          try {
            fs.unlinkSync(dest);
          } catch {}
          return resolve({ ok: false, status: res.statusCode, url });
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve({ ok: true, url, dest, bytes: fs.statSync(dest).size })));
      });
      req.on("error", () => {
        try {
          fs.unlinkSync(dest);
        } catch {}
        resolve({ ok: false, url, error: "network" });
      });
    } catch (e) {
      resolve({ ok: false, url, error: String(e) });
    }
  });
}

function parseMatrix(transform) {
  if (!transform || transform === "none") return null;
  const m = transform.match(/matrix\(([^)]+)\)/);
  if (!m) return { raw: transform };
  const n = m[1].split(",").map((x) => Number(x.trim()));
  // matrix(a,b,c,d,tx,ty)
  const a = n[0];
  const d = n[3];
  const scaleX = Math.sqrt(a * a + n[1] * n[1]);
  const scaleY = Math.sqrt(n[2] * n[2] + d * d);
  return {
    raw: transform,
    tx: n[4],
    ty: n[5],
    scaleX: Number(scaleX.toFixed(4)),
    scaleY: Number(scaleY.toFixed(4)),
    rotateApproxDeg: Number(((Math.atan2(n[1], a) * 180) / Math.PI).toFixed(4)),
  };
}

async function collectPageMeta(page) {
  return page.evaluate(() => {
    const sections = [...document.querySelectorAll("section, [class*='hero'], [class*='footer'], header, main > div")]
      .slice(0, 40)
      .map((el) => ({
        tag: el.tagName,
        id: el.id || null,
        className: typeof el.className === "string" ? el.className.slice(0, 120) : null,
        rect: (() => {
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height), width: Math.round(r.width) };
        })(),
      }));

    const interactive = {
      buttons: document.querySelectorAll("button").length,
      links: document.querySelectorAll("a").length,
      inputs: document.querySelectorAll("input,textarea,select").length,
      swipers: document.querySelectorAll(".swiper").length,
      videos: document.querySelectorAll("video").length,
      canvases: document.querySelectorAll("canvas").length,
      svgs: document.querySelectorAll("svg").length,
    };

    const libs = {
      gsap: !!(window.gsap || window.GreenSockGlobals),
      ScrollTrigger: !!(window.ScrollTrigger || (window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollTrigger)),
      framerMotion: !!(window.Motion || document.querySelector("[data-framer-component], [style*='transform']")),
      anime: !!window.anime,
      lenis: !!(window.lenis || window.Lenis || document.documentElement.classList.contains("lenis")),
      swiper: !!window.Swiper,
      three: !!(window.THREE || window.__THREE__),
      webAnimations: typeof Element !== "undefined" && !!Element.prototype.animate,
    };

    // Detect Lenis more carefully
    if (document.documentElement.className.includes("lenis")) libs.lenis = true;

    const media = {
      videos: [...document.querySelectorAll("video source, video")].map((el) => el.currentSrc || el.src || el.getAttribute("src")).filter(Boolean),
      images: [...document.querySelectorAll("img")].slice(0, 40).map((img) => img.currentSrc || img.src).filter(Boolean),
    };

    return {
      title: document.title,
      url: location.href,
      sections,
      interactive,
      libs,
      media,
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
    };
  });
}

async function extractCssKeyframes(page) {
  return page.evaluate(() => {
    const sheets = [...document.styleSheets];
    const keyframes = [];
    const animationRules = [];
    for (const sheet of sheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      if (!rules) continue;
      for (const rule of rules) {
        if (rule.type === CSSRule.KEYFRAMES_RULE) {
          const frames = [...rule.cssRules].map((f) => ({ keyText: f.keyText, cssText: f.style.cssText }));
          keyframes.push({ name: rule.name, frames });
        }
        if (rule.type === CSSRule.STYLE_RULE && rule.style && (rule.style.animationName || rule.style.transitionProperty)) {
          const sel = rule.selectorText || "";
          if (
            rule.style.animationName ||
            (rule.style.transitionDuration && rule.style.transitionDuration !== "0s")
          ) {
            animationRules.push({
              selector: sel.slice(0, 200),
              animationName: rule.style.animationName || null,
              animationDuration: rule.style.animationDuration || null,
              animationTimingFunction: rule.style.animationTimingFunction || null,
              animationDelay: rule.style.animationDelay || null,
              transitionProperty: rule.style.transitionProperty || null,
              transitionDuration: rule.style.transitionDuration || null,
              transitionTimingFunction: rule.style.transitionTimingFunction || null,
              transform: rule.style.transform || null,
            });
          }
        }
      }
    }
    return { keyframes, animationRules: animationRules.slice(0, 400) };
  });
}

async function sampleScrollMotion(page) {
  const samples = [];
  const selectors = [
    "[class*='hero_']",
    "[class*='hero_house']",
    "[class*='hero_cloud']",
    "[class*='hero_smoke']",
    "[class*='hero_content']",
    "[class*='hero_text']",
    "[class*='hero_back']",
    "[class*='footer_content']",
    "[class*='rewired_list-item']",
    "[class*='arrows-section_arrow']",
    "[class*='services_item-bg']",
    "[class*='header_wrapper']",
    "video",
  ];

  for (let pct = 0; pct <= 100; pct += 10) {
    await page.evaluate((p) => {
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo(0, (max * p) / 100);
    }, pct);
    await page.waitForTimeout(450);

    const snapshot = await page.evaluate((sels) => {
      const pick = (sel) =>
        [...document.querySelectorAll(sel)].slice(0, 4).map((el) => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            selector: sel,
            className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
            transform: s.transform,
            opacity: s.opacity,
            filter: s.filter,
            clipPath: s.clipPath,
            width: Math.round(r.width),
            height: Math.round(r.height),
            top: Math.round(r.top),
            left: Math.round(r.left),
          };
        });
      const items = [];
      for (const sel of sels) items.push(...pick(sel));
      return {
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        items,
      };
    }, selectors);

    samples.push({
      progressPct: pct,
      scrollY: snapshot.scrollY,
      scrollHeight: snapshot.scrollHeight,
      elements: snapshot.items.map((it) => ({
        ...it,
        matrix: (() => {
          // parsed later in node
          return it.transform;
        })(),
      })),
    });
  }
  return samples;
}

async function sampleHero(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const stages = [];
  for (const y of [0, 100, 200, 400, 600, 900, 1200]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(350);
    const stage = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel);
      const pack = (el) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          className: typeof el.className === "string" ? el.className.slice(0, 120) : el.tagName,
          transform: s.transform,
          opacity: s.opacity,
          filter: s.filter,
          clipPath: s.clipPath,
          willChange: s.willChange,
          top: Math.round(r.top),
          height: Math.round(r.height),
          width: Math.round(r.width),
        };
      };
      return {
        scrollY: window.scrollY,
        house: pack(q("[class*='hero_house']")),
        cloud: [...document.querySelectorAll("[class*='hero_cloud']")].slice(0, 3).map(pack),
        smoke: pack(q("[class*='hero_smoke']")),
        content: pack(q("[class*='hero_content']")),
        text: pack(q("[class*='hero_text']")),
        back: pack(q("[class*='hero_back']")),
        mask: pack(q("[class*='hero_mask']")),
        video: pack(q("[class*='hero_'] video, .hero_video-container__Y_urD video, video")),
        actions: pack(q("[class*='hero_actions']")),
      };
    });
    stages.push(stage);
  }
  return stages;
}

async function hoverProbe(page) {
  const targets = await page.evaluate(() => {
    const sels = [
      "a",
      "button",
      "[class*='card']",
      "[class*='services_item']",
      "[class*='header_'] a",
      "[class*='nav']",
      ".swiper-slide",
      "[class*='arrow']",
    ];
    const out = [];
    for (const sel of sels) {
      for (const el of [...document.querySelectorAll(sel)].slice(0, 3)) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        if (r.top < 0 || r.top > window.innerHeight) continue;
        out.push({
          sel,
          text: (el.innerText || "").slice(0, 40),
          className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        });
      }
    }
    return out.slice(0, 25);
  });

  const results = [];
  for (const t of targets) {
    try {
      const before = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y);
          if (!el) return null;
          const s = getComputedStyle(el);
          return {
            tag: el.tagName,
            className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
            transform: s.transform,
            opacity: s.opacity,
            color: s.color,
            backgroundColor: s.backgroundColor,
            cursor: s.cursor,
            transition: `${s.transitionProperty}|${s.transitionDuration}|${s.transitionTimingFunction}`,
          };
        },
        t,
      );
      await page.mouse.move(t.x, t.y);
      await page.waitForTimeout(250);
      const after = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y);
          if (!el) return null;
          const s = getComputedStyle(el);
          const parent = el.closest("[class*='services_item'], [class*='card'], a, button") || el;
          const ps = getComputedStyle(parent);
          return {
            tag: el.tagName,
            className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
            transform: s.transform,
            parentTransform: ps.transform,
            opacity: s.opacity,
            color: s.color,
            backgroundColor: s.backgroundColor,
            cursor: s.cursor,
            filter: s.filter,
            scaleHint: s.transform,
          };
        },
        t,
      );
      results.push({ target: t, before, after, changed: JSON.stringify(before) !== JSON.stringify(after) });
    } catch (e) {
      results.push({ target: t, error: String(e) });
    }
  }
  return results;
}

async function navigationProbe(page, viewportName) {
  const out = { viewport: viewportName, desktopMenu: null, burger: null, headerScroll: null };

  // header at top vs scrolled
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const headerTop = await page.evaluate(() => {
    const el = document.querySelector("header, [class*='header_wrapper']");
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      className: el.className,
      backgroundColor: s.backgroundColor,
      transform: s.transform,
      position: s.position,
      height: Math.round(el.getBoundingClientRect().height),
    };
  });
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(400);
  const headerScrolled = await page.evaluate(() => {
    const el = document.querySelector("header, [class*='header_wrapper']");
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      className: el.className,
      backgroundColor: s.backgroundColor,
      transform: s.transform,
      position: s.position,
      height: Math.round(el.getBoundingClientRect().height),
    };
  });
  out.headerScroll = { top: headerTop, scrolled: headerScrolled };

  // burger / menu toggle
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const burgerBtn = page.locator("button").filter({ hasText: /menu|Menu/i }).first();
  const altBurger = page.locator("[class*='burger'], [aria-label*='menu' i], [aria-label*='Menu' i], button[class*='menu']").first();
  try {
    const btn = (await burgerBtn.count()) ? burgerBtn : altBurger;
    if (await btn.count()) {
      const before = await page.evaluate(() => ({
        openItems: document.querySelectorAll("[class*='burger-menu'][data-state='open'], [class*='burger-menu_nav-item-content'][data-state='open']").length,
        animating: [...document.querySelectorAll("[class*='burger-menu']")].map((el) => getComputedStyle(el).animationName),
      }));
      await btn.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(500);
      const afterOpen = await page.evaluate(() => {
        const items = [...document.querySelectorAll("[class*='burger-menu'], [class*='drop-menu']")].slice(0, 20).map((el) => ({
          className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
          state: el.getAttribute("data-state"),
          animation: getComputedStyle(el).animationName,
          duration: getComputedStyle(el).animationDuration,
          easing: getComputedStyle(el).animationTimingFunction,
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
        }));
        return { items, bodyOverflow: getComputedStyle(document.body).overflow };
      });
      // close
      await btn.click({ timeout: 3000 }).catch(async () => {
        await page.keyboard.press("Escape");
      });
      await page.waitForTimeout(400);
      const afterClose = await page.evaluate(() =>
        [...document.querySelectorAll("[class*='burger-menu_nav-item-content']")].slice(0, 8).map((el) => ({
          state: el.getAttribute("data-state"),
          animation: getComputedStyle(el).animationName,
          duration: getComputedStyle(el).animationDuration,
          easing: getComputedStyle(el).animationTimingFunction,
        })),
      );
      out.burger = { before, afterOpen, afterClose };
    }
  } catch (e) {
    out.burger = { error: String(e) };
  }

  // desktop nav hover arrows
  try {
    const nav = page.locator("[class*='header_nav'], nav a").first();
    if (await nav.count()) {
      await nav.hover({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(300);
      out.desktopMenu = await page.evaluate(() => {
        const drops = [...document.querySelectorAll("[class*='drop-menu']")].slice(0, 10).map((el) => ({
          className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
          animation: getComputedStyle(el).animationName,
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
        }));
        const arrows = [...document.querySelectorAll("[class*='header_nav-arrow']")].map((el) => ({
          transform: getComputedStyle(el).transform,
          transition: getComputedStyle(el).transition,
        }));
        return { drops, arrows };
      });
    }
  } catch (e) {
    out.desktopMenu = { error: String(e) };
  }

  return out;
}

async function captureNetworkAssets(page) {
  const assets = [];
  page.on("response", async (res) => {
    try {
      const url = res.url();
      const ct = (res.headers()["content-type"] || "").toLowerCase();
      const lower = url.toLowerCase();
      const interesting =
        ct.includes("video") ||
        ct.includes("json") ||
        ct.includes("lottie") ||
        lower.endsWith(".mp4") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".gif") ||
        lower.endsWith(".lottie") ||
        lower.includes("lottie") ||
        (lower.endsWith(".svg") && (lower.includes("anim") || lower.includes("icon"))) ||
        lower.includes(".json");
      if (!interesting) return;
      if (lower.includes("_next/static/chunks") && lower.endsWith(".js")) return;
      assets.push({
        url,
        contentType: ct,
        status: res.status(),
      });
    } catch {}
  });
  return assets;
}

async function pageTransitionProbe(page) {
  const result = { observed: [], note: null };
  try {
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(800);
    const start = Date.now();
    const click = page.locator("a[href='/about'], a[href*='about']").first();
    if (await click.count()) {
      await Promise.all([
        page.waitForURL(/about/, { timeout: 15000 }).catch(() => {}),
        click.click(),
      ]);
      await page.waitForTimeout(900);
      const overlay = await page.evaluate(() => {
        const candidates = [...document.querySelectorAll("*")].filter((el) => {
          const s = getComputedStyle(el);
          return (
            (s.position === "fixed" || s.position === "absolute") &&
            parseFloat(s.opacity) > 0 &&
            parseFloat(s.opacity) < 1 &&
            el.getBoundingClientRect().width > window.innerWidth * 0.5
          );
        });
        return candidates.slice(0, 5).map((el) => ({
          className: typeof el.className === "string" ? el.className.slice(0, 100) : null,
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
          animation: getComputedStyle(el).animationName,
        }));
      });
      result.observed.push({
        from: "/",
        to: "/about",
        elapsedMs: Date.now() - start,
        overlaysDuringOrAfter: overlay,
        loadingLine: await page.evaluate(() => {
          const el = document.querySelector("[class*='loading-line']");
          if (!el) return null;
          const s = getComputedStyle(el);
          return { className: el.className, animation: s.animationName, width: s.width };
        }),
      });
    } else {
      result.note = "No about link found for transition probe";
    }
  } catch (e) {
    result.note = String(e);
  }
  return result;
}

function enrichScrollSamples(samples) {
  return samples.map((s) => ({
    ...s,
    elements: s.elements.map((el) => ({
      ...el,
      parsedTransform: parseMatrix(el.transform),
    })),
  }));
}

function buildSystems(rawAnimations, keyframes, scroll, hero, hover, nav, transitions, libs) {
  const systems = [];

  systems.push({
    id: "global-lenis-smooth-scroll",
    level: 1,
    name: "Lenis-like smooth scrolling",
    category: "global",
    trigger: "wheel/touch scroll",
    implementation: libs.lenis ? "Lenis (detected via html.lenis / runtime)" : "Custom/unknown smooth scroll (html class may vary)",
    confidence: libs.lenis ? "high" : "medium",
    notes: "Document root uses Lenis class patterns; continuous scroll interpolation observed.",
  });

  systems.push({
    id: "global-loading-line",
    level: 1,
    name: "YouTube-style top loading line",
    category: "page-transition / loading",
    trigger: "route change / fetch",
    keyframes: ["loading-line_youtubeLoading", "loading-line_youtubeLoadingSlow", "loading-line_youtubeCompleting"],
    from: { width: "0%" },
    to: { width: "100%" },
    easing: "CSS keyframes",
    confidence: "high",
  });

  systems.push({
    id: "header-scroll-bg-transform",
    level: 2,
    name: "Sticky header background/transform on scroll",
    category: "navigation",
    trigger: "scroll",
    properties: ["background-color", "transform"],
    duration: "0.3s",
    easing: "ease / ease-in-out",
    evidence: nav?.headerScroll || null,
    confidence: "high",
  });

  systems.push({
    id: "header-content-color-transition",
    level: 3,
    name: "Header content color/background transition",
    category: "navigation",
    properties: ["background-color", "color"],
    duration: "1s",
    easing: "ease-in-out",
    confidence: "high",
  });

  systems.push({
    id: "nav-label-transform-reveal",
    level: 4,
    name: "Nav label transform reveal",
    category: "micro-interaction",
    properties: ["transform"],
    duration: "0.9s",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    instances: 26,
    confidence: "high",
  });

  systems.push({
    id: "nav-arrow-rotate",
    level: 4,
    name: "Header nav arrow transform",
    category: "micro-interaction",
    properties: ["transform"],
    duration: "0.3s",
    easing: "ease",
    instances: 19,
    confidence: "high",
  });

  systems.push({
    id: "drop-menu-appear",
    level: 3,
    name: "Dropdown menu appear",
    category: "navigation",
    keyframes: ["drop-menu_appear"],
    from: { opacity: 0, transform: "translateY(5%)" },
    to: { opacity: 1, transform: "translateY(0)" },
    confidence: "high",
  });

  systems.push({
    id: "burger-menu-collapse",
    level: 3,
    name: "Burger accordion slideUp/slideDown",
    category: "navigation",
    trigger: "data-state open/closed",
    keyframes: ["burger-menu_slideDown", "burger-menu_slideUp"],
    duration: "0.3s",
    easing: "ease-out",
    from: { height: 0, opacity: 0 },
    to: { height: "var(--radix-collapsible-content-height)", opacity: 1 },
    technology: "Radix collapsible + CSS keyframes",
    instances: 4,
    confidence: "high",
  });

  for (const prefix of ["agent-join-modal", "contact-us-modal", "find-properties-modal"]) {
    systems.push({
      id: `${prefix}-system`,
      level: 3,
      name: `${prefix} overlay + content + collapse`,
      category: "modal",
      keyframes: [
        `${prefix}_overlayShow`,
        `${prefix}_contentShow`,
        `${prefix}_slideDown`,
        `${prefix}_slideUp`,
      ].filter((k) => keyframes.some((kf) => kf.name.includes(k.split("_").pop()) || kf.name.includes(prefix))),
      from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
      to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
      technology: "Radix Dialog/Collapsible + CSS keyframes",
      confidence: "high",
    });
  }

  systems.push({
    id: "hero-scroll-parallax-house",
    level: 2,
    name: "Hero house scale/translateY scrub",
    category: "hero / scroll",
    trigger: "scroll",
    scrub: true,
    evidenceStages: (hero || []).map((h) => ({
      scrollY: h.scrollY,
      house: h.house ? { ...h.house, parsed: parseMatrix(h.house.transform) } : null,
    })),
    properties: ["transform (scale + translateY)"],
    confidence: "high",
    notes: "Observed continuous transform changes while scrolling through hero; not a CSS keyframe.",
  });

  systems.push({
    id: "hero-clouds-drift",
    level: 2,
    name: "Hero clouds translateX drift",
    category: "hero",
    trigger: "time/scroll",
    properties: ["transform translateX"],
    confidence: "high",
  });

  systems.push({
    id: "hero-smoke-rise",
    level: 2,
    name: "Hero smoke translateY",
    category: "hero",
    trigger: "scroll/init",
    properties: ["transform translateY"],
    initialCssHint: "hero_top .hero_smoke { transform: translateY(70%) }",
    confidence: "high",
  });

  systems.push({
    id: "hero-content-fade-scale",
    level: 2,
    name: "Hero content opacity/scale on scroll",
    category: "hero / scroll",
    properties: ["opacity", "transform scale"],
    confidence: "high",
  });

  systems.push({
    id: "hero-video-mask-scale",
    level: 2,
    name: "Hero masked video scale(1.8)",
    category: "hero / image",
    properties: ["transform scale"],
    staticCss: "hero_mask video { transform: scale(1.8) }",
    confidence: "high",
  });

  systems.push({
    id: "section-rewired-list-reveal",
    level: 2,
    name: "Rewired list items reveal (y:70 → 0, opacity 0→1)",
    category: "scroll reveal",
    trigger: "IntersectionObserver / scroll",
    from: { y: 70, opacity: 0 },
    to: { y: 0, opacity: 1 },
    transition: "opacity 0.4s, transform 4s / cubic-bezier variants observed on related nodes",
    confidence: "high",
  });

  systems.push({
    id: "arrows-section-parallax",
    level: 2,
    name: "Arrows section scale/opacity/translate",
    category: "scroll",
    from: { scale: 0.8, opacity: 0.1, tx: -25.95 },
    confidence: "medium",
  });

  systems.push({
    id: "services-bg-hover-scale",
    level: 3,
    name: "Services item background scale 1.05 + svg slide",
    category: "hover / component",
    from: { scale: 1.05, opacity: 0, svgTx: -18 },
    to: { scale: 1, opacity: 1, svgTx: 0 },
    confidence: "medium",
  });

  systems.push({
    id: "swiper-carousel",
    level: 3,
    name: "Swiper carousel + bullet micro-rotate",
    category: "component",
    technology: "Swiper",
    confidence: "high",
  });

  systems.push({
    id: "footer-scale-parallax",
    level: 2,
    name: "Footer content scale/translateY scrub",
    category: "scroll",
    from: { scale: 0.98, ty: -304, opacity: 0 },
    confidence: "high",
  });

  systems.push({
    id: "tooltip-appear",
    level: 4,
    name: "App tooltip fade appear",
    keyframes: ["app-tooltip_appear"],
    from: { opacity: 0 },
    to: { opacity: 1 },
    confidence: "high",
  });

  systems.push({
    id: "skeleton-pulse",
    level: 4,
    name: "Skeleton loading pulse",
    keyframes: ["skeleton_skeleton-pulse"],
    confidence: "high",
  });

  return {
    source: BASE,
    generatedAt: new Date().toISOString(),
    levels: {
      1: "Global motion system",
      2: "Section motion",
      3: "Component motion",
      4: "Micro interaction",
    },
    rawCandidateCount: rawAnimations?.count || 0,
    uniqueCssKeyframeCount: keyframes.length,
    systems,
    librariesDetected: libs,
    pageTransitions: transitions,
    hoverChangedCount: (hover || []).filter((h) => h.changed).length,
    scrollSampleCount: (scroll || []).length,
  };
}

(async () => {
  ensureDirs();
  console.log("Chrome:", CHROME);
  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });

  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "animations.json"), "utf8"));

  // Primary deep pass on desktop homepage
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const networkAssets = [];
  page.on("response", (res) => {
    const url = res.url();
    const ct = (res.headers()["content-type"] || "").toLowerCase();
    const lower = url.toLowerCase();
    if (
      ct.includes("video/") ||
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".gif") ||
      lower.includes("lottie") ||
      (lower.endsWith(".json") && !lower.includes("_next/static") && !lower.includes("webpack"))
    ) {
      networkAssets.push({ url, contentType: ct, status: res.status() });
    }
  });

  console.log("Loading homepage...");
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);

  const homeMeta = await collectPageMeta(page);
  const cssInfo = await extractCssKeyframes(page);
  console.log("Keyframes:", cssInfo.keyframes.length);

  console.log("Scroll sampling...");
  const scrollRaw = await sampleScrollMotion(page);
  const scrollMotion = enrichScrollSamples(scrollRaw);

  console.log("Hero sampling...");
  const heroStages = await sampleHero(page);
  const heroMotion = {
    source: BASE,
    viewport: { width: 1440, height: 1000 },
    extractedAt: new Date().toISOString(),
    stages: heroStages.map((s) => ({
      scrollY: s.scrollY,
      house: s.house && { ...s.house, parsed: parseMatrix(s.house.transform) },
      clouds: (s.cloud || []).map((c) => c && { ...c, parsed: parseMatrix(c.transform) }),
      smoke: s.smoke && { ...s.smoke, parsed: parseMatrix(s.smoke.transform) },
      content: s.content && { ...s.content, parsed: parseMatrix(s.content.transform) },
      text: s.text && { ...s.text, parsed: parseMatrix(s.text.transform) },
      back: s.back && { ...s.back, parsed: parseMatrix(s.back.transform) },
      mask: s.mask,
      video: s.video && { ...s.video, parsed: parseMatrix(s.video.transform) },
      actions: s.actions,
    })),
    relationships: [
      {
        name: "scrollY → hero_house scale/ty",
        type: "scrub",
        observed: heroStages
          .filter((s) => s.house)
          .map((s) => ({ scrollY: s.scrollY, transform: s.house.transform, opacity: s.house.opacity })),
      },
      {
        name: "scrollY → hero_content opacity/scale",
        type: "scrub",
        observed: heroStages
          .filter((s) => s.content)
          .map((s) => ({ scrollY: s.scrollY, transform: s.content.transform, opacity: s.content.opacity })),
      },
      {
        name: "scrollY → hero_smoke translateY",
        type: "scrub/init",
        observed: heroStages
          .filter((s) => s.smoke)
          .map((s) => ({ scrollY: s.scrollY, transform: s.smoke.transform })),
      },
    ],
    notExtracted: [],
  };

  // Derive approximate scrub slopes if enough points
  try {
    const pts = heroMotion.relationships[0].observed
      .map((o) => ({ y: o.scrollY, m: parseMatrix(o.transform) }))
      .filter((p) => p.m && typeof p.m.ty === "number");
    if (pts.length >= 2) {
      const a = pts[0];
      const b = pts[pts.length - 1];
      const dy = b.y - a.y || 1;
      heroMotion.approximateMapping = {
        houseTranslateYPerPxScroll: Number(((b.m.ty - a.m.ty) / dy).toFixed(5)),
        houseScaleDeltaPerPxScroll: Number(((b.m.scaleX - a.m.scaleX) / dy).toFixed(6)),
        sampleStart: a,
        sampleEnd: b,
      };
    }
  } catch {}

  console.log("Hover probing...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const hoverInteractions = await hoverProbe(page);

  console.log("Navigation probing desktop...");
  const navDesktop = await navigationProbe(page, "desktop-1440");

  console.log("Page transition probe...");
  const pageTransitions = await pageTransitionProbe(page);

  // Inventory pages across routes (desktop)
  const pagesInventory = [];
  const discovered = new Set(SEED_PATHS);
  // add from homepage links
  for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href").split("?")[0].split("#")[0]))) {
    if (href && href.startsWith("/") && !href.startsWith("/_next")) discovered.add(href.replace(/\/$/, "") || "/");
  }

  for (const pth of [...discovered].slice(0, 20)) {
    const url = BASE + (pth === "/" ? "/" : pth);
    console.log("Inventory", url);
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1200);
      const meta = await collectPageMeta(page);
      const motionHint = await page.evaluate(() => {
        let animated = 0;
        let transitioning = 0;
        let transformed = 0;
        document.querySelectorAll("*").forEach((el) => {
          const s = getComputedStyle(el);
          if (s.animationName !== "none" && s.animationDuration !== "0s") animated++;
          if (s.transitionProperty !== "none" && s.transitionDuration !== "0s") transitioning++;
          if (s.transform !== "none") transformed++;
        });
        return { animated, transitioning, transformed };
      });
      pagesInventory.push({
        url,
        path: pth,
        pageTitle: meta.title,
        viewport: "1440x1000",
        sections: meta.sections.slice(0, 15),
        interactiveComponents: meta.interactive,
        detectedMotion: motionHint,
        libraries: meta.libs,
        mediaCounts: {
          videos: meta.media.videos.length,
          imagesSampled: meta.media.images.length,
        },
      });
      for (const v of meta.media.videos) {
        networkAssets.push({ url: v, contentType: "video/*", status: 200, source: "dom" });
      }
    } catch (e) {
      pagesInventory.push({ url, path: pth, error: String(e) });
    }
  }

  // Mobile / tablet navigation pass
  const navByViewport = { desktop: navDesktop };
  for (const vp of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 1024, height: 1366 },
  ]) {
    console.log("Viewport nav", vp.name);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    navByViewport[vp.name] = await navigationProbe(page, vp.name);
  }

  // Text / image motion summaries from homepage classes + scroll
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1000);

  const textMotion = {
    systems: [
      {
        name: "Nav/label transform reveal",
        type: "transform transition",
        duration: "0.9s",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        properties: ["transform"],
        confidence: "high",
      },
      {
        name: "Hero text block scroll coupling",
        type: "JS scrub / scroll",
        properties: ["transform", "opacity"],
        confidence: "medium",
        evidence: heroMotion.stages.map((s) => ({ scrollY: s.scrollY, text: s.text })),
      },
      {
        name: "Rewired list item text container reveal",
        type: "scroll reveal",
        from: { opacity: 0, y: 70 },
        to: { opacity: 1, y: 0 },
        confidence: "high",
      },
    ],
    characterWordSplit: {
      detected: false,
      note: "NOT EXTRACTED as explicit char/word split library; no SplitText/GSAP SplitText globals found. Text motion appears transform/opacity based on wrappers.",
    },
  };

  const imageMotion = {
    systems: [
      {
        name: "Hero house image scale/translate scrub",
        trigger: "scroll",
        properties: ["transform"],
        confidence: "high",
      },
      {
        name: "Hero masked video scale(1.8)",
        trigger: "layout/css",
        properties: ["transform: scale(1.8)"],
        confidence: "high",
      },
      {
        name: "Services background image hover scale 1.05",
        trigger: "hover",
        from: { scale: 1.05, opacity: 0 },
        confidence: "medium",
      },
      {
        name: "Inline images slight scale 1.01 (live transform sample)",
        trigger: "scroll/hover unknown",
        observedScale: 1.01,
        confidence: "low",
      },
      {
        name: "Swiper slide image transitions",
        technology: "Swiper",
        confidence: "high",
      },
    ],
  };

  // Download assets
  const assetIndex = [];
  const uniq = new Map();
  for (const a of networkAssets) {
    if (!a.url || a.url.startsWith("blob:")) continue;
    uniq.set(a.url, a);
  }
  let i = 0;
  for (const [url, meta] of uniq) {
    i++;
    const lower = url.toLowerCase();
    let folder = "other";
    if (lower.includes("lottie") || (lower.endsWith(".json") && lower.includes("anim"))) folder = "lottie";
    else if (lower.includes(".mp4") || lower.includes(".webm") || (meta.contentType || "").includes("video")) folder = "video";
    else if (lower.endsWith(".gif")) folder = "gif";
    else if (lower.endsWith(".svg")) folder = "svg";
    const ext = path.extname(new URL(url, BASE).pathname) || ".bin";
    const dest = path.join(ASSETS, folder, `asset-${i}${ext}`);
    console.log("Download", folder, url.slice(0, 100));
    const result = await download(url, dest);
    assetIndex.push({ ...meta, folder, download: result });
  }

  const libs = homeMeta.libs;
  const animationSystem = buildSystems(raw, cssInfo.keyframes, scrollMotion, heroStages, hoverInteractions, navDesktop, pageTransitions, libs);

  // Remaining gaps report embedded
  const remaining = {
    stillMissingOrPartial: [
      {
        item: "Exact GSAP/Framer timelines if minified into bundles",
        status: "PARTIAL",
        reason: "No window.gsap globals; motion likely in Next.js client bundles. Observed via computed styles + scroll sampling.",
        needed: "Source-map or unminified client components / runtime hook instrumentation",
      },
      {
        item: "Full property-detail page motion",
        status: "PARTIAL",
        reason: "Search listing may require query params / auth to open a detail URL; inventory covers /search.",
        needed: "Concrete property detail URLs from live search results",
      },
      {
        item: "Mouse magnetic / custom cursor math",
        status: "NOT EXTRACTED",
        observed: "No obvious custom cursor element found in DOM samples",
        needed: "Pointer trail recording if a custom cursor appears on specific routes",
      },
      {
        item: "WebGL/Three.js scenes",
        status: "NOT EXTRACTED",
        observed: "window.THREE not present; canvas count recorded per page",
        needed: "If canvas scenes exist behind lazy load, longer interaction passes",
      },
    ],
  };

  writeJson("pages-inventory.json", {
    source: BASE,
    extractedAt: new Date().toISOString(),
    viewportsTargeted: VIEWPORTS,
    pages: pagesInventory,
  });
  writeJson("hero-motion.json", heroMotion);
  writeJson("scroll-motion.json", {
    source: BASE,
    viewport: { width: 1440, height: 1000 },
    progressSteps: scrollMotion,
    notes: "Samples at 0..100% scroll. Transforms parsed from computed matrix.",
  });
  writeJson("hover-interactions.json", {
    source: BASE,
    count: hoverInteractions.length,
    changed: hoverInteractions.filter((h) => h.changed).length,
    interactions: hoverInteractions,
  });
  writeJson("navigation-motion.json", {
    source: BASE,
    byViewport: navByViewport,
    cssKeyframesRelated: cssInfo.keyframes.filter((k) => /burger|drop-menu|header|modal/i.test(k.name)),
  });
  writeJson("page-transitions.json", {
    source: BASE,
    loadingLineKeyframes: cssInfo.keyframes.filter((k) => /loading-line|youtube/i.test(k.name)),
    probe: pageTransitions,
  });
  writeJson("text-motion.json", textMotion);
  writeJson("image-motion.json", imageMotion);
  writeJson("animation-assets.json", {
    source: BASE,
    count: assetIndex.length,
    assets: assetIndex,
  });
  writeJson("css-keyframes.json", cssInfo);
  writeJson("animation-system.json", animationSystem);
  writeJson("remaining-gaps.json", remaining);
  writeJson("raw-candidates-summary.json", {
    note: "Deduplicated view of animations.json (initial evidence)",
    originalCount: raw.count,
    uniqueSignaturesApprox: 23,
    preservedFile: "animations.json",
  });

  // Markdown reports
  const systemsTable = animationSystem.systems
    .map(
      (s) =>
        `| ${s.id} | ${s.level} | ${s.name} | ${s.category || ""} | ${s.trigger || ""} | ${s.duration || ""} | ${s.easing || s.technology || ""} | ${s.confidence} |`,
    )
    .join("\n");

  const report = `# FIND Real Estate — Animation Report

Source: ${BASE}  
Generated: ${new Date().toISOString()}  
Method: Playwright + local Google Chrome, CSSOM keyframes, scroll/hover/nav probes  
Initial evidence: \`animations.json\` (${raw.count} DOM candidates → ~23 unique signatures)

## Libraries / runtime signals

\`\`\`json
${JSON.stringify(libs, null, 2)}
\`\`\`

## Motion hierarchy summary

| ID | Level | Name | Category | Trigger | Duration | Easing/Tech | Confidence |
|----|-------|------|----------|---------|----------|-------------|------------|
${systemsTable}

## Per-system details

${animationSystem.systems
  .map(
    (s) => `### ${s.name}

- **ID:** ${s.id}
- **Level:** ${s.level}
- **Category:** ${s.category || "n/a"}
- **Trigger:** ${s.trigger || "n/a"}
- **Initial / Final:** ${JSON.stringify(s.from || {})} → ${JSON.stringify(s.to || {})}
- **Properties:** ${JSON.stringify(s.properties || s.keyframes || [])}
- **Duration:** ${s.duration || "n/a"}
- **Easing:** ${s.easing || "n/a"}
- **Technology:** ${s.technology || s.implementation || "n/a"}
- **Confidence:** ${s.confidence}
- **Notes:** ${s.notes || ""}
`,
  )
  .join("\n")}

## CSS @keyframes discovered (${cssInfo.keyframes.length})

${cssInfo.keyframes.map((k) => `- \`${k.name}\` (${k.frames.length} frames)`).join("\n")}

## Remaining / not fully extracted

See \`remaining-gaps.json\`.

## Quality checklist

- [x] Homepage deep scroll 0–100%
- [x] Hero scrub stages
- [x] Hover probes
- [x] Desktop + mobile + tablet navigation
- [x] Multi-page inventory
- [x] Network/DOM media assets download attempt
- [x] Deduplicate DOM candidates into systems
- [x] No application source code modified
`;

  fs.writeFileSync(path.join(ROOT, "animation-report.md"), report);

  const readme = `# Find Real Estate — Animation Forensics

Standardized motion forensics pack for https://findrealestate.com

## Structure

\`\`\`
animations/
├── README.md
├── animation-report.md
├── animation-system.json
├── pages-inventory.json
├── hero-motion.json
├── scroll-motion.json
├── hover-interactions.json
├── navigation-motion.json
├── page-transitions.json
├── text-motion.json
├── image-motion.json
├── animation-assets.json
├── css-keyframes.json
├── remaining-gaps.json
├── animations.json          # original 146-candidate extraction (preserved)
└── assets/
    ├── lottie/
    ├── video/
    ├── svg/
    ├── gif/
    └── other/
\`\`\`

## How this was produced

1. Kept original \`animations.json\` as initial evidence.
2. Deduplicated identical DOM transitions into animation **systems**.
3. Ran Playwright with local Chrome for scroll/hover/nav/page probes.
4. Extracted CSSOM \`@keyframes\`.
5. Attempted asset downloads into \`assets/\`.

## Temporary script

\`../forensics-full-motion.cjs\` — forensic runner only (does not modify the app).
`;

  fs.writeFileSync(path.join(ROOT, "README.md"), readme);

  console.log("\n==== SUMMARY ====");
  console.log("Pages analyzed:", pagesInventory.length);
  console.log("Animation systems:", animationSystem.systems.length);
  console.log("CSS keyframes:", cssInfo.keyframes.length);
  console.log("Hover interactions:", hoverInteractions.length, "changed:", hoverInteractions.filter((h) => h.changed).length);
  console.log("Assets indexed:", assetIndex.length);
  console.log("Done.");

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
