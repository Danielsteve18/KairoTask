import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
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
import { ConsoleEasterEgg } from "@/components/ascii/ConsoleEasterEgg";

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

const locales = ["es", "en"] as const;
type Locale = (typeof locales)[number];

function isLocale(v: string | undefined): v is Locale {
  return v === "es" || v === "en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = isLocale(localeCookie) ? localeCookie : "es";
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <QueryProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AnimatedTabTitle />
              <ConsoleEasterEgg />
              {children}
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
