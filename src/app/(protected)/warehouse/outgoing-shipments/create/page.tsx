"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePalletProductsQuery } from "../hooks/usePalletProductsQuery";
import { TabbedDataTable } from "./_components/tables/tabbed-data-table";
import { SelectedProductsTable } from "./_components/tables/selected-products-table";
import { GetAllPalletProductsResponsePalletProduct } from "@/types";

export default function Page() {
  const { palletProductsQuery } = usePalletProductsQuery();
  const [selectedProducts, setSelectedProducts] = useState<
    GetAllPalletProductsResponsePalletProduct[]
  >([]);

  if (palletProductsQuery.isError) {
    return <div>Error</div>;
  }

  if (palletProductsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!palletProductsQuery.data) {
    return <div>No data</div>;
  }

  const handleAddProduct = (
    product: GetAllPalletProductsResponsePalletProduct
  ) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  const handleAddPalletProducts = (palletId: number) => {
    const pallet = palletProductsQuery.data
      .flatMap((order) => order.pallets)
      .find((p) => p.id === palletId);

    if (pallet) {
      setSelectedProducts((prev) => [...prev, ...pallet.palletProducts]);
    }
  };

  const handleAddPurchaseOrderProducts = (purchaseOrderId: number) => {
    const order = palletProductsQuery.data.find(
      (o) => o.id === purchaseOrderId
    );

    if (order) {
      const products = order.pallets.flatMap((p) => p.palletProducts);
      setSelectedProducts((prev) => [...prev, ...products]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const handleSaveShipment = () => {
    console.log("Selected products:", selectedProducts);
  };

  const handleCancel = () => {
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-[60vh] bg-transparent p-6 w-full">
      <Card className="w-full mx-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Manage Shipment</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveShipment}>
                Save Shipment
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Available Products</h2>
              <div className="rounded-lg border bg-card p-4">
                <TabbedDataTable
                  data={palletProductsQuery.data}
                  onAddProduct={handleAddProduct}
                  onAddPalletProducts={handleAddPalletProducts}
                  onAddPurchaseOrderProducts={handleAddPurchaseOrderProducts}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Selected Products</h2>
              <div className="rounded-lg border bg-card p-4">
                <SelectedProductsTable
                  data={selectedProducts}
                  onRemoveProduct={handleRemoveProduct}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
