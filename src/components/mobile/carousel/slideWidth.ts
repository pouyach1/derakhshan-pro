/** نسبت عرض اسلاید: عدد ثابت یا جفت موبایل/دسکتاپ */
export type SlideWidthRatio = number | { mobile: number; desktop: number };

export function resolveSlideWidthRatio(
  config: SlideWidthRatio,
  viewportWidth: number,
  breakpointPx = 1024,
): number {
  if (typeof config === "number") return config;
  if (viewportWidth <= 0) return config.mobile;
  return viewportWidth < breakpointPx ? config.mobile : config.desktop;
}
