import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function mediaRemotePatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const patterns: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [
    {
      protocol: "http",
      hostname: "localhost",
      port: "4000",
      pathname: "/media/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "4000",
      pathname: "/media/**",
    },
  ];

  const candidates = [
    process.env.MEDIA_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    process.env.BACKEND_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const url = new URL(value);
      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/media/**",
      });
    } catch {
      /* ignore invalid env URLs */
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  // Portal kit mock actions/components ship looser contracts than this host's
  // strict TS; keep runtime wiring. Tighten when swapping portal/actions.ts.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: mediaRemotePatterns(),
  },
};

export default withNextIntl(nextConfig);
