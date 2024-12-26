"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import AddProduct from "./add-product";
import { ProductInOrder } from "./interface/product-added.interface";
import { TrackedProduct } from "../../inventory/tracked-products/interfaces/tracked-product.interface";
import RemoveProduct from "./remove-product";
import { ProductTitle } from "@/components/custom/product-title";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/helpers/format-date";

export const getTrackedProductsColumns = (
  setProductsAdded: Dispatch<SetStateAction<ProductInOrder[]>>
): ColumnDef<TrackedProduct>[] => [
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
    accessorKey: "supplier_name",
    header: "Supplier",
    cell: ({ row }) => (
      <span className="">{row.getValue("supplier_name") || "N/A"}</span>
    ),
  },
  {
    accessorKey: "supplier_item_number",
    header: "Supplier Item No.",
    cell: ({ row }) => (
      <span className="">{row.getValue("supplier_item_number") || "N/A"}</span>
    ),
  },
  {
    accessorKey: "product_velocity",
    header: "Product Velocity",
    cell: ({ row }) => {
      const product_velocity: number = row.getValue("product_velocity");
      return <span>{product_velocity.toFixed(3) || "N/A"}</span>;
    },
  },
  {
    accessorKey: "units_sold",
    header: "Units Sold",
    cell: ({ row }) => {
      const units_sold: number = row.getValue("units_sold");
      return <span>{units_sold.toLocaleString() || 0}</span>;
    },
  },
  {
    accessorKey: "thirty_days_rank",
    header: "30 Day Rank",
    cell: ({ row }) => {
      const thirty_days_rank: number = row.getValue("thirty_days_rank");
      return <span>{thirty_days_rank.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "ninety_days_rank",
    header: "90 Day Rank",
    cell: ({ row }) => {
      const ninety_days_rank: number = row.getValue("ninety_days_rank");
      return <span>{ninety_days_rank.toLocaleString() || "N/A"}</span>;
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
    accessorKey: "product_cost",
    header: "Product Cost",
    cell: ({ row }) => {
      const product_cost: number = parseFloat(row.getValue("product_cost"));
      return <span>{`$ ${product_cost.toFixed(2) || "N/A"}`}</span>;
    },
  },
  {
    accessorKey: "lowest_fba_price",
    header: "Lowest FBA Price",
    cell: ({ row }) => {
      const lowest_fba_price: number = parseFloat(
        row.getValue("lowest_fba_price")
      );
      return <span>{`$ ${lowest_fba_price.toFixed(2) || "N/A"}`}</span>;
    },
  },
  {
    accessorKey: "FBA_available_inventory",
    header: "FBA Inventory",
    cell: ({ row }) => {
      const FBA_available_inventory: number = row.getValue(
        "FBA_available_inventory"
      );
      return <span>{FBA_available_inventory.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "reserved_quantity",
    header: "Reserved Quantity",
    cell: ({ row }) => {
      const reserved_quantity: number = row.getValue("reserved_quantity");
      return <span>{reserved_quantity.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "Inbound_to_FBA",
    header: "Inbound to FBA",
    cell: ({ row }) => {
      const Inbound_to_FBA: number = row.getValue("Inbound_to_FBA");
      return <span>{Inbound_to_FBA.toLocaleString() || "N/A"}</span>;
    },
  },

  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => {
      const fees: number = parseFloat(row.getValue("fees"));
      return <span>{`$ ${fees.toFixed(2) || "N/A"}`}</span>;
    },
  },

  {
    accessorKey: "profit",
    header: "Profit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit"));

      const getBadgeVariant = (amount: number) => {
        if (amount > 2) {
          return "default";
        }

        if (amount < 2) {
          return "destructive";
        }

        return "secondary";
      };

      return (
        <Badge variant={getBadgeVariant(amount)}>
          {isNaN(amount) ? "N/A" : `$ ${amount.toFixed(2)}`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "roi",
    header: "ROI",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("roi"));

      const getBadgeVariant = (amount: number) => {
        if (amount > 2) {
          return "default";
        }

        if (amount < 2) {
          return "destructive";
        }

        return "secondary";
      };

      return (
        <Badge variant={getBadgeVariant(amount)}>
          {isNaN(amount) ? "N/A" : `${amount.toFixed(2)}%`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return <span>{formatDate(updatedAt.toString())}</span>;
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <AddProduct trackedProduct={row.original} setData={setProductsAdded} />
      );
    },
  },
];

export const getAddedProductsColumns = (
  setProductsAdded: Dispatch<SetStateAction<ProductInOrder[]>>
): ColumnDef<ProductInOrder>[] => [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "supplier_name",
    header: "supplier_name",
  },
  {
    accessorKey: "product_image",
    header: "product_image",
  },
  {
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "product_name",
    header: "product_name",
  },
  {
    accessorKey: "quantity",
    header: "quantity",
  },
  {
    accessorKey: "product_cost",
    header: "product_cost",
  },
  {
    accessorKey: "total_amount",
    header: "total_amount",
  },
  {
    accessorKey: "units_sold",
    header: "units_sold",
  },
  {
    accessorKey: "fees",
    header: "fees",
  },
  {
    accessorKey: "lowest_fba_prive",
    header: "lowest_fba_prive",
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <RemoveProduct
          productInOrder={row.original}
          setData={setProductsAdded}
        />
      );
    },
  },
];
