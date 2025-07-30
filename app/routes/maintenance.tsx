import type { Route } from "./+types/maintenance";

export const handle = {
  title: "Maintenance",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Maintenance" },
    { name: "description", content: "Prijzencheck Maintenance" },
  ];
}
