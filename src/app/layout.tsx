// src/app/layout.tsx
import type { Metadata } from "next";
// 1. Importamos las fuentes
import { Inter, Outfit } from "next/font/google"; 
import "./globals.css";

// 2. Las configuramos
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "Los Palomos | Luxury Rental",
  description: "Tu destino ideal...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* 3. Las añadimos al body */}
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-zinc-950 text-zinc-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}