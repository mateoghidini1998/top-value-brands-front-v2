"use client";

import { Product } from "@/app/(protected)/inventory/interfaces/product.interface";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
  },
];
