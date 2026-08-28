import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "CryptoTrace",
  description: "Explainable VASP Attribution & Fund-Flow Intelligence",
};

import { PageBackground } from "@/components/common/PageBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${fraunces.variable} font-sans min-h-screen bg-background relative text-foreground`}>
        <PageBackground>
          {children}
        </PageBackground>
      </body>
    </html>
  );
}
