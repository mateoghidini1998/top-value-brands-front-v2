"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GetAllPalletProductsResponse,
  GetAllPalletProductsResponsePallet,
  GetAllPalletProductsResponsePalletProduct,
} from "@/types";
import { DataTable } from "./data-table";
import { ProductTitle } from "@/components/custom/product-title";

interface TabbedDataTableProps {
  data: GetAllPalletProductsResponse[];
  onAddProduct: (product: GetAllPalletProductsResponsePalletProduct) => void;
  onAddPalletProducts: (palletId: number) => void;
  onAddPurchaseOrderProducts: (purchaseOrderId: number) => void;
}

export function TabbedDataTable({
  data,
  onAddProduct,
  onAddPalletProducts,
  onAddPurchaseOrderProducts,
}: TabbedDataTableProps) {
  const [searchOrder, setSearchOrder] = useState("");
  const [searchPalletNumber, setSearchPalletNumber] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const filteredData = data.filter((order) =>
    order.order_number.toLowerCase().includes(searchOrder.toLowerCase())
  );
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [expandedPallets, setExpandedPallets] = useState<number[]>([]);

  const purchaseOrderColumns: ColumnDef<GetAllPalletProductsResponse>[] = [
    {
      id: "expand",
      header: "Show Pallets",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const orderId = row.original.id;
            setExpandedOrders(
              expandedOrders.includes(orderId)
                ? expandedOrders.filter((id) => id !== orderId)
                : [...expandedOrders, orderId]
            );
          }}
        >
          {expandedOrders.includes(row.original.id) ? "▼" : "▶"}
        </Button>
      ),
    },
    {
      accessorKey: "order_number",
      header: "Order Number",
    },
    {
      id: "pallet_count",
      header: "Pallet Count",
      cell: ({ row }) => row.original.pallets.length,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddPurchaseOrderProducts(row.original.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const palletColumns: ColumnDef<GetAllPalletProductsResponsePallet>[] = [
    {
      id: "expand",
      header: "Show Products",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const palletId = row.original.id;
            setExpandedPallets(
              expandedPallets.includes(palletId)
                ? expandedPallets.filter((id) => id !== palletId)
                : [...expandedPallets, palletId]
            );
          }}
        >
          {expandedPallets.includes(row.original.id) ? "▼" : "▶"}
        </Button>
      ),
    },
    {
      accessorKey: "pallet_number",
      header: "Pallet Number",
    },
    {
      accessorKey: "warehouse_location",
      header: "Location",
    },
    {
      id: "product_count",
      header: "Product Count",
      cell: ({ row }) => row.original.palletProducts.length,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddPalletProducts(row.original.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const productColumns: ColumnDef<GetAllPalletProductsResponsePalletProduct>[] =
    [
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
        accessorKey: "product.upc",
        header: "UPC",
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
            onClick={() => onAddProduct(row.original)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ),
      },
    ];

  return (
    <Tabs defaultValue="purchase_orders" className="w-full">
      <TabsList>
        <TabsTrigger value="purchase_orders">Purchase Orders</TabsTrigger>
        <TabsTrigger value="pallets">Pallets</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
      </TabsList>
      <div className="my-4 flex items-center justify-between space-x-4">
        <Input
          placeholder="Search by order number..."
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
        />
        <Input
          placeholder="Search by pallet number..."
          value={searchPalletNumber}
          onChange={(e) => setSearchPalletNumber(e.target.value)}
        />
        <Input
          placeholder="Search by product name..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
        />
      </div>
      <TabsContent value="purchase_orders">
        <DataTable
          columns={purchaseOrderColumns}
          data={filteredData}
          expandedRows={expandedOrders}
          renderSubComponent={({ row }) => (
            <div className="px-8 py-4">
              <DataTable
                columns={palletColumns}
                data={row.original.pallets}
                expandedRows={expandedPallets}
                renderSubComponent={({ row: palletRow }) => (
                  <div className="px-8 py-4">
                    <DataTable
                      columns={productColumns}
                      data={palletRow.original.palletProducts}
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      </TabsContent>
      <TabsContent value="pallets">
        <DataTable
          columns={palletColumns}
          data={filteredData
            .flatMap((order) => order.pallets)
            .filter((pallet) =>
              pallet.pallet_number
                .toLowerCase()
                .includes(searchPalletNumber.toLowerCase())
            )}
          expandedRows={expandedPallets}
          renderSubComponent={({ row }) => (
            <div className="px-8 py-4">
              <DataTable
                columns={productColumns}
                data={row.original.palletProducts}
              />
            </div>
          )}
        />
      </TabsContent>
      <TabsContent value="products">
        <DataTable
          columns={productColumns}
          data={filteredData.flatMap((order) =>
            order.pallets
              .filter((pallet) =>
                pallet.pallet_number
                  .toLowerCase()
                  .includes(searchPalletNumber.toLowerCase())
              )
              .flatMap((pallet) => pallet.palletProducts)
              .filter((product) =>
                product.product.product_name
                  .toLowerCase()
                  .includes(searchProduct.toLowerCase())
              )
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
