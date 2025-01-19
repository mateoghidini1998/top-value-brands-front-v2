"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetAllPalletProductsResponse } from "@/types";
import { purchaseOrderColumns } from "./columns/purchase-order-columns";
import { palletColumns } from "./columns/pallet-columns";
import { productColumns } from "./columns/product-columns";
import { DataTable } from "./data-table2";

interface TabbedDataTableProps {
  data: GetAllPalletProductsResponse[];
}

export function TabbedDataTable2({ data }: TabbedDataTableProps) {
  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList>
        <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        <TabsTrigger value="pallets">Pallets</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <DataTable columns={purchaseOrderColumns} data={data} />
      </TabsContent>
      <TabsContent value="pallets">
        <DataTable
          columns={palletColumns}
          data={data.flatMap((order) => order.pallets)}
        />
      </TabsContent>
      <TabsContent value="products">
        <DataTable
          columns={productColumns}
          data={data.flatMap((order) =>
            order.pallets.flatMap((pallet) => pallet.palletProducts)
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
