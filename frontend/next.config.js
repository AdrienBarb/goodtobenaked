const withNextIntl = require("next-intl/plugin")("./i18n.ts");

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  optimizeFonts: false,
  env: {
    ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    GOOGLE_PLACE_API_KEY: process.env.GOOGLE_PLACE_API_KEY,
  },
  swcMinify: true,
  crossOrigin: "anonymous",
  images: {
    domains: [
      "nastynipple-test-identity.s3.eu-west-3.amazonaws.com",
      "nakkked-staging.s3.eu-west-3.amazonaws.com",
      "nakkked-prod.s3.eu-west-3.amazonaws.com",
      "source.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nastynipple-test-identity.s3.eu-west-3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "nakkked-staging.s3.eu-west-3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "nakkked-prod.s3.eu-west-3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
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
