import { createFileRoute } from "@tanstack/react-router";
import { SpaApp } from "@/spa-app";

// Catch-all so BrowserRouter (react-router-dom) handles all client navigation.
export const Route = createFileRoute("/$")({
  component: SpaApp,
});
