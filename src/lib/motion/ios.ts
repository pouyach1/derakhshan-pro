/**
 * اسپرینگ‌های مرجع حس iOS — فقط transform/opacity را با این‌ها انیمیت کنید.
 */
export const IOS_PAGE_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/** تعامل ریز (تپ دکمه/کارت) */
export const IOS_TAP_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 32,
  mass: 0.6,
};

/** کشیدن شیت / دراور */
export const IOS_SHEET_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 36,
  mass: 0.85,
};

/** آستانه سرعت برای dismiss شبیه iOS (px/ms ≈ 0.5 → 500 px/s) */
export const IOS_DISMISS_VELOCITY = 500;
export const IOS_DISMISS_DISTANCE_RATIO = 0.28;
