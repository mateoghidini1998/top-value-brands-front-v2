/* eslint-disable @next/next/no-img-element */
"use client";

import { ProductTitle } from "@/components/custom/product-title";
import { Badge } from "@/components/ui/badge";
import { FormatUSD } from "@/helpers";
import { formatDate } from "@/helpers/format-date";
import { TrackedProduct } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import AddProduct from "./components/add-product";
import AddProductCost from "./components/add-product-cost";
import AddQuantity from "./components/add-quantity";
import ProductVelocity from "./components/product-velocity";
import RemoveProduct from "./components/remove-product";
import { ProductInOrder } from "./interface/product-added.interface";

export const getTrackedProductsColumns = (
  setProductsAdded: Dispatch<SetStateAction<ProductInOrder[]>>,
  handleOrderBy: (orderBy: string) => void
): ColumnDef<TrackedProduct>[] => [
  {
    id: "product_title",
    header: "Product Name",
    cell: ({ row }) => {
      const product_image = row.original.product_image;
      const product_name = row.original.product_name;
      const ASIN = row.original.ASIN;
      const in_seller_account = row.original.in_seller_account;
      const width = 300;
      // const dangerous_good = row.original.dangerous_goods;
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
    accessorKey: "dangerous_goods",
    header: "DG ITEM",
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier",
    cell: ({ row }) => (
      <span className="">{row.getValue("supplier_name") || "N/A"}</span>
    ),
  },
  {
    accessorKey: "supplier_item_number",
    header: "Supplier Item No.",
    cell: ({ row }) => (
      <span className="">{row.getValue("supplier_item_number") || "N/A"}</span>
    ),
  },
  {
    accessorKey: "product_velocity",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("product_velocity")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Product Velocity
        </div>
      );
    },
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
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("units_sold")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Units Sold
        </div>
      );
    },
    cell: ({ row }) => {
      const units_sold: number = row.getValue("units_sold");
      return <span>{units_sold.toLocaleString() || 0}</span>;
    },
  },
  {
    accessorKey: "thirty_days_rank",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("thirty_days_rank")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          30 Day Rank
        </div>
      );
    },
    cell: ({ row }) => {
      const thirty_days_rank: number = row.getValue("thirty_days_rank");
      return <span>{thirty_days_rank.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "ninety_days_rank",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("ninety_days_rank")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          90 Day Rank
        </div>
      );
    },
    cell: ({ row }) => {
      const ninety_days_rank: number = row.getValue("ninety_days_rank");
      return <span>{ninety_days_rank.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
  },

  {
    accessorKey: "avg_selling_price",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("avg_selling_price")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Avg Selling Price
        </div>
      );
    },
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
    accessorKey: "product_cost",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("product_cost")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Product Cost
        </div>
      );
    },
    cell: ({ row }) => {
      const product_cost: number = parseFloat(row.getValue("product_cost"));
      return <span>{`$ ${product_cost.toFixed(2) || "N/A"}`}</span>;
    },
  },
  {
    accessorKey: "lowest_fba_price",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("lowest_fba_price")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Lowest FBA Price
        </div>
      );
    },
    cell: ({ row }) => {
      const lowest_fba_price: number = parseFloat(
        row.getValue("lowest_fba_price")
      );
      return <span>{`$ ${lowest_fba_price.toFixed(2) || "N/A"}`}</span>;
    },
  },
  {
    accessorKey: "FBA_available_inventory",
    // header: () => {
    //   return (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("FBA_available_inventory")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " />
    //       FBA Inventory
    //     </div>
    //   );
    // },
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
    // header: () => {
    //   return (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("reserved_quantity")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " />
    //       Reserved Quantity
    //     </div>
    //   );
    // },
    header: "Reserved Quantity",
    cell: ({ row }) => {
      const reserved_quantity: number = row.getValue("reserved_quantity");
      return <span>{reserved_quantity.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "Inbound_to_FBA",
    // header: () => {
    //   return (
    //     <div
    //       className="text-right flex items-center cursor-pointer justify-center gap-2"
    //       onClick={() => handleOrderBy("Inbound_to_FBA")}
    //     >
    //       <ArrowUpDown className="mr-2 w-4 h-4 " />
    //       Inbound to FBA
    //     </div>
    //   );
    // },
    header: "Inbound to FBA",
    cell: ({ row }) => {
      const Inbound_to_FBA: number = row.getValue("Inbound_to_FBA");
      return <span>{Inbound_to_FBA.toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "warehouse_stock",
    header: "Warehouse Stock",
  },

  {
    accessorKey: "fees",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("fees")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Fees
        </div>
      );
    },
    cell: ({ row }) => {
      const fees: number = parseFloat(row.getValue("fees"));
      return <span>{` ${fees ? `$ ${fees.toFixed(2)}` : "-"}`}</span>;
    },
  },

  {
    accessorKey: "profit",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("profit")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Profit
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit"));

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
    header: "ROI",
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
          {isNaN(amount) ? "N/A" : `${amount.toFixed(2)}%`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => {
      return (
        <div
          className="text-right flex items-center cursor-pointer justify-center gap-2"
          onClick={() => handleOrderBy("updatedAt")}
        >
          <ArrowUpDown className="mr-2 w-4 h-4 " />
          Last Update
        </div>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return <span>{formatDate(updatedAt.toString())}</span>;
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center">
          <AddProduct
            trackedProduct={row.original}
            setData={setProductsAdded}
          />
        </span>
      );
    },
  },
];

export const getAddedProductsColumns = (
  setProductsAdded: Dispatch<SetStateAction<ProductInOrder[]>>
): ColumnDef<ProductInOrder>[] => [
  {
    id: "product_title",
    header: "Product Name",
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
          ASIN={ASIN || ""}
          in_seller_account={in_seller_account}
          width={width}
        />
      );
    },
  },
  {
    accessorKey: "supplier_item_number",
    header: "Item No",
  },
  {
    accessorKey: "seller_sku",
    header: "SKU",
    size: 120,
  },
  {
    id: "asin_gtin",
    header: "ASIN/GTIN",
    size: 120,
    cell: ({ row }) => {
      const ASIN = row.original.ASIN;
      const GTIN = row.original.gtin;
      return <span>{ASIN || GTIN || "N/A"}</span>;
    },
  },
  {
    accessorKey: "upc",
    header: "UPC",
    size: 120,
  },
  {
    accessorKey: "pack_type",
    header: "Pack Type",
    size: 80,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <AddQuantity
          productQuantity={row.original.quantity}
          packType={row.original.pack_type}
          setProductsAdded={setProductsAdded}
          productId={row.original.product_id}
        />
      );
    },
  },
  {
    accessorKey: "product_cost",
    header: "Product Cost",
    cell: ({ row }) => {
      return (
        <AddProductCost
          productCost={row.original.product_cost}
          packType={row.original.pack_type}
          setProductsAdded={setProductsAdded}
          productId={row.original.product_id}
        />
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => {
      const product_cost = row.original.product_cost || 1;
      const quantity = row.original.quantity || 1;

      return (
        <span>
          $
          {FormatUSD({
            number: (product_cost * quantity).toString(),
            maxDigits: 2,
            minDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center">
          <RemoveProduct
            productInOrder={row.original}
            setData={setProductsAdded}
          />
        </span>
      );
    },
  },
];
