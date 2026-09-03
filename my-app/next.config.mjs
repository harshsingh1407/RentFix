/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase body size limit for API routes to support image/video uploads (up to 20MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
