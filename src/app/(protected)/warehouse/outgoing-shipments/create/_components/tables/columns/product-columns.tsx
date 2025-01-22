// "use client";

// import { ProductTitle } from "@/components/custom/product-title";
// import { Badge } from "@/components/ui/badge";
// import { GetAllPalletProductsResponsePalletProduct } from "@/types";
// import { ColumnDef } from "@tanstack/react-table";
// import { DataTableColumnHeader } from "./data-table-column-header";

// export const productColumns: ColumnDef<GetAllPalletProductsResponsePalletProduct>[] =
//   [
//     {
//       id: "product_title",
//       header: "Product Name",
//       cell: ({ row }) => {
//         const product_image = row.original.product.product_image;
//         const product_name = row.original.product.product_name;
//         const ASIN = row.original.product.ASIN;
//         const in_seller_account = row.original.product.in_seller_account;
//         const width = 300;
//         return (
//           <ProductTitle
//             product_image={product_image || ""}
//             product_name={product_name}
//             ASIN={ASIN}
//             in_seller_account={in_seller_account}
//             width={width}
//           />
//         );
//       },
//     },
//     {
//       accessorKey: "product.ASIN",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="ASIN" />
//       ),
//     },
//     {
//       accessorKey: "quantity",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Quantity" />
//       ),
//     },
//     {
//       accessorKey: "available_quantity",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Available" />
//       ),
//     },
//     {
//       accessorKey: "product.in_seller_account",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="In Seller Account" />
//       ),
//       cell: ({ row }) => {
//         const inAccount = row.original.product.in_seller_account;
//         return (
//           <Badge variant={inAccount ? "default" : "secondary"}>
//             {inAccount ? "Yes" : "No"}
//           </Badge>
//         );
//       },
//     },
//   ];
