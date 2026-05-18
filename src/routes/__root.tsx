import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SpaApp } from "@/spa-app";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dr. Diego Pallares — Rehabilitación Oral y Estética Dental" },
      {
        name: "description",
        content:
          "Dr. Diego Pallares. Especialista en rehabilitación oral, estética dental, ortodoncia, implantes y blanqueamiento en Barranquilla. Agenda tu cita.",
      },
      { property: "og:title", content: "Dr. Diego Pallares — Sonrisa Pallares" },
      { property: "og:description", content: "Rehabilitación Oral y Estética Dental — Flowable Injection Technique." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  // Render SpaApp at the root so the BrowserRouter persists across all TanStack matches.
  component: SpaApp,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
