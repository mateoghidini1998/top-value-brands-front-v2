"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { routes } from "@/routes/routes";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { ModeToggle } from "../theme-toggle";
import { filterRoutesByRole, Role, Route } from "@/lib/filter-routes";
import { UserResource } from "@/types/auth.type";
import { useGetAllOrders } from "@/app/(protected)/purchase-orders/hooks";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: UserResource | null | undefined;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userRole = user?.publicMetadata.role;

  const filteredNavMain = filterRoutesByRole(
    userRole as Role,
    routes.navMain as Route[]
  );

  // Use the hook at the top level
  const { prefetchOrders } = useGetAllOrders({ page: 1, limit: 50 });

  return (
    <Sidebar collapsible="icon" {...props} className="bg-background">
      <SidebarHeader>
        <TeamSwitcher teams={routes.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} prefetchOrders={prefetchOrders} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
