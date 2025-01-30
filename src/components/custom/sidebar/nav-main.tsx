"use client";

import { useOrders } from "@/app/(protected)/purchase-orders/hooks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const path = usePathname();
  const { createPrefetchOrders } = useOrders();

  const lastPrefetchTime = useRef(0);

  const prefetchOrders = useCallback(() => {
    const now = Date.now();

    // Solo permite el prefetch si han pasado al menos 5 segundos desde el último
    if (now - lastPrefetchTime.current > 5000) {
      lastPrefetchTime.current = now;
      createPrefetchOrders()();
    }
  }, [createPrefetchOrders]);

  const presetData = useCallback(
    (title: string) => {
      if (title === "Purchase Orders") {
        console.log("prefetching...");
        prefetchOrders();
      }
    },
    [prefetchOrders]
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>TOP VALUE BRANDS</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) =>
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={path.split("/")[1] === item.url.split("/")[1]}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onMouseEnter={() => presetData(item.title)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                        onMouseEnter={() => presetData(item.title)}
                      >
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuButton
              onMouseEnter={() => presetData(item.title)}
              tooltip={item.title}
              key={index}
            >
              {item.icon && <item.icon />}
              <Link href={item.url}>{item.title}</Link>
            </SidebarMenuButton>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
