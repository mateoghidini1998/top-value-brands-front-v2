"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import AddProduct from "./add-product";
import { ProductInOrder } from "./interface/product-added.interface";
import { TrackedProduct } from "../../inventory/tracked-products/interfaces/tracked-product.interface";
import RemoveProduct from "./remove-product";
import { ProductTitle } from "@/components/custom/product-title";

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
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "supplier_id",
    header: "Supplier ID",
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
    accessorKey: "product_cost",
    header: "Product Cost",
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
