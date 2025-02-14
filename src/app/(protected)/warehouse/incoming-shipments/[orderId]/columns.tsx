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
import { ExpireDateCell } from "../_components/expire-date-cell";
import { Button } from "@/components/ui/button";
import { PalletQuantityCell } from "../_components/pallet-quantity-cell";
import { Trash2, SquarePlus } from "lucide-react";
import { FormatUSD } from "@/helpers";
import { MissingFieldsInterface } from "./page";

export const reasons = [
  { id: 1, label: "ok" },
  { id: 2, label: "shortage" },
  { id: 3, label: "broken items" },
  { id: 4, label: "not shipped" },
  { id: 5, label: "wrong items received" },
  { id: 6, label: "none" },
] as const;

export type ReasonId = (typeof reasons)[number]["id"];

export const incomingOrderCols = (
  onQuantityReceivedChange: (rowId: string, value: number) => void,
  onReasonChange: (rowId: string, value: number) => void,
  onUpcChange: (rowId: string, value: string) => void,
  onExpireDateChange: (rowId: string, value: Date | undefined) => void,
  focusNextInput: (rowId: string, currentField: string) => void,
  inputRefs: { current: { [key: string]: HTMLInputElement | null } },
  missingFields: MissingFieldsInterface[]
): ColumnDef<PurchaseOrderSummaryProducts>[] => {
  return [
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
      cell: ({ row }) => {
        return (
          <Input
            type="text"
            defaultValue={row.original.upc || ""}
            onBlur={(e) => {
              onUpcChange(row.original.id.toString(), e.target.value);
            }}
            className={`w-52 ${
              !row.original.upc &&
              missingFields
                .find((f) => f.product_id === row.original.id)
                ?.missingFields.includes("upc")
                ? "border-red-500"
                : ""
            }`}
            placeholder="Enter UPC"
            ref={(el) => {
              inputRefs.current[`upc_${row.original.id}`] = el;
            }}
          />
        );
      },
    },
    {
      accessorKey: "quantity_purchased",
      header: "Quantity Purchased",
      cell: ({ row }) => {
        return (
          <span>
            {FormatUSD({
              number: row.original.quantity_purchased?.toString() || "0",
              maxDigits: 0,
              minDigits: 0,
            })}
          </span>
        );
      },
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
            ref={(el) => {
              inputRefs.current[`quantity_received_${row.original.id}`] = el;
            }}
          />
        );
      },
    },
    {
      accessorKey: "quantity_missing",
      header: "Quantity Missing",
      cell: ({ row }) => {
        return (
          <span>
            {FormatUSD({
              number: row.original.quantity_missing?.toString() || "0",
              maxDigits: 0,
              minDigits: 0,
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "warehouse_stock",
      header: "Warehouse Stock",
      cell: ({ row }) => {
        return (
          <span>
            {FormatUSD({
              number: row.original.warehouse_stock?.toString() || "0",
              maxDigits: 0,
              minDigits: 0,
            })}
          </span>
        );
      },
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
            <SelectTrigger
              className={`w-[180px] ${
                !row.original.reason_id &&
                missingFields
                  .find((f) => f.product_id === row.original.id)
                  ?.missingFields.includes("reason_id")
                  ? "border-red-500"
                  : ""
              }`}
              // @ts-expect-error @typescript-eslint/no-unsafe-argument
              ref={(el) =>
                // @ts-expect-error @typescript-eslint/no-unsafe-argument
                (inputRefs.current[`reason_id_${row.original.id}`] = el)
              }
            >
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
      cell: ({ row }) => {
        return (
          <ExpireDateCell
            className={`w-[180px] `}
            missingFields={missingFields}
            // @ts-expect-error @typescript-eslint/no-unsafe-argument
            inputRef={inputRefs.current[`expire_date_${row.original.id}`]}
            row={row.original}
            onExpireDateChange={onExpireDateChange}
          />
        );
      },
    },
  ];
};

export const availableToCreate = (
  onAddProduct: (product: PurchaseOrderSummaryProducts) => void
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
    accessorKey: "quantity_available",
    header: "Quantity Available",
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.quantity_available?.toString() || "0",
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => onAddProduct(row.original)}>
            <SquarePlus className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export const addedToCreate = (
  onRemoveProduct: (product: PurchaseOrderSummaryProducts) => void,
  onUpdatePalletQuantity: (productId: number, newQuantity: number) => void
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
    accessorKey: "quantity_available",
    header: "Quantity Available",
    cell: ({ row }) => {
      const data =
        row.original.quantity_available - (row.original.pallet_quantity || 0);
      return (
        <span>
          {FormatUSD({
            number: data.toString() || "0",
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "pallet_quantity",
    header: "Pallet Quantity",
    cell: ({ row }) => (
      <div className="w-full flex items-center justify-center">
        <PalletQuantityCell
          row={row.original}
          onUpdatePalletQuantity={onUpdatePalletQuantity}
        />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,

    cell: ({ row }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => onRemoveProduct(row.original)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
