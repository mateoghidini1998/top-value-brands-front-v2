"use client";
import { ProductTitle } from "@/components/custom/product-title";
import { formatDate } from "@/helpers/format-date";
import { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./components";
import { ArrowUpDown } from "lucide-react";
import { FormatUSD } from "@/helpers";

interface GetColumnsProps {
  handleOrderBy: (columnId: string) => void;
}

export const getColumns = ({
  handleOrderBy,
}: GetColumnsProps): ColumnDef<Product>[] => {
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
    },
    {
      accessorKey: "product_cost",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("product_cost")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Product Cost
        </div>
      ),
      cell: ({ row }) => (
        <span>$ {FormatUSD({ number: row.original.product_cost })}</span>
      ),
    },

    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }) => (
        <span>{row.original.supplier_name || "No supplier Listed"}</span>
      ),
    },
    {
      accessorKey: "supplier_item_number",
      header: "Supplier Item No",
      cell: ({ row }) => (
        <span>{row.original.supplier_item_number || "-"}</span>
      ),
    },
    {
      accessorKey: "pack_type",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("pack_type")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Pack Type
        </div>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.pack_type ? `${row.original.pack_type} Pack` : "1 Pack"}
        </span>
      ),
    },

    {
      accessorKey: "FBA_available_inventory",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("FBA_available_inventory")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> FBA Stock
        </div>
      ),
      cell: ({ row }) => (
        <span>
          {FormatUSD({
            number: row.original.FBA_available_inventory.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      ),
    },
    {
      accessorKey: "reserved_quantity",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("reserved_quantity")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Reserved Quantity
        </div>
      ),
      cell: ({ row }) => (
        <span>
          {FormatUSD({
            number: row.original.reserved_quantity.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      ),
    },
    {
      accessorKey: "Inbound_to_FBA",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("Inbound_to_FBA")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Inbound to FBA
        </div>
      ),
      cell: ({ row }) => (
        <span>
          {FormatUSD({
            number: row.original.Inbound_to_FBA.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      ),
    },
    {
      accessorKey: "warehouse_stock",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("warehouse_stock")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Warehouse Stock
        </div>
      ),
      cell: ({ row }) => (
        <span>
          {FormatUSD({
            number: row.original.warehouse_stock,
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("updatedAt")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Last Update
        </div>
      ),
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
};

export const getWarehouseColumns = ({
  handleOrderBy,
}: GetColumnsProps): ColumnDef<Product>[] => {
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
    },
    // {
    //   accessorKey: "product_cost",
    //   header: () => (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("product_cost")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " /> Product Cost
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <span>$ {FormatUSD({ number: row.original.product_cost })}</span>
    //   ),
    // },

    // {
    //   accessorKey: "supplier",
    //   header: "Supplier",
    //   cell: ({ row }) => (
    //     <span>{row.original.supplier_name || "No supplier Listed"}</span>
    //   ),
    // },
    // {
    //   accessorKey: "supplier_item_number",
    //   header: "Supplier Item No",
    //   cell: ({ row }) => (
    //     <span>{row.original.supplier_item_number || "-"}</span>
    //   ),
    // },
    {
      accessorKey: "pack_type",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("pack_type")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Pack Type
        </div>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.pack_type ? `${row.original.pack_type} Pack` : "1 Pack"}
        </span>
      ),
    },

    // {
    //   accessorKey: "FBA_available_inventory",
    //   header: () => (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("FBA_available_inventory")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " /> FBA Stock
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <span>
    //       {FormatUSD({
    //         number: row.original.FBA_available_inventory.toString(),
    //         maxDigits: 0,
    //         minDigits: 0,
    //       })}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "reserved_quantity",
    //   header: () => (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("reserved_quantity")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " /> Reserved Quantity
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <span>
    //       {FormatUSD({
    //         number: row.original.reserved_quantity.toString(),
    //         maxDigits: 0,
    //         minDigits: 0,
    //       })}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "Inbound_to_FBA",
    //   header: () => (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("Inbound_to_FBA")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " /> Inbound to FBA
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <span>
    //       {FormatUSD({
    //         number: row.original.Inbound_to_FBA.toString(),
    //         maxDigits: 0,
    //         minDigits: 0,
    //       })}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "warehouse_stock",
    //   header: () => (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("warehouse_stock")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " /> Warehouse Stock
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <span>
    //       {FormatUSD({
    //         number: row.original.warehouse_stock,
    //         maxDigits: 0,
    //         minDigits: 0,
    //       })}
    //     </span>
    //   ),
    // },
    {
      accessorKey: "updatedAt",
      header: () => (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("updatedAt")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " /> Last Update
        </div>
      ),
      cell: ({ row }) => {
        const updatedAt = row.original.updatedAt;
        return <span>{formatDate(updatedAt.toString())}</span>;
      },
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     return <ActionsCell row={row.original} />;
    //   },
    // },
  ];
};
