import { ProductTitle } from "@/components/custom/product-title";
import { ShipmentPalletProduct } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { PalletTable } from "./page";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<ShipmentPalletProduct>[] = [
  {
    id: "product_title",
    header: "Product Name",
    cell: ({ row }) => {
      const product_image = row.original.product_image;
      const product_name = row.original.product_name;
      const in_seller_account = row.original.in_seller_account;
      const width = 300;
      return (
        <ProductTitle
          product_image={product_image}
          product_name={product_name}
          ASIN=""
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
    accessorKey: "OutgoingShipmentProduct.quantity",
    header: "Quantity",
  },
  {
    id: "actions",
    header: () => <span className="w-full flex justify-end pr-6">Actions</span>,
    cell: () => (
      <div className="text-right pr-6">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        ></label>
      </div>
    ),
  },
];

export const palletCols: ColumnDef<PalletTable>[] = [
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
