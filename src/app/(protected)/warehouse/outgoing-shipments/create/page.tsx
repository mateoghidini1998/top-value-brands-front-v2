"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  GetAllPalletProductsResponse,
  GetAllPalletProductsResponsePalletProduct,
} from "@/types";
import { GetShipemntByIDResponse } from "@/types/shipments/get.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetAllPalletProducts } from "../../storage/hooks/use-pallets-service";
import {
  useCreateShipment,
  useGetShipmentById,
  useUpdateShipment,
} from "../hooks/use-shipments-service";
import { QuantityInputDialog } from "./_components/quantity-input-dialog";
import { SelectedProductsTable } from "./_components/tables/selected-products-table";
import { TabbedDataTable } from "./_components/tables/tabbed-data-table";

export default function Page() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("update");
  const router = useRouter();

  function mapPalletProductsResponse(
    raw: GetShipemntByIDResponse
  ): GetAllPalletProductsResponsePalletProduct[] {
    console.log(raw);

    return raw.PalletProducts.map((item) => {
      return {
        id: item?.id,
        purchaseorderproduct_id: item?.purchaseorderproduct_id,
        outgoingshipmentproduct_is_checked:
          item?.OutgoingShipmentProduct.is_checked,
        quantity: item?.quantity,
        available_quantity: item?.OutgoingShipmentProduct.quantity,
        createdAt: new Date(item?.createdAt),
        updatedAt: new Date(item?.updatedAt),
        pallet_id: item?.pallet_id,
        product: {
          product_name: item?.product_name,
          product_image: item?.product_image,
          seller_sku: item?.seller_sku,
          ASIN: item?.ASIN,
          in_seller_account: Boolean(item?.in_seller_account),
          upc: item?.upc,
        },
      };
    });
  }

  const {
    palletProducts,
    palletProductsIsLoading,
    palletProductsIsError,
    palletProductsRefetch,
  } = useGetAllPalletProducts();
  const { createShipmentAsync, isCreatingShipment } = useCreateShipment();
  const { updateShipmentAsync, isUpdatingShipment } = useUpdateShipment(
    parseInt(shipmentId || "0") || 0
  );
  const { shipment: shipment } = useGetShipmentById(shipmentId || "");
  const [availableProducts, setAvailableProducts] = useState<
    GetAllPalletProductsResponse[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    GetAllPalletProductsResponsePalletProduct[]
  >([]);

  const [quantityDialog, setQuantityDialog] = useState<{
    isOpen: boolean;
    product: GetAllPalletProductsResponsePalletProduct | null;
    action: "add" | "remove";
  }>({ isOpen: false, product: null, action: "add" });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditingShipment, setIsEditingShipment] = useState<boolean>(
    shipmentId !== null
  );

  useEffect(() => {
    if (shipmentId && shipment) {
      setSelectedProducts(mapPalletProductsResponse(shipment));
    }
  }, [shipmentId, shipment]);

  useEffect(() => {
    if (!palletProducts) return;

    const cleaned: GetAllPalletProductsResponse[] = palletProducts;

    setAvailableProducts(cleaned);
  }, [palletProducts]);

  console.log(availableProducts);

  if (isCreatingShipment || isUpdatingShipment) {
    return <LoadingSpinner />;
  }

  if (palletProductsIsLoading) {
    return <LoadingSpinner />;
  }

  if (palletProductsIsError) {
    return <div>Error</div>;
  }

  if (!availableProducts.length && !shipmentId) {
    return <div>No pallets found for active purchase orders.</div>;
  }

  const handleAddProduct = (
    product: GetAllPalletProductsResponsePalletProduct
  ) => {
    setQuantityDialog({ isOpen: true, product, action: "add" });
  };

  const handleAddPalletProducts = (palletId: number) => {
    const pallet = availableProducts
      .flatMap((order) => order.pallets)
      .find((p) => p.id === palletId);

    if (pallet) {
      const newSelectedProducts = [...selectedProducts];

      pallet.palletProducts.forEach(
        (product: GetAllPalletProductsResponsePalletProduct) => {
          const idx = newSelectedProducts.findIndex((p) => p.id === product.id);
          if (idx > -1) {
            // Sumar cantidad
            newSelectedProducts[idx] = {
              ...newSelectedProducts[idx],
              available_quantity:
                (newSelectedProducts[idx].available_quantity || 0) +
                (product.available_quantity || 0),
            };
          } else {
            newSelectedProducts.push({ ...product });
          }
        }
      );
      setSelectedProducts(newSelectedProducts);
      updateAvailableProducts(newSelectedProducts);
    }
  };

  const handleAddPurchaseOrderProducts = (purchaseOrderId: number) => {
    const order = availableProducts.find((o) => o.id === purchaseOrderId);

    if (order) {
      const newSelectedProducts = [...selectedProducts];
      order.pallets
        .flatMap((p) => p.palletProducts)
        .forEach((product) => {
          const idx = newSelectedProducts.findIndex((p) => p.id === product.id);
          if (idx > -1) {
            // Sumar cantidad
            newSelectedProducts[idx] = {
              ...newSelectedProducts[idx],
              available_quantity:
                (newSelectedProducts[idx].available_quantity || 0) +
                (product.available_quantity || 0),
            };
          } else {
            newSelectedProducts.push({ ...product });
          }
        });
      setSelectedProducts(newSelectedProducts);
      updateAvailableProducts(newSelectedProducts);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const product = selectedProducts.find((p) => p.id === productId);
    if (product) {
      setQuantityDialog({ isOpen: true, product, action: "remove" });
    }
  };

  const handleSaveShipment = async () => {
    if (selectedProducts.length === 0) {
      return toast.error("Please select at least one product");
    }
    await createShipmentAsync({
      shipment_number: `TV-USA-${Math.floor(100000 + Math.random() * 900000)}`,
      palletproducts: selectedProducts.map((p) => {
        return {
          pallet_product_id: p.id,
          quantity: p.available_quantity!,
        };
      }),
    });

    setSelectedProducts([]);
  };
  const handleUpdateShipment = async () => {
    if (selectedProducts.length === 0) {
      return toast.error("Please select at least one product");
    }
    await updateShipmentAsync({
      shipment_id: shipment!.id,
      palletproducts: selectedProducts.map((p) => {
        return {
          pallet_product_id: p.id,
          quantity: p.available_quantity!,
        };
      }),
    });

    setSelectedProducts([]);
    router.push(`/warehouse/outgoing-shipments/${shipment!.id}`);
  };

  const handleCancel = async () => {
    if (shipmentId && shipment) {
      setSelectedProducts(mapPalletProductsResponse(shipment));
    } else {
      setSelectedProducts([]);
    }
    const products = await palletProductsRefetch();
    setAvailableProducts(products.data!); // <-- Hace el refetch al backend
  };

  const updateAvailableProducts = (
    newSelectedProducts: GetAllPalletProductsResponsePalletProduct[]
  ) => {
    setAvailableProducts((prevAvailable) =>
      prevAvailable.map((order) => ({
        ...order,
        pallets: order.pallets.map((pallet) => ({
          ...pallet,
          palletProducts: pallet.palletProducts
            .map((product) => {
              // Sumar todas las quantities seleccionadas para este producto
              const selected = newSelectedProducts.find(
                (p) => p.id === product.id
              );
              const selectedQty = selected?.available_quantity ?? 0;
              const originalQty = product.available_quantity ?? 0;
              const remaining = originalQty - selectedQty;

              if (remaining > 0) {
                return { ...product, available_quantity: remaining };
              }
              // Si ya no queda quantity, desaparece de available
              return null;
            })
            .filter(Boolean) as GetAllPalletProductsResponsePalletProduct[],
        })),
      }))
    );
  };

  const handleQuantityConfirm = (quantity: number) => {
    if (quantityDialog.product && quantityDialog.action === "add") {
      // Sumar o actualizar la cantidad en selected
      setSelectedProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === quantityDialog.product!.id);
        if (idx > -1) {
          // Si ya existe, sumá
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            available_quantity:
              (updated[idx].available_quantity ?? 0) + quantity,
          };
          return updated;
        } else {
          // Nuevo producto seleccionado
          return [
            ...prev,
            { ...quantityDialog.product!, available_quantity: quantity },
          ];
        }
      });

      // Luego, actualizar los available
      setAvailableProducts((prevAvailable) =>
        prevAvailable.map((order) => ({
          ...order,
          pallets: order.pallets.map((pallet) => ({
            ...pallet,
            palletProducts: pallet.palletProducts
              .map((product) => {
                if (product.id === quantityDialog.product!.id) {
                  const remaining =
                    (product.available_quantity ?? 0) - quantity;
                  if (remaining > 0) {
                    return { ...product, available_quantity: remaining };
                  }
                  // No mostrarlo si no queda más
                  return null;
                }
                return product;
              })
              .filter(Boolean) as GetAllPalletProductsResponsePalletProduct[],
          })),
        }))
      );
    } else if (quantityDialog.product && quantityDialog.action === "remove") {
      const selectedProduct = selectedProducts.find(
        (p) => p.id === quantityDialog.product!.id
      );
      const selectedQuantity = selectedProduct?.available_quantity || 0;

      if (quantity === selectedQuantity) {
        setSelectedProducts((prev) =>
          prev.filter((p) => p.id !== quantityDialog.product!.id)
        );
        restoreProductToAvailable(quantityDialog.product!, quantity);
      } else if (quantity < selectedQuantity) {
        setSelectedProducts((prev) =>
          prev.map((p) =>
            p.id === quantityDialog.product!.id
              ? { ...p, available_quantity: selectedQuantity - quantity }
              : p
          )
        );
        restoreProductToAvailable(quantityDialog.product!, quantity);
      }
    }
    setQuantityDialog({ isOpen: false, product: null, action: "add" });
  };

  const restoreProductToAvailable = (
    product: GetAllPalletProductsResponsePalletProduct,
    quantity: number
  ) => {
    setAvailableProducts((prevAvailable) => {
      return prevAvailable.map((order) => ({
        ...order,
        pallets: order.pallets.map((pallet) => {
          if (pallet.id === product.pallet_id) {
            return {
              ...pallet,
              palletProducts: pallet.palletProducts.some(
                (p) => p.id === product.id
              )
                ? pallet.palletProducts.map((p) =>
                    p.id === product.id
                      ? {
                          ...p,
                          available_quantity:
                            (p.available_quantity || 0) + quantity,
                        }
                      : p
                  )
                : [
                    ...pallet.palletProducts,
                    { ...product, available_quantity: quantity },
                  ],
            };
          }
          return pallet;
        }),
      }));
    });
  };

  return (
    <div className="min-h-[60vh] bg-transparent p-6 w-full">
      <Card className="w-full mx-auto bg-background">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Manage Shipment</CardTitle>
            <div className="flex gap-3">
              {!isEditingShipment ? (
                <Button variant="default" onClick={handleSaveShipment}>
                  Save Shipment
                </Button>
              ) : (
                <Button variant="default" onClick={handleUpdateShipment}>
                  Update Shipment
                </Button>
              )}
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
              <div className="rounded-lg border p-4 bg-background">
                <TabbedDataTable
                  data={availableProducts}
                  onAddProduct={handleAddProduct}
                  onAddPalletProducts={handleAddPalletProducts}
                  onAddPurchaseOrderProducts={handleAddPurchaseOrderProducts}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Selected Products</h2>
              <div className="rounded-lg border bg-background p-4">
                <SelectedProductsTable
                  data={selectedProducts}
                  onRemoveProduct={handleRemoveProduct}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <QuantityInputDialog
        isOpen={quantityDialog.isOpen}
        onClose={() =>
          setQuantityDialog({ isOpen: false, product: null, action: "add" })
        }
        onConfirm={handleQuantityConfirm}
        product={quantityDialog.product}
        action={quantityDialog.action}
      />
    </div>
  );
}
