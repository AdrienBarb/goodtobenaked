const withNextIntl = require("next-intl/plugin")("./i18n.ts");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

/** @type {import('next').NextConfig} */

if (process.env.NODE_ENV === "development") {
  dotenv.config();
} else {
  const secretsPath = "/run/secrets/";
  const secrets = ["NEXTAUTH_URL", "NEXTAUTH_SECRET"];

  secrets.forEach((secret) => {
    try {
      const secretValue = fs
        .readFileSync(path.join(secretsPath, secret), "utf8")
        .trim();
      process.env[secret] = secretValue;
    } catch (err) {
      console.error(`Error loading secret ${secret}:`, err);
    }
  });
}

const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_INTERNAL_API_URL: process.env.NEXT_PUBLIC_INTERNAL_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CLOUDFRONT_MEDIA: process.env.NEXT_PUBLIC_CLOUDFRONT_MEDIA,
  },
  reactStrictMode: false,
  optimizeFonts: false,
  swcMinify: true,
  crossOrigin: "anonymous",
  async redirects() {
    return [
      {
        source: "/products/categories/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products/category/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/media/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/medias/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/article/:slug",
        destination: "/fr/blog/articles/:slug",
        permanent: true,
      },
      {
        source: "/blog/articles/:slug",
        destination: "/fr/blog/articles/:slug",
        permanent: true,
      },
      {
        source: "/blog/categories/:slug",
        destination: "/fr/blog/categories/:slug",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/creators/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/support/members",
        destination: "/fr/blog/categories/goodtobenaked",
        permanent: true,
      },
      {
        source: "/support/creators",
        destination: "/fr/blog/categories/goodtobenaked",
        permanent: true,
      },
      {
        source: "/",
        destination: "/fr",
        permanent: true,
      },
      {
        source: "/creators/:id",
        destination: "/fr/dashboard/community/:id",
        permanent: true,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
