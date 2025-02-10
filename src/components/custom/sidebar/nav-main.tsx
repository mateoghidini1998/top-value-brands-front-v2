"use client";
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
import { useCallback } from "react";

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

  const presetData = useCallback((item: string) => {
    if (
      item.toLowerCase().includes("purchase") ||
      item.toLowerCase().includes("order")
    ) {
      console.log(`Prefetching ${item}...`);
    }
  }, []);

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
                        onMouseEnter={() => presetData(subItem.title)}
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
                onMouseEnter={() => presetData(item.title)}
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
