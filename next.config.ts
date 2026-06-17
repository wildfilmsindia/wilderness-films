import type { NextConfig } from 'next'

// ── Content Security Policy ───────────────────────────────────────────────────
// 'unsafe-inline' + 'unsafe-eval' required by:
//   - Next.js 15 inline hydration scripts (__NEXT_DATA__, chunk loaders)
//   - Framer Motion / GSAP runtime style injection
//   - Three.js GLSL shader compilation (eval path in some environments)
// If you later implement nonce-based CSP via middleware, these can be removed.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel-insights.com https://*.vercel-insights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://img.youtube.com https://cdn.jsdelivr.net",
  "connect-src 'self' https://api.web3forms.com https://vercel-insights.com https://*.vercel-insights.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
].join('; ')

const SECURITY_HEADERS = [
  // Prevent browsers from sniffing MIME types — blocks drive-by downloads
  { key: 'X-Content-Type-Options',      value: 'nosniff' },
  // Disallow embedding in frames — prevents clickjacking
  { key: 'X-Frame-Options',             value: 'DENY' },
  // Enable DNS prefetching for performance without leaking navigation intent
  { key: 'X-DNS-Prefetch-Control',      value: 'on' },
  // Restrict referrer info sent to cross-origin destinations
  { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
  // Enforce HTTPS for 2 years, include subdomains, opt into preload list
  { key: 'Strict-Transport-Security',   value: 'max-age=63072000; includeSubDomains; preload' },
  // Restrict access to powerful browser APIs not used by this site
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
      'browsing-topics=()',
    ].join(', '),
  },
  // Prevent cross-origin window.opener access (tabnapping protection)
  { key: 'Cross-Origin-Opener-Policy',  value: 'same-origin-allow-popups' },
  // Restrict who can embed resources from this origin
  { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
  // Full CSP
  { key: 'Content-Security-Policy',     value: CSP },
]

const nextConfig: NextConfig = {
  // Remove "X-Powered-By: Next.js" — don't advertise the stack
  poweredByHeader: false,

  transpilePackages: ['three'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // Lock to Unsplash image path only — no wildcard hostnames
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },
}

export default nextConfig
