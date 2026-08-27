import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoTrace",
  description: "Explainable VASP Attribution & Fund-Flow Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} h-screen flex overflow-hidden bg-background bg-[url('/bg-grid.svg')] bg-center`}>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
