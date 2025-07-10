"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { Badge } from "@/components/ui/badge";
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
import ProductVelocity from "../create/components/product-velocity";

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
  {
    accessorKey: "product_velocity",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Velocity (30d)
      </span>
    ),
    cell: ({ row }) => {
      const product = row.original;
      const velocities = [
        {
          days: 2,
          velocity: product.product_velocity_2,
        },
        {
          days: 7,
          velocity: product.product_velocity_7,
        },
        {
          days: 15,
          velocity: product.product_velocity_15,
        },
        {
          days: 30,
          velocity: product.product_velocity,
        },
      ];
      return <ProductVelocity velocities={velocities} width={"100%"} />;
      // return <span>{product_velocity.toFixed(3) || "N/A"}</span>;
    },
  },
  {
    accessorKey: "units_sold",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Units Sold
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.units_sold.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "thirty_days_rank",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        30 Days Rank
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.thirty_days_rank.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "ninety_days_rank",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        90 Days Rank
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {FormatUSD({
            number: row.original.ninety_days_rank.toString(),
            maxDigits: 0,
            minDigits: 0,
          })}
        </span>
      );
    },
  },
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
    accessorKey: "avg_selling_price",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Avg Selling Price
      </span>
    ),
    cell: ({ row }) => {
      const product_cost: number = parseFloat(
        row.getValue("avg_selling_price")
      );
      return (
        <span>{`${
          product_cost ? `$ ${product_cost.toFixed(2)}` : "N/A"
        }`}</span>
      );
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
  {
    accessorKey: "lowest_fba_price",
    header: ({ column }) => (
      <span
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lowest FBA Price
      </span>
    ),
    cell: ({ row }) => {
      return (
        <span>
          {`$ ${FormatUSD({
            number: row.original?.lowest_fba_price?.toString(),
            maxDigits: 2,
            minDigits: 2,
          })}`}
        </span>
      );
    },
  },
  {
    accessorKey: "FBA_available_inventory",
    header: "FBA Inventory",
    cell: ({ row }) => {
      const FBA_available_inventory: number = row.getValue(
        "FBA_available_inventory"
      );
      return <span>{FBA_available_inventory.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "reserved_quantity",
    header: "Reserved Quantity",
    cell: ({ row }) => {
      const product = row.original;
      const { reserved_quantity, fc_transfer, fc_processing, customer_order } =
        product;
      const tooltipContent = `
        Reserved:
            FC Transfer: ${fc_transfer}
            FC Processing: ${fc_processing}
            Customer Order: ${customer_order}
            `;
      return (
        <div title={tooltipContent.trim()} className="text-left">
          {reserved_quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "Inbound_to_FBA",
    header: "Inbound to FBA",
    cell: ({ row }) => {
      const Inbound_to_FBA: number = row.getValue("Inbound_to_FBA");
      return <span>{Inbound_to_FBA.toLocaleString() || "N/A"}</span>;
    },
  },
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
    accessorKey: "poproduct_profit",
    header: () => {
      return (
        <div className="text-right flex items-center cursor-pointer justify-center gap-2">
          Profit
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("poproduct_profit"));

      const getBadgeVariant = (amount: number) => {
        if (amount > 2) {
          return "arrived";
        }

        if (amount < 2) {
          return "cancelled";
        }

        return "secondary";
      };

      return (
        <Badge variant={getBadgeVariant(amount)}>
          {isNaN(amount) ? "N/A" : `$ ${amount.toFixed(2)}`}
        </Badge>
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
      const amount = parseFloat(row.getValue("roi"));

      const getBadgeVariant = (amount: number) => {
        if (amount > 2) {
          return "arrived";
        }

        if (amount < 2) {
          return "cancelled";
        }

        return "secondary";
      };
      return (
        <Badge variant={getBadgeVariant(amount)}>
          {isNaN(amount) ? "N/A" : `${amount.toFixed(2)} %`}
        </Badge>
      );
    },
  },
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
  // {
  //   accessorKey: "selling_price",
  //   header: ({ column }) => (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Selling Price
  //     </span>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {FormatUSD({
  //           number: row.original.selling_price?.toString() || "0",
  //           maxDigits: 2,
  //           minDigits: 2,
  //         })}
  //       </span>
  //     );
  //   },
  // },
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
