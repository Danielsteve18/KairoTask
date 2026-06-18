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
import { QueryProvider } from "@/components/query-provider";

export const metadata: Metadata = {
  title: {
    default: "KairoTask | Gestión Ágil para Equipos Modernos",
    template: "%s | KairoTask",
  },
  description:
    "Ecosistema orbital de productividad y gestión de proyectos con interfaz dev-centric. Kanban, sprints y métricas en tiempo real para equipos de ingeniería.",
  metadataBase: new URL("https://kairotask.app"),
  openGraph: {
    type: "website",
    siteName: "KairoTask",
    title: "KairoTask | Gestión Ágil para Equipos Modernos",
    description:
      "Ecosistema orbital de productividad y gestión de proyectos con interfaz dev-centric.",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "KairoTask | Gestión Ágil para Equipos Modernos",
    description:
      "Ecosistema orbital de productividad y gestión de proyectos con interfaz dev-centric.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <QueryProvider>
            <AnimatedTabTitle />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
