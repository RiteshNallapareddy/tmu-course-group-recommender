import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Query strings (e.g. ?interests=...) are preserved automatically —
    // Next.js forwards any incoming query params not referenced in the
    // destination path.
    return [
      { source: "/quiz", destination: "/liberals/quiz", permanent: true },
      { source: "/results", destination: "/liberals/results", permanent: true },
      { source: "/courses", destination: "/liberals/courses", permanent: true },
    ];
  },
};

export default nextConfig;
