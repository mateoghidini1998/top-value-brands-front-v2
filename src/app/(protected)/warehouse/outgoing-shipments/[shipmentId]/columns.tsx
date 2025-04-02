import { ProductTitle } from "@/components/custom/product-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { ManifestPalletTable } from "./page";
import CheckPalletProducts from "../_components/check-pallet-product";
import { ShipmentPalletProduct } from "@/types/shipments/get.types";

export const createColumns = (
  isEditing: boolean
): ColumnDef<ShipmentPalletProduct>[] => [
  {
    id: "product_title",
    header: "Product Name",
    cell: ({ row }) => {
      const product_image = row.original.product_image;
      const product_name = row.original.product_name;
      const in_seller_account = row.original.in_seller_account;
      const ASIN = row.original.ASIN;
      const width = 300;
      return (
        <ProductTitle
          product_image={product_image}
          product_name={product_name}
          ASIN={ASIN}
          in_seller_account={in_seller_account || false}
          width={width}
        />
      );
    },
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
    accessorKey: "pallet_number",
    header: "Pallet",
    cell: ({ row }) => <span># {row.original.pallet_number}</span>,
  },
  {
    accessorKey: "warehouse_location",
    header: "Warehouse Location",
  },
  {
    accessorKey: "pack_type",
    header: "PACK TYPE",
    cell: ({ row }) => {
      return <p>{row.original.pack_type} Pack</p>;
    },
  },
  {
    accessorKey: "OutgoingShipmentProduct.quantity",
    header: "Quantity",
    cell: ({ row }) => {
      if (isEditing) {
        return (
          <Input
            type="number"
            defaultValue={row.original.OutgoingShipmentProduct.quantity}
            className="w-24"
            min={1}
          />
        );
      }
      return row.original.OutgoingShipmentProduct.quantity;
    },
  },
  {
    id: "actions",
    header: () => <span className="w-full flex justify-end pr-6">Actions</span>,
    cell: ({ row }) => {
      if (isEditing) {
        return (
          <div className="text-right pr-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      return (
        <div className="text-right pr-6">
          <CheckPalletProducts row={row.original} />
        </div>
      );
    },
  },
];

export const palletCols: ColumnDef<ManifestPalletTable>[] = [
  {
    accessorKey: "pallet_number",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Pallet
      </span>
    ),
    cell: ({ row }) => (
      <span className="flex items-center"># {row.original.pallet_number}</span>
    ),
  },
  {
    accessorKey: "warehouse_location",
    header: "Warehouse Location",
  },
];
