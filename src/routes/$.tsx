import { createFileRoute } from "@tanstack/react-router";

// Catch-all so deep links (e.g. /servicios) match a TanStack route.
// SpaApp is mounted in __root, so we just need this to exist.
export const Route = createFileRoute("/$")({
  component: () => null,
});
