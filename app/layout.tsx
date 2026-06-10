import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AnimatedTabTitle } from "@/components/custom/AnimatedTabTitle";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "KairoTask | Gestión Ágil para Equipos Modernos",
  description: "Ecosistema orbital de productividad y gestión de proyectos con interfaz dev-centric.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AnimatedTabTitle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
