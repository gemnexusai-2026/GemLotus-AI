import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GemLotus AI — Procurement Intelligence Operating System",
  description:
    "GemLotus AI transforms business evidence into structured intelligence, assessments, readiness, risk and actionable procurement decisions.",
  keywords: [
    "GemLotus AI",
    "procurement intelligence",
    "OEM assessment",
    "vendor intelligence",
    "tender intelligence",
    "AI procurement",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}