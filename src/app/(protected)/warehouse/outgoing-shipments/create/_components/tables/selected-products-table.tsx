"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTitle } from "@/components/custom/product-title";
import { GetAllPalletProductsResponsePalletProduct } from "@/types";
import { DataTable } from "./data-table";

interface SelectedProductsTableProps {
  data: GetAllPalletProductsResponsePalletProduct[];
  onRemoveProduct: (productId: number) => void;
}

export function SelectedProductsTable({
  data,
  onRemoveProduct,
}: SelectedProductsTableProps) {
  const columns: ColumnDef<GetAllPalletProductsResponsePalletProduct>[] = [
    {
      id: "product_title",
      header: () => <div className="text-center">Product Name</div>,
      cell: ({ row }) => {
        const product_image = row.original.product.product_image;
        const product_name = row.original.product.product_name;
        const ASIN = row.original.product.ASIN;
        const in_seller_account = row.original.product.in_seller_account;
        const width = 300;
        return (
          <div className="text-center">
            <ProductTitle
              product_image={product_image || ""}
              product_name={product_name}
              ASIN={ASIN}
              in_seller_account={in_seller_account}
              width={width}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "product.seller_sku",
      header: () => <div className="text-center">Seller SKU</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.product.seller_sku}</div>
      ),
    },
    {
      accessorKey: "product.ASIN",
      header: () => <div className="text-center">ASIN</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.product.ASIN}</div>
      ),
    },
    {
      accessorKey: "available_quantity",
      header: () => <div className="text-center">Quantity</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.available_quantity}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveProduct(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
