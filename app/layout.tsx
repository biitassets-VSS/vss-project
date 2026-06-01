// ================================================
// ROOT LAYOUT
// ================================================

import type { Metadata } from "next";
import "./globals.css";
import { BRAND }         from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default:  BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.tagline,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
