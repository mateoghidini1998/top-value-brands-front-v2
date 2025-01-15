"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { formatDate } from "@/helpers/format-date";
import { PurchaseOrderSummaryProducts } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ActionsCell,
  ProductCostCell,
  QuantityCell,
  TotalAmountCell,
} from "./components";

export const columns: ColumnDef<PurchaseOrderSummaryProducts>[] = [
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
    cell: ({ row }) => {
      const product_cost = parseFloat(row.getValue("product_cost"));
      return (
        <ProductCostCell value={product_cost} productId={row.original.id} />
      );
    },
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
    id: "quantity_purchased",
    header: "Quantity Purchased",
    cell: ({ row }) => {
      const quantity_purchased = row.original.quantity_purchased;
      return (
        <QuantityCell value={quantity_purchased} productId={row.original.id} />
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => {
      return <TotalAmountCell productId={row.original.id} />;
    },
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center">
          <ActionsCell
            orderProductId={row.original.purchase_order_product_id}
          />
        </span>
      );
    },
  },
];
