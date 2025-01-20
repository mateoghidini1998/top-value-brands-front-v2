"use client";
import { ProductTitle } from "@/components/custom/product-title";
import { formatDate } from "@/helpers/format-date";
import { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./components";

export const columns: ColumnDef<Product>[] = [
  {
    id: "product_title",
    header: "Product Name",
    cell: ({ row }) => {
      const product_image = row.original.product_image;
      const product_name = row.original.product_name;
      const ASIN = row.original.ASIN;
      const in_seller_account = row.original.in_seller_account;
      const width = 300;
      return (
        <ProductTitle
          product_image={product_image}
          product_name={product_name}
          ASIN={ASIN}
          in_seller_account={in_seller_account}
          width={width}
        />
      );
    },
  },
  {
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
  },
  {
    accessorKey: "supplier_item_number",
    header: "Supplier Item No",
  },
  {
    accessorKey: "pack_type",
    header: "Pack Type",
  },
  // {
  //   accessorKey: "upc",
  //   header: "UPC",
  // },
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
    cell: ({ row }) => <span>$ {row.original.product_cost}</span>,
  },
  // {
  //   accessorKey: "is_active",
  //   header: "Active",
  //   cell: ({ row }) => <span>{row.original.is_active ? "Yes " : "No"}</span>,
  // },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return <span>{formatDate(updatedAt.toString())}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionsCell row={row.original} />;
    },
  },
];
