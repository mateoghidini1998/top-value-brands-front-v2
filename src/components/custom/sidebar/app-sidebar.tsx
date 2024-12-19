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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={routes.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes.navMain} />
        {/* <NavProjects projects={routes.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={routes.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
