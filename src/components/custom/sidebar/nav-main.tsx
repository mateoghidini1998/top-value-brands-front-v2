"use client";
import { usePrefetchGetAllOrders } from "@/app/(protected)/purchase-orders/hooks";
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
import { useRef } from "react";

interface NavMainProps {
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
}

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();
  const { prefetchGetAllOrders } = usePrefetchGetAllOrders();

  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePrefetch = (title: string) => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
    prefetchTimeout.current = setTimeout(() => {
      switch (title) {
        case "All POs":
          prefetchGetAllOrders();
          break;
      }
    }, 100);
  };

  const handleCancelPrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  };

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
                    onMouseEnter={() => handlePrefetch(item.title)}
                    onMouseLeave={handleCancelPrefetch}
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
                        onMouseEnter={() => handlePrefetch(subItem.title)}
                        onMouseLeave={handleCancelPrefetch}
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
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                onMouseEnter={() => handlePrefetch(item.title)}
                onMouseLeave={() => handleCancelPrefetch()}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
