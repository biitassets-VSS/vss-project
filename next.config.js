/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException:", error);
});

module.exports = nextConfig;
