/** @type {import('next').NextConfig} */
const nextConfig = {
    // images: {
    //     remotePatterns: [
    //       {
    //         protocol: 'https',
    //         hostname: process.env.NEXT_PUBLIC_PROD_BASE_URL,
    //         port: '',
    //         pathname: '/api/v1/config',
    //       },
    //     ],
    //   },
    async rewrites() {
        return [
          {
            source: '/api/auth/:path*',
            destination: '/api/auth',
          },
        ];
      },
}

module.exports = nextConfig

