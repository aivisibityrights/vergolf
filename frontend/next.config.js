/** @type {import('next').NextConfig} */
const nextConfig = {
  // เพิ่ม headers สำหรับ development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.supabase.co https://aiverid-backend-production.up.railway.app"
              : "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://aiverid-backend-production.up.railway.app"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig