import { ProductTitle } from "@/components/custom/product-title";
import { FormatUSD } from "@/helpers";
import { formatDateWithoutHours } from "@/helpers/format-date";
import { PalletProductByID } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
// import ActionsCell from "./components/actions-cell";

export const columns: ColumnDef<PalletProductByID>[] = [
  {
    id: "product_title",
    header: "Product Name",
    cell: ({ row }) => {
      const product_image =
        row.original.purchaseOrderProduct.Product.product_image;
      const product_name =
        row.original.purchaseOrderProduct.Product.product_name;
      const in_seller_account =
        row.original.purchaseOrderProduct.Product.in_seller_account;
      const width = 300;
      return (
        <ProductTitle
          product_image={product_image}
          product_name={product_name}
          ASIN={""}
          in_seller_account={in_seller_account}
          width={width}
        />
      );
    },
  },
  {
    accessorKey: "available_quantity",
    header: "Available",
    cell: ({ row }) => (
      <span>
        {FormatUSD({
          number: row.original.available_quantity?.toString() || "0",
          maxDigits: 0,
          minDigits: 0,
        })}
      </span>
    ),
  },
  {
    accessorKey: "pack_type",
    header: "Pack Type",
    cell: ({ row }) => (
      <p>
        {row.original.purchaseOrderProduct.Product.pack_type
          ? `${row.original.purchaseOrderProduct.Product.pack_type} Pack`
          : "1 Pack"}
      </p>
    ),
  },
  {
    accessorKey: "upc",
    header: "UPC",
    cell: ({ row }) => (
      <p>{row.original.purchaseOrderProduct.Product.upc || "-"}</p>
    ),
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
    cell: ({ row }) => (
      <p>{row.original.purchaseOrderProduct.Product.seller_sku}</p>
    ),
  },

  {
    accessorKey: "expire_date",
    header: "Expire Date",
    cell: ({ row }) =>
      row.original.purchaseOrderProduct.expire_date ? (
        <p>
          {formatDateWithoutHours(
            row.original.purchaseOrderProduct.expire_date?.toString()
          )}
        </p>
      ) : (
        <Link href={`/warehouse/incoming-shipments`}>
          Please complete the incoming shipment details
        </Link>
      ),
  },

  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) => (
      <p>{formatDateWithoutHours(row.original.updatedAt.toString())}</p>
    ),
  },

  // {
  //   accessorKey: "actions",
  //   id: "actions",
  //   header: () => <div className="text-right">Actions</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="text-right">
  //         <ActionsCell palletId={row.original.id} />
  //       </div>
  //     );
  //   },
  // },
];
