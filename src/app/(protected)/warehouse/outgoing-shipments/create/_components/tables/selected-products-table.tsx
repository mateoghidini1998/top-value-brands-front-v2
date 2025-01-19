"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetAllPalletProductsResponsePalletProduct } from "@/types";
import { DataTable } from "./data-table";
import { ProductTitle } from "@/components/custom/product-title";

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
      accessorKey: "product.seller_sku",
      header: "SKU",
    },
    {
      id: "product_title",
      header: "Product Name",
      cell: ({ row }) => {
        const product_image = row.original.product.product_image;
        const product_name = row.original.product.product_name;
        const ASIN = row.original.product.ASIN;
        const in_seller_account = row.original.product.in_seller_account;
        const width = 300;
        return (
          <ProductTitle
            product_image={product_image || ""}
            product_name={product_name}
            ASIN={ASIN}
            in_seller_account={in_seller_account}
            width={width}
          />
        );
      },
    },
    {
      accessorKey: "product.ASIN",
      header: "ASIN",
    },
    {
      accessorKey: "available_quantity",
      header: "Quantity",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemoveProduct(row.original.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
