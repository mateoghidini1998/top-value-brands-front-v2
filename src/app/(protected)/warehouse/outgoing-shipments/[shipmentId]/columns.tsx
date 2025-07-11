import { DGItemCell } from "@/app/(protected)/purchase-orders/[orderId]/components/dg-item-cell";
import { ProductTitle } from "@/components/custom/product-title";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShipmentPallet,
  ShipmentPalletProduct,
} from "@/types/shipments/get.types";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import CheckPalletProducts from "../_components/check-pallet-product";
import EditableQuantityCell from "../_components/editable-quantity-cell";
import ToggleCheckAllShipmentProducts from "../_components/toggleCheckAllShipmentProducts";

export const createColumns = (
  isEditing: boolean,
  shipmentId: number,
  shipmentStatus: string,
  handleProductChange?: (index: number, field: string, value: unknown) => void,
  handleRemoveProduct?: (productId: number) => void // <- Nuevo parámetro
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
    id: "dg_item",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Is Hazmat
      </span>
    ),
    cell: ({ row }) => {
      const dg_item = row.original.dg_item || "--";
      return <DGItemCell dgItem={dg_item} />;
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
    accessorKey: "available_quantity",
    header: "Available Quantity",
    cell: ({ row }) => {
      return <p>{row.original.available_quantity}</p>;
    },
  },
  {
    accessorKey: "OutgoingShipmentProduct.quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const index = row.index;
      const valueFromParent = row.original.OutgoingShipmentProduct.quantity;
      if (isEditing) {
        return (
          <EditableQuantityCell
            value={valueFromParent}
            onChange={(newValue) =>
              handleProductChange &&
              handleProductChange(index, "quantity", newValue)
            }
          />
        );
      }
      return valueFromParent;
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
              onClick={() =>
                handleRemoveProduct && handleRemoveProduct(row.original.id)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      return (
        <div className="text-right pr-6">
          <CheckPalletProducts
            row={row.original}
            shipmentId={shipmentId}
            shipmentStatus={shipmentStatus}
          />
        </div>
      );
    },
  },
];

export const palletCols = (
  shipmentId: number,
  shipmentStatus: string
): ColumnDef<ShipmentPallet>[] => [
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
  {
    accessorKey: "allProductsInShipment",
    header: "Entire Pallet",
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.original.allProductsInShipment}
          className="hover:cursor-none disabled:cursor-default"
          disabled
        />
      );
    },
  },
  {
    id: "actions",
    header: "Check All Products",
    cell: ({ row }) => {
      const hide = false;
      const palletId = row.original.pallet_id;
      const isChecked = row.original.allProductsChecked;
      return (
        <ToggleCheckAllShipmentProducts
          hide={hide}
          shipmentId={shipmentId}
          palletId={palletId}
          isChecked={isChecked}
          shipmentStatus={shipmentStatus}
        />
      );
    },
  },
];
