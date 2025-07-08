import { LucideIcon } from "lucide-react";

export type Role = "admin" | "warehouse";

type RouteItem = {
  title: string;
  url: string;
};

export type Route = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: RouteItem[];
};

export const rolePermissions: Record<Role, string[]> = {
  admin: ["*"],
  warehouse: ["/warehouse/*", "/inventory", "/purchase-orders/closed"],
};

// Ayuda: permite wildcards (terminadas en /*) para matching por prefijo
function isRouteAllowed(url: string, allowedRoutes: string[]): boolean {
  return allowedRoutes.some((allowed) => {
    if (allowed.endsWith("/*")) {
      const base = allowed.replace("/*", "");
      return url.startsWith(base + "/"); // "/warehouse/incoming-shipments"
    }
    return allowed === url;
  });
}

export const filterRoutesByRole = (role: Role, routes: Route[]): Route[] => {
  const allowedRoutes = rolePermissions[role] || [];

  if (allowedRoutes.includes("*")) {
    return routes;
  }

  const filteredRoutes = routes
    .map((route) => {
      // Filtrar items si existen
      if (route.items) {
        const filteredItems = route.items.filter((item) =>
          isRouteAllowed(item.url, allowedRoutes)
        );
        return {
          ...route,
          items: filteredItems,
        };
      }
      return route;
    })
    // Solo dejar rutas principales permitidas o que tengan al menos un item permitido
    .filter(
      (route) =>
        isRouteAllowed(route.url, allowedRoutes) ||
        (route.items && route.items.length > 0)
    );

  return filteredRoutes;
};
