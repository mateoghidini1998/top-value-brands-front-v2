"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const styleSegment = (segment: string) => {
    // 1. Split by - and join with space
    // 2. Capitalize first letter of each word
    return segment
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">TVB</Link>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{styleSegment(segment)}</BreadcrumbPage>
                ) : (
                  <Button variant="ghost" onClick={() => router.back()}>
                    {styleSegment(segment)}
                  </Button>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
