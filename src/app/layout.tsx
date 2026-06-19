import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kassa",
  description: "Kunlik savdo va xarajat trackeri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
