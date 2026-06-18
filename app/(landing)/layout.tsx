import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KairoTask | Gestión Ágil para Equipos Modernos",
  description:
    "Ecosistema orbital de productividad y gestión de proyectos con interfaz dev-centric. Kanban, sprints, time tracking y métricas en tiempo real para equipos de ingeniería.",
  alternates: {
    canonical: "https://kairotask.app",
  },
};

// JSON-LD structured data — SoftwareApplication para rich results en Google
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "KairoTask",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Ecosistema orbital de productividad y gestión de proyectos con interfaz dev-centric. Kanban, sprints, time tracking y métricas en tiempo real.",
  url: "https://kairotask.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: "es",
  keywords: "gestión proyectos, kanban, agile, sprints, equipos, dev-centric",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD es seguro — no contiene input de usuario
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
