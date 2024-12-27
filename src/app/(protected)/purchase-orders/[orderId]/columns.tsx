"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { ColumnDef } from "@tanstack/react-table";
import { TrackedProductsOfTheOrder } from "../interfaces/orders.interface";
import { formatDate } from "@/helpers/format-date";

export const columns: ColumnDef<TrackedProductsOfTheOrder>[] = [
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
    accessorKey: "product_velocity",
    header: "Velocity",
  },
  {
    accessorKey: "units_sold",
    header: "Units Sold",
  },
  {
    accessorKey: "thirty_days_rank",
    header: "30 Days Rank",
  },
  {
    accessorKey: "ninety_days_rank",
    header: "90 Days Rank",
  },
  {
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "supplier_item_number",
    header: "Item No.",
  },
  {
    accessorKey: "product_cost",
    header: "Product Cost",
  },
  {
    accessorKey: "lowest_fba_price",
    header: "Lowest FBA Price",
  },
  {
    accessorKey: "fees",
    header: "Fees",
  },
  {
    accessorKey: "profit",
    header: "Profit",
  },
  {
    accessorKey: "roi",
    header: "ROI",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => (
      <span>{formatDate(row.original.updatedAt.toString())}</span>
    ),
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
  },
  {
    id: "sellable_quanity",
    header: "Sellable Quantity",
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
  },
  {
    id: "actions",
    header: "Actions",
  },
];
