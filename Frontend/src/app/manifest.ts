import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GreenTech Agency",
    short_name: "GreenTech",
    description:
      "Software house for web and app development, UI/UX, SEO, GEO, AI and digital branding.",
    start_url: "/",
    display: "standalone",
    background_color: "#06111c",
    theme_color: "#0b1d2e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
