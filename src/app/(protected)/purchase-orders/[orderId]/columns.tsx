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
import { FormatUSD } from "@/helpers";

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
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.product_velocity.toString(),
            maxDigits: 4,
            minDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "units_sold",
    header: "Units Sold",
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.units_sold.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "thirty_days_rank",
    header: "30 Days Rank",
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.thirty_days_rank.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "ninety_days_rank",
    header: "90 Days Rank",
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.ninety_days_rank.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
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
        <ProductCostCell
          value={product_cost}
          productId={row.original.id}
          packType={row.original.pack_type}
        />
      );
    },
  },
  {
    accessorKey: "lowest_fba_price",
    header: "Lowest FBA Price",
    cell: ({ row }) => {
      return (
        <span>
          {`$ ${FormatUSD({
            number: row.original.lowest_fba_price.toString(),
            maxDigits: 2,
            minDigits: 2,
          })}`}
        </span>
      );
    },
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => {
      return (
        <span>
          {`$ ${FormatUSD({
            number: row.original.fees?.toString() || "0",
            maxDigits: 2,
            minDigits: 2,
          })}`}
        </span>
      );
    },
  },
  {
    accessorKey: "profit",
    header: "Profit",
    cell: ({ row }) => {
      return (
        <span>
          {`$ ${FormatUSD({
            number: row.original.profit?.toString() || "0",
            maxDigits: 2,
            minDigits: 2,
          })}`}
        </span>
      );
    },
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
    header: "Sellable Qty",
    cell: ({ row }) => {
      const quantity_purchased = row.original.quantity_purchased;
      return (
        <QuantityCell
          value={quantity_purchased}
          productId={row.original.id}
          packType={row.original.pack_type}
        />
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
