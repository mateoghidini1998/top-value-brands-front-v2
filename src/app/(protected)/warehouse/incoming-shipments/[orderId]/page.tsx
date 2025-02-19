"use client";
import OrderNotes from "@/app/(protected)/purchase-orders/[orderId]/components/order-notes.component";
import { useGetPurchaseOrderSummary } from "@/app/(protected)/purchase-orders/hooks";
import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormatUSD } from "@/helpers";
import { formatDate } from "@/helpers/format-date";
import { generateQrCode, printQrCode } from "@/lib/qr-code";
import { PurchaseOrderSummaryProducts, WarehouseLocation } from "@/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useCreatePallet } from "../../storage/hooks/use-pallets-service";
import { useWarehouseAvailableLocations } from "../../storage/hooks/use-warehouse-locations-service";
import {
  useUpdateIncomingOrderNotes,
  useUpdateIncomingOrderProducts,
} from "../hooks/use-incoming-orders-service";
import { addedToCreate, availableToCreate, incomingOrderCols } from "./columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[110px] top-[-31.5px]",
};

export interface MissingFieldsInterface {
  product_id: number | string;
  missingFields: string[];
}

export default function Page({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const {
    ordersSummaryResponse,
    ordersSummaryIsLoading,
    ordersSummaryIsError,
    ordersSummaryError,
  } = useGetPurchaseOrderSummary(params.orderId);

  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const { getWarehouseAvailableLocations } = useWarehouseAvailableLocations();
  const [localChanges, setLocalChanges] = useState<
    Record<string, Partial<PurchaseOrderSummaryProducts>>
  >({});

  const [missingFields, setMissingFields] = useState<MissingFieldsInterface[]>(
    []
  );

  const { updateIncomingOrderProductsAsync } = useUpdateIncomingOrderProducts();
  const { updateIncomingOrderNotesAsync } = useUpdateIncomingOrderNotes();
  const { createPalletAsync } = useCreatePallet();
  const [productsAddedToCreatePallet, setProductsAddedToCreatePallet] =
    useState<PurchaseOrderSummaryProducts[]>([]);

  const [warehouseLocation, setWarehouseLocation] = useState<number>(0);
  const [warehouseLocationName, setWarehouseLocationName] =
    useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [palletNumber, setPalletNumber] = useState<string>(
    Math.floor(Math.random() * 10000000).toString()
  );

  // Combinar datos originales con cambios locales
  const tableData = useMemo(() => {
    if (!ordersSummaryResponse?.data.purchaseOrderProducts) return [];

    return ordersSummaryResponse.data.purchaseOrderProducts.map((product) => ({
      ...product,
      ...localChanges[product.id],
    }));
  }, [ordersSummaryResponse?.data.purchaseOrderProducts, localChanges]);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const focusNextInput = useCallback(
    (currentId: string, currentField: string) => {
      const fields = ["upc", "quantity_received", "reason_id", "expire_date"];
      const currentIndex = fields.indexOf(currentField);
      const nextField = fields[currentIndex + 1];

      if (nextField) {
        // Focus on the next field in the same row
        inputRefs.current[`${nextField}_${currentId}`]?.focus();
      } else {
        // If we've reached the end of the fields for this row, move to the next row
        const currentRowIndex = tableData.findIndex(
          (row) => row.id.toString() === currentId
        );
        const nextRow = tableData[currentRowIndex + 1];
        if (nextRow) {
          inputRefs.current[`upc_${nextRow.id}`]?.focus();
        }
      }
    },
    [tableData]
  );

  const handleReasonChange = useCallback(
    (rowId: string, value: number) => {
      setLocalChanges((prev) => ({
        ...prev,
        [rowId]: {
          ...prev[rowId],
          reason_id: value,
        },
      }));
      focusNextInput(rowId, "reason_id");
    },
    [focusNextInput]
  );

  const handleQuantityReceivedChange = useCallback(
    (rowId: string, value: number) => {
      setLocalChanges((prev) => {
        const quantity_missing =
          (ordersSummaryResponse?.data.purchaseOrderProducts.find(
            (p) => p.id === Number(rowId)
          )?.quantity_purchased || 0) - value;

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
      focusNextInput(rowId, "quantity_received");
    },
    [ordersSummaryResponse?.data.purchaseOrderProducts, focusNextInput]
  );

  const handleUpcChange = useCallback(
    (rowId: string, value: string) => {
      setLocalChanges((prev) => ({
        ...prev,
        [rowId]: {
          ...prev[rowId],
          upc: value,
        },
      }));
      focusNextInput(rowId, "upc");
    },
    [focusNextInput]
  );

  const handleExpireDateChange = useCallback(
    (rowId: string, value: Date | undefined) => {
      setLocalChanges((prev) => ({
        ...prev,
        [rowId]: {
          ...prev[rowId],
          expire_date: value ? value.toISOString() : null,
        },
      }));
      focusNextInput(rowId, "expire_date");
    },
    [focusNextInput]
  );

  const handleSaveIncomingOrder = () => {
    const updatedProducts = tableData.map((product) => {
      return {
        purchase_order_product_id: product.purchase_order_product_id,
        product_id: product.id,
        quantity_received: product.quantity_received,
        quantity_missing: product.quantity_missing,
        reason_id: product.reason_id,
        upc: product.upc,
        expire_date: product.expire_date,
      };
    });

    // validate that all the updates are complete, any fileds could be null or UNDEFINED or a empty string, return an error
    const incompleteUpdates = updatedProducts.find((update) => {
      console.log(update);
      return (
        update.quantity_received > 0 &&
        (!update.reason_id || !update.upc || !update.expire_date)
      );
    });

    if (incompleteUpdates) {
      setMissingFields((prev) => {
        const product = prev.find(
          (p) => p.product_id === incompleteUpdates.product_id
        );
        if (!product) {
          return [
            ...prev,
            {
              product_id: incompleteUpdates.product_id,
              missingFields: ["reason_id", "upc", "expire_date"].filter(
                // @ts-expect-error @typescript-eslint/no-unsafe-member-access
                (field) => !incompleteUpdates[field]
              ),
            },
          ];
        }
        return prev;
      });

      toast.error("Please complete all the fields");
      return;
    }

    updateIncomingOrderProductsAsync({
      orderId: Number(params.orderId),
      incomingOrderProductUpdates: updatedProducts,
    });
  };

  const handleSavePallets = async () => {
    let palletId = null;
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

    createPalletAsync({
      warehouse_location_id: Number(warehouseLocation),
      pallet_number: Number(palletNumber),
      purchase_order_id: Number(params.orderId), // Asegúrate de incluir este campo
      products: validProducts.map((prod) => ({
        purchaseorderproduct_id: Number(prod.purchase_order_product_id),
        quantity: Number(prod.pallet_quantity),
      })),
    }).then((res) => {
      if (res) {
        // @ts-expect-error @typescript-eslint/no-unsafe-member-access
        palletId = res.id;
      }
    });

    setProductsAddedToCreatePallet([]);
    setPalletNumber(Math.floor(Math.random() * 10000000).toString());
    setWarehouseLocation(0);

    const PALLET_URL = `${process.env.NEXT_PUBLIC_FRONT_URL}/warehouse/storage/${palletId}`;

    await generateQrCode(PALLET_URL).then((data) => {
      if (data) {
        printQrCode(
          data,
          palletNumber,
          ordersSummaryResponse?.data.order.order_number ||
            "Sorry, an error ocurred :(",
          warehouseLocationName
        );
      } else {
        toast.error("Sorry, an error ocurred while generating the QR code :(");
      }
    });
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

  if (ordersSummaryIsLoading) {
    return <LoadingSpinner />;
  }

  if (ordersSummaryIsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading purchase order: {ordersSummaryError?.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!ordersSummaryResponse || !tableData.length) return null;

  return (
    <div className="py-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Purchase order {ordersSummaryResponse.data.order.order_number}
      </h1>

      <OrderNotes
        onAction={updateIncomingOrderNotesAsync}
        notes={
          ordersSummaryResponse.data.order.incoming_order_notes ||
          "No notes yet"
        }
        orderId={params.orderId}
      />

      <Tabs
        defaultValue={"summary"}
        className="flex flex-col items-center justify-between gap-4 relative"
      >
        <TabsList className="grid w-fit px-2 grid-cols-2 items-end self-end absolute right-0 top-[7px]">
          <TabsTrigger value="summary">summary</TabsTrigger>
          <TabsTrigger value="pallets">pallets</TabsTrigger>
        </TabsList>

        {/* Summary */}
        <TabsContent value="summary" className="w-full">
          <Button onClick={() => setIsSavingOrder(true)}>Save Order</Button>
          <AlertDialog
            open={!!isSavingOrder}
            onOpenChange={(open) => !open && setIsSavingOrder(false)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure everything has been counted?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveIncomingOrder}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DataTable
            columns={incomingOrderCols(
              handleQuantityReceivedChange,
              handleReasonChange,
              handleUpcChange,
              handleExpireDateChange,
              focusNextInput,
              inputRefs,
              missingFields
            )}
            data={tableData}
            dataLength={tableData.length}
            showHideColumns={showColumns}
          />
        </TabsContent>
        {/* Pallet */}
        <TabsContent value="pallets" className="w-full">
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
                    pallet_quantity: product.quantity_available,
                  },
                ];
              });
            })}
            data={tableData.filter((product) => {
              // validate that the product has quantity available
              return (
                product.quantity_available > 0 &&
                !productsAddedToCreatePallet.some(
                  (addedProduct) => addedProduct.id === product.id
                )
              );
            })}
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
          <Card className="w-full text-zinc-100 mt-10 bg-background">
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
                    onValueChange={(value) => {
                      setWarehouseLocation(Number(value));
                      setWarehouseLocationName(
                        getWarehouseAvailableLocations.data?.data.find(
                          (location: WarehouseLocation) =>
                            location.id === Number(value)
                        )?.location || ""
                      );
                    }}
                    value={warehouseLocation.toString()}
                  >
                    <SelectTrigger className="w-52 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem className="w-full" key={0} value={"11"}>
                        <div className="w-full flex items-center justify-between">
                          <p>{"Floor"}</p>
                        </div>
                      </SelectItem>
                      {getWarehouseAvailableLocations.data?.data.map(
                        (location: WarehouseLocation) => {
                          return (
                            location.id !== 11 && (
                              <SelectItem
                                className="w-full"
                                key={location.id}
                                value={location.id.toString()}
                              >
                                <div className="w-full flex items-center justify-between">
                                  <p>{location.location}</p>
                                </div>
                              </SelectItem>
                            )
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Purchase Order Number</p>
                  <p>{ordersSummaryResponse.data.order.order_number}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Date</p>
                  <p>{formatDate(new Date().toString())}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Total Quantity</p>
                  <p>
                    {FormatUSD({
                      number: productsAddedToCreatePallet
                        .reduce((a, b) => a + (b.pallet_quantity || 0), 0)
                        .toString(),
                      maxDigits: 0,
                      minDigits: 0,
                    })}
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
