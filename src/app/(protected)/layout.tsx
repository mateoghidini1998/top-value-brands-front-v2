"use client";

import { DynamicBreadcrumb } from "@/components/custom/dynamic.breadcrumb";
import { Notifications } from "@/components/custom/notifications";
import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserResource } from "@/types/auth.type";
import { useUser } from "@clerk/nextjs";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { user } = useUser();

  if (!user) return;

  const customUser: UserResource = {
    publicMetadata: {
      role: user.publicMetadata.role as string,
      warehouse: user.publicMetadata.warehouse as string,
    },
    username: user.username as string | null,
    primaryEmailAddress: {
      emailAddress: user.primaryEmailAddress?.emailAddress as string | null,
    },
  };

  return (
    <SidebarProvider>
      <AppSidebar user={customUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <main className="px-[20px] py-4">
          <Notifications />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
