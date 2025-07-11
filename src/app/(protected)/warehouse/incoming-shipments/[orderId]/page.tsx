"use client";
import { useGetPurchaseOrderSummary } from "@/app/(protected)/purchase-orders/hooks";
import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import EditableOrderNotes from "@/components/custom/editable-order-notes";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useCreatePallet } from "../../storage/hooks/use-pallets-service";
import { useWarehouseAvailableLocations } from "../../storage/hooks/use-warehouse-locations-service";
import {
  useUpdateIncomingOrderNotes,
  useUpdateIncomingOrderProducts,
  useUpdateProductDGType,
} from "../hooks/use-incoming-orders-service";
import { addedToCreate, availableToCreate, incomingOrderCols } from "./columns";

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[110px] top-[-31.5px]",
  tableId: "incoming-order-id-table",
};

const ADD_DG_MANUALLY = false;

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
  const [activeTab, setActiveTab] = useState("summary");
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const handleTabChange = (newTab: string) => {
    if (newTab === "pallets" && activeTab === "summary") {
      setPendingTab("pallets");
      setIsSavingOrder(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleSaveAndSwitchTab = async () => {
    const res = await handleSaveIncomingOrder();
    if (res) {
      setIsSavingOrder(false);
      setLocalChanges({});
      if (pendingTab) {
        setActiveTab(pendingTab);
        setPendingTab(null);
      }
    }
  };

  const { getWarehouseAvailableLocations } = useWarehouseAvailableLocations();
  const [localChanges, setLocalChanges] = useState<
    Record<string, Partial<PurchaseOrderSummaryProducts>>
  >({});

  const [missingFields, setMissingFields] = useState<MissingFieldsInterface[]>(
    []
  );

  const { updateIncomingOrderProductsAsync } = useUpdateIncomingOrderProducts();
  const { updateIncomingOrderNotesAsync } = useUpdateIncomingOrderNotes();
  const { updateProductDGTypeAsync } = useUpdateProductDGType();
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

  const [pendingProducts, setPendingProducts] = useState<
    PurchaseOrderSummaryProducts[]
  >([]);
  const [currentProduct, setCurrentProduct] =
    useState<PurchaseOrderSummaryProducts | null>(null);

  const [isOpenUpdateDGProductModal, setIsOpenUpdateDGProductModal] =
    useState(false);

  const [selectedDGItem, setSelectedDGItem] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

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

      // TODO: Si la fecha es menos de 180 dias agregar expired como la reason : reason_id = 7!
      // expire data should be in the future of 180 days
      const expireDate = new Date(value || "");
      const today = new Date();
      if (expireDate.getTime() - today.getTime() < 1000 * 60 * 60 * 24 * 180) {
        setLocalChanges((prev) => ({
          ...prev,
          [rowId]: {
            ...prev[rowId],
            reason_id: 7,
          },
        }));
      }

      focusNextInput(rowId, "expire_date");
    },
    [focusNextInput]
  );

  useEffect(() => {
    if (ADD_DG_MANUALLY) {
      // Filtrar productos con dg_item === '--' solo al montar el componente
      const productsToUpdate = tableData.filter(
        (product) => product.dg_item === "--"
      );

      if (productsToUpdate.length > 0) {
        setPendingProducts(productsToUpdate);
        setCurrentProduct(productsToUpdate[0]); // Mostrar el primero
        setIsOpenUpdateDGProductModal(true);
      }
    }
  }, [tableData]);

  const handleUpdateProduct = async () => {
    if (!currentProduct || !selectedDGItem) return;

    setIsUpdating(true);

    try {
      await updateProductDGTypeAsync({
        productId: currentProduct.id.toString(),
        dgType: selectedDGItem,
      });

      // Remover el producto actualizado de la lista
      setPendingProducts((prev) => prev.slice(1));

      // Mostrar el siguiente producto, si hay más
      if (pendingProducts.length > 1) {
        setCurrentProduct(pendingProducts[1]); // Siguiente producto
        setSelectedDGItem(""); // Resetear el dropdown
      } else {
        setCurrentProduct(null); // No hay más productos pendientes
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveIncomingOrder = (): Promise<unknown> | null => {
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
      return null;
    }

    return updateIncomingOrderProductsAsync({
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

    await createPalletAsync({
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
        palletId = res.pallet.id;
      }
    });

    setProductsAddedToCreatePallet([]);
    setPalletNumber(Math.floor(Math.random() * 10000000).toString());
    setWarehouseLocation(0);

    const PALLET_URL = `${process.env.NEXT_PUBLIC_FRONT_URL}/warehouse/storage/${palletId}`;
    console.log(PALLET_URL);

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
      <Tabs
        defaultValue={"summary"}
        value={activeTab}
        className="flex flex-col items-center justify-between gap-4 relative"
      >
        <TabsList className="grid w-fit px-2 grid-cols-2 items-end self-end absolute right-0 top-[7px]">
          <TabsTrigger
            onClick={() => handleTabChange("summary")}
            value="summary"
          >
            summary
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              if (Object.keys(localChanges).length > 0) {
                handleTabChange("pallets");
              } else {
                setActiveTab("pallets"); // Cambiar de tab si no hay cambios
              }
            }}
            value="pallets"
          >
            pallets
          </TabsTrigger>
        </TabsList>

        {/* Summary */}
        <TabsContent value="summary" className="w-full">
          <Button
            onClick={() => setIsSavingOrder(true)}
            variant={"default"}
            className="bg-blue-500 text-white hover:bg-blue-400"
          >
            Save Order
          </Button>
          <AlertDialog
            open={isSavingOrder}
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
                <AlertDialogCancel
                  onClick={() => {
                    setPendingTab(null);
                    setLocalChanges({});
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveAndSwitchTab}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {currentProduct && (
            <AlertDialog open={isOpenUpdateDGProductModal}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    You need to update DG Item to continue
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div>
                      <p className="text-md mb-6">
                        Please select a DG Type for the product:{" "}
                      </p>
                      <ul className="flex flex-col items-start justify-between gap-6">
                        <li className="text-white text-md">
                          <span className="text-gray-400">Name: </span>{" "}
                          {currentProduct.product_name}
                        </li>
                        <li className="text-white text-md">
                          <span className="text-gray-400">ASIN: </span>{" "}
                          {currentProduct.ASIN}
                        </li>
                        <li className="text-white text-md">
                          <span className="text-gray-400">SKU: </span>{" "}
                          {currentProduct.seller_sku}
                        </li>
                        <li className="text-white text-md">
                          <span className="text-gray-400">UPC: </span>{" "}
                          {currentProduct.upc || " --"}
                        </li>
                        <li className="text-white text-md">
                          <span className="text-gray-400">Item No: </span>{" "}
                          {currentProduct.supplier_item_number || " --"}
                        </li>
                      </ul>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <Select
                  value={selectedDGItem}
                  onValueChange={setSelectedDGItem}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select DG Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="FLAMMABLES">FLAMMABLES</SelectItem>
                    <SelectItem value="AEROSOLS">AEROSOLS</SelectItem>
                    <SelectItem value="OVERSIZED">OVERSIZED</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialogFooter>
                  <AlertDialogAction
                    className="bg-red-500"
                    onClick={() => setIsOpenUpdateDGProductModal(false)}
                    disabled={isUpdating}
                  >
                    {"CANCEL"}
                  </AlertDialogAction>
                  <AlertDialogAction
                    onClick={handleUpdateProduct}
                    disabled={!selectedDGItem || isUpdating}
                  >
                    {isUpdating ? "Saving..." : "NEXT"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
            // data with dg_items == true should be added at the bottom of the table
            data={tableData}
            dataLength={tableData.length}
            showHideColumns={showColumns}
          />
        </TabsContent>
        {/* Pallet */}
        <TabsContent value="pallets" className="w-full">
          <Button onClick={() => handleSavePallets()} variant={"outline"}>
            Save Pallet
          </Button>
          <DataTable
            columns={availableToCreate((product) => {
              setProductsAddedToCreatePallet((prev) => {
                if (product.quantity_available <= 0) {
                  toast.error(
                    "There is no quantity available for this product"
                  );
                  return prev;
                }

                // Determinar el tipo del nuevo producto
                const isNewDgItemValid =
                  product.dg_item &&
                  product.dg_item !== "--" &&
                  product.dg_item !== "STANDARD";

                // Si ya hay productos en la lista, verificamos si son del mismo tipo
                if (prev.length > 0) {
                  const isExistingDgItemValid =
                    prev[0].dg_item &&
                    prev[0].dg_item !== "--" &&
                    prev[0].dg_item !== "STANDARD"; // Tipo del primer producto agregado

                  if (isExistingDgItemValid !== isNewDgItemValid) {
                    toast.error(
                      "You can't combine dangerous and standard products in one pallet"
                    );
                    return prev; // No se agrega el producto
                  }
                }

                // 2. Validar marketplace
                // Definir la función para identificar el marketplace:
                const getMarketplace = (prod: PurchaseOrderSummaryProducts) =>
                  prod?.ASIN ? "amazon" : prod?.GTIN ? "walmart" : null;

                const existingMarketplace = getMarketplace(prev[0]);
                const newMarketplace = getMarketplace(product);

                if (existingMarketplace !== newMarketplace && prev.length > 0) {
                  toast.error(
                    "You can't combine products from different marketplaces in one pallet"
                  );
                  return prev;
                }

                // Agregar el producto si cumple con la validación
                return [
                  ...prev,
                  {
                    ...product,
                    pallet_quantity: product.quantity_available,
                  },
                ];
              });
            })}
            data={[
              ...tableData.filter(
                (product) =>
                  product.quantity_available > 0 &&
                  !productsAddedToCreatePallet.some(
                    (addedProduct) => addedProduct.id === product.id
                  ) &&
                  (!product.dg_item || product.dg_item === "--") // dg_item es null o '--' (van al inicio)
              ),
              ...tableData.filter(
                (product) =>
                  product.quantity_available > 0 &&
                  !productsAddedToCreatePallet.some(
                    (addedProduct) => addedProduct.id === product.id
                  ) &&
                  product.dg_item &&
                  product.dg_item !== "--" // dg_item tiene un valor válido (van al final)
              ),
            ]}
            dataLength={10000}
            showHideColumns={showColumns}
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
          <Card className="w-full text-black-100 mt-10 bg-background">
            <CardHeader>
              <CardTitle>Pallet Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-start justify-between gap-4 w-full">
                <div className="space-y-2">
                  <p className="text-sm text-black-400">Pallet Number</p>
                  <p># {palletNumber}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-black-400">Warehouse Location</p>
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
                    <SelectTrigger className="w-52 border-black-700">
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
                  <p className="text-sm text-black-400">
                    Purchase Order Number
                  </p>
                  <p>{ordersSummaryResponse.data.order.order_number}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-black-400">Date</p>
                  <p>{formatDate(new Date().toString())}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-black-400">Total Quantity</p>
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

      <EditableOrderNotes
        onAction={updateIncomingOrderNotesAsync}
        notes={
          ordersSummaryResponse.data.order.incoming_order_notes ||
          "No notes yet"
        }
        orderId={params.orderId}
      />
    </div>
  );
}
