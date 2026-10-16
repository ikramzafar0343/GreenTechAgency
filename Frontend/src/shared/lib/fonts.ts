import localFont from "next/font/local";

/**
 * Brandium role weights mapped onto licensed Nourd faces.
 * 250 + 300 share nourd_light (no separate 250 file).
 */
export const brandFont = localFont({
  src: [
    {
      path: "../../styles/fonts/nourd_light.ttf",
      weight: "250",
      style: "normal",
    },
    {
      path: "../../styles/fonts/nourd_light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../styles/fonts/nourd_regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../styles/fonts/nourd_medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--fontBrand",
  display: "swap",
  adjustFontFallback: "Arial",
  // Script fallbacks for Arabic/Urdu/CJK/Devanagari without replacing brand Latin face.
  fallback: [
    "Arial",
    "Segoe UI",
    "Tahoma",
    "Noto Naskh Arabic",
    "Noto Sans Arabic",
    "Noto Sans Devanagari",
    "Noto Sans SC",
    "Noto Sans JP",
    "Noto Sans KR",
    "sans-serif",
  ],
});

/** @deprecated Prefer brandFont; alias kept for gradual import cleanup. */
export const nourd = brandFont;
