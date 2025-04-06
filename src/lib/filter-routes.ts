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
  warehouse: ["/warehouse", "/inventory"],
};

export const filterRoutesByRole = (role: Role, routes: Route[]): Route[] => {
  const allowedRoutes = rolePermissions[role] || [];

  if (allowedRoutes.includes("*")) {
    return routes;
  }

  return routes.filter(
    (route) =>
      allowedRoutes.includes(route.url) ||
      (route.items?.some((subItem) => allowedRoutes.includes(subItem.url)) ??
        false)
  );
};
