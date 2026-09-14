/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd
    ? { output: 'export' }
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Frame-Options', value: 'DENY' },
                {
                  key: 'Content-Security-Policy',
                  value:
                    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.emailjs.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https: http://localhost:* ws://localhost:*; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
                },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(self), microphone=(), geolocation=(), browsing-topics=()',
                },
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ];
            },
          ];
        },
      }),
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;
