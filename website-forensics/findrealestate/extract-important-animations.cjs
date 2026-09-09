const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1000,
    },
  });

  console.log("Opening findrealestate.com...");

  await page.goto("https://findrealestate.com", {
    waitUntil: "networkidle",
    timeout: 120000,
  });

  console.log("Page loaded successfully.");

  await page.waitForTimeout(3000);

  const animations = await page.evaluate(() => {
    const results = [];

    document.querySelectorAll("*").forEach((element) => {
      const style = getComputedStyle(element);

      const animation =
        style.animationName !== "none" &&
        style.animationDuration !== "0s";

      const transition =
        style.transitionProperty !== "none" &&
        style.transitionDuration !== "0s";

      const transform = style.transform !== "none";
      const opacity = style.opacity !== "1";

      if (animation || transition || transform || opacity) {
        results.push({
          tag: element.tagName,
          id: element.id || null,
          className:
            typeof element.className === "string"
              ? element.className
              : null,

          animation: {
            name: style.animationName,
            duration: style.animationDuration,
            delay: style.animationDelay,
            easing: style.animationTimingFunction,
          },

          transition: {
            property: style.transitionProperty,
            duration: style.transitionDuration,
            easing: style.transitionTimingFunction,
          },

          transform: style.transform,
          opacity: style.opacity,
        });
      }
    });

    return results;
  });

  console.log(
    `Found ${animations.length} animation/motion candidates.`
  );

  const fs = require("fs");
  const path = require("path");

  const outputDir = path.resolve(
    "website-forensics/findrealestate/animations"
  );

  fs.mkdirSync(outputDir, {
    recursive: true,
  });

  fs.writeFileSync(
    path.join(outputDir, "animations.json"),
    JSON.stringify(
      {
        source: "https://findrealestate.com",
        extractedAt: new Date().toISOString(),
        count: animations.length,
        animations,
      },
      null,
      2
    )
  );

  console.log("");
  console.log("================================");
  console.log("Animation extraction complete!");
  console.log("================================");
  console.log("");
  console.log("Saved to:");
  console.log(
    path.join(outputDir, "animations.json")
  );

  await browser.close();
})();