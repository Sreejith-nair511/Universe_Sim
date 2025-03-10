/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  webpack: (config) => {
    // Optimize Three.js bundle
    config.module.rules.push({
      test: /three\/examples\/js/,
      use: "babel-loader",
    })

    return config
  },
}

module.exports = nextConfig

