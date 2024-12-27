"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { ColumnDef } from "@tanstack/react-table";
import { TrackedProductsOfTheOrder } from "../interfaces/orders.interface";
import { formatDate } from "@/helpers/format-date";
import ProductCostCell from "./components/product-cost-cell";
import QuantityCell from "./components/quantity-cell";
import TotalAmountCell from "./components/total-amount-cell";

export interface CustomTrackedProduct extends TrackedProductsOfTheOrder {
  sellable_quantity: number;
  total_amount: number;
  quantity_purchased: number;
}

export const columns: ColumnDef<CustomTrackedProduct>[] = [
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
      const productQuantity = row.original.sellable_quantity;
      return (
        <ProductCostCell
          value={product_cost}
          productId={row.original.id}
          productQuantity={productQuantity}
        />
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
    id: "sellable_quanity",
    header: "Sellable Quantity",
    cell: ({ row }) => {
      const sellable_quanity = row.original.sellable_quantity;
      return (
        <QuantityCell
          value={sellable_quanity}
          productId={row.original.id}
          productCost={row.original.product_cost}
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
  },
];
