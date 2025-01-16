"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseOrderSummaryProducts } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const reasons = [
  { id: 1, label: "ok" },
  { id: 2, label: "shortage" },
  { id: 3, label: "broken items" },
  { id: 4, label: "not shipped" },
  { id: 5, label: "wrong items received" },
  { id: 6, label: "none" },
] as const;

export type ReasonId = (typeof reasons)[number]["id"];

export const columns = (
  onQuantityReceivedChange: (rowId: string, value: number) => void,
  onReasonChange: (rowId: string, value: number) => void
): ColumnDef<PurchaseOrderSummaryProducts>[] => [
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
    accessorKey: "upc",
    header: "UPC",
  },
  {
    accessorKey: "quantity_purchased",
    header: "Quantity Purchased",
  },
  {
    accessorKey: "quantity_received",
    header: "Quantity Received",
    cell: ({ row }) => {
      return (
        <Input
          type="number"
          min={0}
          defaultValue={row.original.quantity_received}
          onBlur={(e) => {
            const value = parseInt(e.target.value) || 0;
            onQuantityReceivedChange(row.original.id.toString(), value);
          }}
          className="w-24"
        />
      );
    },
  },
  {
    accessorKey: "quantity_missing",
    header: "Quantity Missing",
  },
  {
    accessorKey: "quantity_shipped",
    header: "Quantity Shipped",
  },
  {
    accessorKey: "reason_id",
    header: "Reason",
    cell: ({ row }) => {
      return (
        <Select
          defaultValue={row.original.reason_id?.toString()}
          onValueChange={(value) => {
            onReasonChange(row.original.id.toString(), parseInt(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            {reasons.map((reason) => (
              <SelectItem key={reason.id} value={reason.id.toString()}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "expire_date",
    header: "Expire Date",
  },
];
