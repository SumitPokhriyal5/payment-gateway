import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Checkout · Payment Gateway",
  description:
    "Mock payment gateway with full lifecycle handling and retry logic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
