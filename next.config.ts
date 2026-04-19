import type { NextConfig } from "next";

const config: NextConfig = {
  typedRoutes: false,
  serverExternalPackages: ["pdf-parse", "mammoth", "pdfkit"],
  outputFileTracingIncludes: {
    "/api/roast/pdf": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default config;
