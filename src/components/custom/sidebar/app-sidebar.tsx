"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { filterRoutesByRole, Role, Route } from "@/lib/filter-routes";
import { routes } from "@/routes/routes";
import { UserResource } from "@/types/auth.type";
import * as React from "react";
// import { ModeToggle } from "../theme-toggle";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import ScanButton from "../scan-button";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: UserResource | null | undefined;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userRole = user?.publicMetadata.role;

  const filteredNavMain = filterRoutesByRole(
    userRole as Role,
    routes.navMain as Route[]
  );

  return (
    <Sidebar collapsible="icon" {...props} className="bg-background">
      <SidebarHeader>
        <TeamSwitcher teams={routes.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <ModeToggle /> */}
        <ScanButton />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
