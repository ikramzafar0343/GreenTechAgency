import localFont from 'next/font/local';

// Destination: src/lib/typography/fontConfig.ts.
// Add the licensed files before importing this module into the application.
export const brandFont = localFont({
  src: [
    {
      path: '../../assets/fonts/twkLausanne/twkLausanne250.woff2',
      weight: '250',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/twkLausanne/twkLausanne300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/twkLausanne/twkLausanne400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/twkLausanne/twkLausanne500.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--fontBrand',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Arial',
  fallback: ['Arial', 'sans-serif'],
});
