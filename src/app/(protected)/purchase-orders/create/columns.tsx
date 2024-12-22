"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import AddProduct from "./add-product";
import { ProductInOrder } from "./interface/product-added.interface";
import { TrackedProduct } from "../../inventory/tracked-products/interfaces/tracked-product.interface";
import RemoveProduct from "./remove-product";

export const getTrackedProductsColumns = (
  setProductsAdded: Dispatch<SetStateAction<ProductInOrder[]>>
): ColumnDef<TrackedProduct>[] => [
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
