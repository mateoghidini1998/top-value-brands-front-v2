"use client";

import { Product } from "@/app/(protected)/inventory/interfaces/product.interface";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "product_image",
    header: "Image",
    cell: ({ row }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={row.original.product_image}
        alt={row.original.product_name}
        style={{ width: "50px", height: "50px" }}
      />
    ),
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
  },
  {
    accessorKey: "FBA_available_inventory",
    header: "FBA Available Inventory",
  },
  {
    accessorKey: "reserved_quantity",
    header: "Reserved Quantity",
  },
  {
    accessorKey: "Inbound_to_FBA",
    header: "Inbound to FBA",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => <span>{row.original.supplier?.supplier_name}</span>,
  },
  {
    accessorKey: "product_cost",
    header: "Product Cost",
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) => <span>{row.original.is_active ? "Yes " : "No"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      console.log(row.original);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText("hola")}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
