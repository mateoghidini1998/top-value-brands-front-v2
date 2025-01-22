import { LucideIcon } from "lucide-react";

export type Role = "admin" | "warehouse" | "user";

type RouteItem = {
  title: string;
  url: string;
};

export type Route = {
  title: string;
  url: string;
  icon?: LucideIcon; // Puedes especificar el tipo correcto del icono si lo conoces
  items?: RouteItem[];
};

export const rolePermissions: Record<Role, string[]> = {
  admin: ["*"], // Acceso a todas las rutas
  warehouse: ["/inventory", "/warehouse"],
  user: ["/inventory"],
};

export const filterRoutesByRole = (role: Role, routes: Route[]): Route[] => {
  const allowedRoutes = rolePermissions[role] || [];

  if (allowedRoutes.includes("*")) {
    return routes; // Si el rol tiene acceso total, devuelve todas las rutas
  }

  return routes.filter(
    (route) =>
      allowedRoutes.includes(route.url) ||
      (route.items?.some((subItem) => allowedRoutes.includes(subItem.url)) ??
        false)
  );
};
