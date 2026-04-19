import type { NextConfig } from "next";

const config: NextConfig = {
  typedRoutes: false,
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default config;
