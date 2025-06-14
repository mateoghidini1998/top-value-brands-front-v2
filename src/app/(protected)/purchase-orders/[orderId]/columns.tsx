"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { FormatUSD } from "@/helpers";
import { PurchaseOrderSummaryProducts } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ActionsCell,
  ProductCostCell,
  QuantityCell,
  TotalAmountCell,
} from "./components";
import { DGItemCell } from "./components/dg-item-cell";

export const columns: ColumnDef<PurchaseOrderSummaryProducts>[] = [
  {
    id: "product_title",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
      </span>
    ),
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
  // {
  //   accessorKey: "product_velocity",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Velocity
  //     </span>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {FormatUSD({
  //           number: row.original.product_velocity.toString(),
  //           maxDigits: 4,
  //           minDigits: 2,
  //         })}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "units_sold",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Units Sold
  //     </span>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {FormatUSD({
  //           number: row.original.units_sold.toString(),
  //           maxDigits: 0,
  //           minDigits: 0,
  //         })}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "thirty_days_rank",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       30 Days Rank
  //     </span>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {FormatUSD({
  //           number: row.original.thirty_days_rank.toString(),
  //           maxDigits: 0,
  //           minDigits: 0,
  //         })}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "ninety_days_rank",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       90 Days Rank
  //     </span>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {FormatUSD({
  //           number: row.original.ninety_days_rank.toString(),
  //           maxDigits: 0,
  //           minDigits: 0,
  //         })}
  //       </span>
  //     );
  //   },
  // },
  {
    id: "ASIN / GTIN",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ASIN / GTIN
      </span>
    ),
    cell: ({ row }) => {
      const ASIN = row.original.ASIN || null;
      const GTIN = row.original.GTIN || null;
      return <span>{ASIN || GTIN}</span>;
    },
  },
  {
    accessorKey: "supplier_item_number",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Item No.
      </span>
    ),
  },
  {
    accessorKey: "product_cost",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Cost
      </span>
    ),
    cell: ({ row }) => {
      const product_cost = parseFloat(row.getValue("product_cost"));
      return (
        <ProductCostCell
          value={product_cost}
          productId={row.original.id}
          packType={row.original.pack_type}
        />
      );
    },
  },
  // {
  //   accessorKey: "lowest_fba_price",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Lowest FBA Price
  //     </span>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {`$ ${FormatUSD({
  //           number: row.original.lowest_fba_price.toString(),
  //           maxDigits: 2,
  //           minDigits: 2,
  //         })}`}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "fees",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fees
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {`$ ${FormatUSD({
            number: row.original.fees?.toString() || "0",
            maxDigits: 2,
            minDigits: 2,
          })}`}
        </span>
      );
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Profit
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {`$ ${FormatUSD({
            number: row.original.profit?.toString() || "0",
            maxDigits: 2,
            minDigits: 2,
          })}`}
        </span>
      );
    },
  },
  {
    accessorKey: "roi",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ROI
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {`${FormatUSD({
            number: row.original.roi?.toString() || "0",
            maxDigits: 2,
            minDigits: 2,
          })} %`}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Last Update
  //     </span>
  //   ),
  //   cell: ({ row }) => (
  //     <span>{formatDate(row.original.updatedAt.toString())}</span>
  //   ),
  // },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
  },
  {
    id: "quantity_purchased",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sellable Qty
      </span>
    ),

    cell: ({ row }) => {
      const quantity_purchased = row.original.quantity_purchased;
      return (
        <QuantityCell
          value={quantity_purchased}
          productId={row.original.id}
          packType={row.original.pack_type}
        />
      );
    },
  },
  {
    accessorKey: "selling_price",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Selling Price
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.selling_price?.toString() || "0",
            maxDigits: 2,
            minDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "warehouse_stock",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Warehouse Stock
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.warehouse_stock?.toString() || "0",
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Amount
      </span>
    ),
    cell: ({ row }) => {
      return <TotalAmountCell productId={row.original.id} />;
    },
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center">
          <ActionsCell
            orderProductId={row.original.purchase_order_product_id}
          />
        </span>
      );
    },
  },
];
