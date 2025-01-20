import { ProductTitle } from "@/components/custom/product-title";
import { formatDate } from "@/helpers/format-date";
import { PalletProductByID } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
// import ActionsCell from "./components/actions-cell";

export const columns: ColumnDef<PalletProductByID>[] = [
  {
    id: "product_title",
    header: "Product Name",
    cell: ({ row }) => {
      console.log(row.original);
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
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "available_quantity",
    header: "Available",
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
    cell: ({ row }) => (
      <p>{row.original.purchaseOrderProduct.Product.seller_sku}</p>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) => <p>{formatDate(row.original.updatedAt.toString())}</p>,
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
