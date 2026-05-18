import { createFileRoute } from "@tanstack/react-router";

// SpaApp is rendered by __root so this route just needs to exist.
export const Route = createFileRoute("/")({
  component: () => null,
});
