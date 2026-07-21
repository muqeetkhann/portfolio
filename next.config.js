/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: isStaticExport,
  },
  env: {
    // Inlined into client bundles so lib/utils.ts asset() can prefix media
    // paths with the GitHub Pages basePath at build time.
    NEXT_PUBLIC_BASE_PATH: isStaticExport ? '/portfolio' : '',
  },
}

if (isStaticExport) {
  nextConfig.output = 'export'
  nextConfig.trailingSlash = true
  nextConfig.basePath = '/portfolio'
  nextConfig.assetPrefix = '/portfolio/'
}

module.exports = nextConfig
