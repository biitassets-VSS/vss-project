import "./globals.css";

export const metadata = {
  title: "VSS",
  description: "VSS App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
