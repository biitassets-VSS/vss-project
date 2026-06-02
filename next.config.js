/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

// ⚠️ CRITICAL: This catches hidden build errors that Next.js hides
process.on('unhandledRejection', (error) => {
  console.log('❌ unhandledRejection:', error);
});

process.on('uncaughtException', (error) => {
  console.log('❌ uncaughtException:', error);
});

module.exports = nextConfig;

