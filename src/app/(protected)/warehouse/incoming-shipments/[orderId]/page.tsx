"use client";

import { useOrderSummaryQuery } from "@/app/(protected)/purchase-orders/[orderId]/hooks";
import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/helpers/format-date";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useMemo, useState } from "react";
import { useIncomingShipmentsMutations } from "../hooks/useIncomingShipmentsMutation";
import { addedToCreate, availableToCreate, incomingOrderCols } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const { data, isLoading, error } = useOrderSummaryQuery(params.orderId);
  const [localChanges, setLocalChanges] = useState<
    Record<string, Partial<PurchaseOrderSummaryProducts>>
  >({});

  const { updateIncomingOrderProducts, createPallet } =
    useIncomingShipmentsMutations(params.orderId);

  const [productsAddedToCreatePallet, setProductsAddedToCreatePallet] =
    useState<PurchaseOrderSummaryProducts[]>([]);

  const [warehouseLocation, setWarehouseLocation] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [palletNumber, setPalletNumber] = useState<string>(
    Math.floor(Math.random() * 10000000).toString()
  );

  // Combinar datos originales con cambios locales
  const tableData = useMemo(() => {
    if (!data?.data.purchaseOrderProducts) return [];

    return data.data.purchaseOrderProducts.map((product) => ({
      ...product,
      ...localChanges[product.id],
    }));
  }, [data?.data.purchaseOrderProducts, localChanges]);

  const handleQuantityReceivedChange = (rowId: string, value: number) => {
    setLocalChanges((prev) => {
      const quantity_missing =
        (data?.data.purchaseOrderProducts.find((p) => p.id === Number(rowId))
          ?.quantity_purchased || 0) - value;

      return {
        ...prev,
        [rowId]: {
          ...prev[rowId],
          quantity_received: value,
          quantity_missing: quantity_missing >= 0 ? quantity_missing : 0,
          reason_id: quantity_missing === 0 ? 1 : prev[rowId]?.reason_id,
        },
      };
    });
  };

  const handleReasonChange = (rowId: string, value: number) => {
    setLocalChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        reason_id: value,
      },
    }));
  };

  const handleUpcChange = (rowId: string, value: string) => {
    setLocalChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        upc: value,
      },
    }));
  };

  const handleExpireDateChange = (rowId: string, value: Date | undefined) => {
    setLocalChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        expire_date: value ? value.toISOString() : null,
      },
    }));
  };

  const handleSaveIncomingOrder = () => {
    const updatedProducts = tableData.map((product) => ({
      purchase_order_product_id: product.purchase_order_product_id,
      product_id: product.id,
      quantity_received: product.quantity_received,
      quantity_missing: product.quantity_missing,
      reason_id: product.reason_id,
      upc: product.upc,
      expire_date: product.expire_date,
    }));

    updateIncomingOrderProducts({
      orderId: Number(params.orderId),
      incomingOrderProductUpdates: updatedProducts,
    });
  };

  const handleSavePallets = () => {
    if (productsAddedToCreatePallet.length === 0) {
      toast.error("No products added");
      return;
    }

    if (warehouseLocation === 0) {
      toast.error("Please select a warehouse location");
      return;
    }

    const validProducts = productsAddedToCreatePallet.filter(
      (prod) => prod.purchase_order_product_id && prod.pallet_quantity
    );

    if (validProducts.length === 0) {
      throw new Error("No valid products to create a pallet");
    }

    createPallet({
      warehouse_location_id: Number(warehouseLocation),
      pallet_number: Number(palletNumber),
      purchase_order_id: Number(params.orderId), // Asegúrate de incluir este campo
      products: validProducts.map((prod) => ({
        purchaseorderproduct_id: Number(prod.purchase_order_product_id),
        quantity: Number(prod.pallet_quantity),
      })),
    });

    setProductsAddedToCreatePallet([]);
    setPalletNumber(Math.floor(Math.random() * 10000000).toString());
    setWarehouseLocation(0);
  };

  const handleUpdatePalletQuantity = (
    productId: number,
    newQuantity: number
  ) => {
    setProductsAddedToCreatePallet((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, pallet_quantity: newQuantity }
          : product
      )
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading purchase order: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !tableData.length) return null;

  return (
    <div className="py-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Purchase order {data.data.order.order_number}
      </h1>

      <Tabs
        defaultValue={"summary"}
        className="flex flex-col items-center justify-between gap-4 relative"
      >
        <TabsList className="grid w-fit px-2 grid-cols-2 items-end self-end mr-4 absolute right-0 top-[7px]">
          <TabsTrigger value="summary">summary</TabsTrigger>
          <TabsTrigger value="pallets">pallets</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Button onClick={() => handleSaveIncomingOrder()}>Save Order</Button>
          <DataTable
            columns={incomingOrderCols(
              handleQuantityReceivedChange,
              handleReasonChange,
              handleUpcChange,
              handleExpireDateChange
            )}
            data={tableData}
            dataLength={tableData.length}
          />
        </TabsContent>
        <TabsContent value="pallets">
          <Button onClick={() => handleSavePallets()}>Save Pallet</Button>
          <DataTable
            columns={availableToCreate((product) => {
              // validate that the queantity is less than or equal to the quantity available
              setProductsAddedToCreatePallet((prev) => {
                if (product.quantity_available <= 0) {
                  toast.error(
                    "There is no quantity available for this product"
                  );
                  return prev;
                }

                return [
                  ...prev,
                  {
                    ...product,
                    pallet_quantity: product.quantity_received,
                  },
                ];
              });
            })}
            data={tableData.filter(
              (product) =>
                !productsAddedToCreatePallet.some(
                  (addedProduct) => addedProduct.id === product.id
                )
            )}
            dataLength={10000}
          />
          <DataTable
            columns={addedToCreate((productToRemove) => {
              setProductsAddedToCreatePallet((prev) =>
                prev.filter((product) => product.id !== productToRemove.id)
              );
            }, handleUpdatePalletQuantity)}
            data={productsAddedToCreatePallet}
            dataLength={10000}
          />

          {/* Pallet Summary */}
          <Card className="w-full text-zinc-100 mt-10">
            <CardHeader>
              <CardTitle>Pallet Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-start justify-between gap-4 w-full">
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Pallet Number</p>
                  <p># {palletNumber}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Warehouse Location</p>
                  <Select
                    onValueChange={(value) =>
                      setWarehouseLocation(Number(value))
                    }
                    value={warehouseLocation.toString()}
                  >
                    <SelectTrigger className="w-52 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">A1</SelectItem>
                      <SelectItem value="2">A2</SelectItem>
                      <SelectItem value="3">B1</SelectItem>
                      <SelectItem value="4">B2</SelectItem>
                      <SelectItem value="5">C1</SelectItem>
                      <SelectItem value="6">C2</SelectItem>
                      <SelectItem value="7">D1</SelectItem>
                      <SelectItem value="8">D2</SelectItem>
                      <SelectItem value="9">E1</SelectItem>
                      <SelectItem value="10">E2</SelectItem>
                      <SelectItem value="11">Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Purchase Order Number</p>
                  <p>{data.data.order.order_number}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Date</p>
                  <p>{formatDate(new Date().toString())}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Total Quantity</p>
                  <p>
                    {productsAddedToCreatePallet.reduce(
                      (a, b) => a + (b.pallet_quantity || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
