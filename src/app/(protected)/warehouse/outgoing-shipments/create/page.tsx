"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  GetAllPalletProductsResponse,
  GetAllPalletProductsResponsePallet,
  GetAllPalletProductsResponsePalletProduct,
} from "@/types";
import { useSearchParams } from "next/navigation";
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
import { GetShipemntByIDResponse } from "@/types/shipments/get.types";

function stripEmptyLevels(
  orders: GetAllPalletProductsResponse[]
): GetAllPalletProductsResponse[] {
  return (
    orders
      .map((order) => {
        // 1) Filtrar productos dentro de cada pallet
        const cleanedPallets = order.pallets
          .map((pallet) => ({
            ...pallet,
            palletProducts: pallet.palletProducts.filter(
              (product) => product.available_quantity !== 0
            ),
          }))
          // 2) Quitar pallets sin productos
          .filter((pallet) => pallet.palletProducts.length > 0);

        return {
          ...order,
          pallets: cleanedPallets,
        };
      })
      // 3) Quitar orders sin pallets
      .filter((order) => order.pallets.length > 0)
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("update");

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

  const { palletProducts, palletProductsIsLoading, palletProductsIsError } =
    useGetAllPalletProducts();
  const { createShipmentAsync, isCreatingShipment } = useCreateShipment();
  const { updateShipmentAsync, isUpdatingShipment } = useUpdateShipment(
    parseInt(shipmentId || "0") || 0
  );
  const { shipment } = useGetShipmentById(shipmentId || "");

  console.log(palletProducts);

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

    const cleaned: GetAllPalletProductsResponse[] =
      stripEmptyLevels(palletProducts);

    if (shipmentId) {
      // @ts-expect-error @typescript-eslint/no-unsafe-member-access
      setSelectedProducts(cleaned);
    } else {
      setAvailableProducts(cleaned);
    }
  }, [palletProducts, shipmentId]);

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
          if (!newSelectedProducts.some((p) => p.id === product.id)) {
            newSelectedProducts.push(product);
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
          if (!newSelectedProducts.some((p) => p.id === product.id)) {
            newSelectedProducts.push(product);
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
  };

  const handleCancel = () => {
    if (shipmentId && shipment) {
      setSelectedProducts(mapPalletProductsResponse(shipment));
    } else {
      setSelectedProducts([]);
      setAvailableProducts(stripEmptyLevels(palletProducts!) || []);
    }
  };

  const updateAvailableProducts = (
    newSelectedProducts: GetAllPalletProductsResponsePalletProduct[]
  ) => {
    setAvailableProducts((prevAvailable) =>
      prevAvailable.map((order) => ({
        ...order,
        pallets: order.pallets.map(
          (pallet: GetAllPalletProductsResponsePallet) => ({
            ...pallet,
            palletProducts: pallet.palletProducts.filter(
              (product) => !newSelectedProducts.some((p) => p.id === product.id)
            ),
          })
        ),
      }))
    );
  };

  const handleQuantityConfirm = (quantity: number) => {
    if (quantityDialog.product && quantityDialog.action === "add") {
      const availableQuantity = quantityDialog.product.available_quantity || 0;

      if (quantity === availableQuantity) {
        setSelectedProducts((prev) => {
          // validate that the product is not already added. Else updates the quantity
          if (prev.some((p) => p.id === quantityDialog.product!.id)) {
            //1. find the product
            //2. update the quantity
            //3. return the new array with the updated produc

            const newSelectedProducts = prev.map((p) => {
              if (p.id === quantityDialog.product!.id) {
                return {
                  ...p,
                  available_quantity: p.available_quantity! + quantity,
                };
              }
              return p;
            });

            return newSelectedProducts;
          } else {
            return [...prev, { ...quantityDialog.product!, quantity }];
          }
        });

        updateAvailableProducts([...selectedProducts, quantityDialog.product!]);
      } else if (quantity < availableQuantity) {
        setSelectedProducts((prev) => {
          // validate that the product is not already added. Else updates the quantity
          if (prev.some((p) => p.id === quantityDialog.product!.id)) {
            //1. find the product
            //2. update the quantity
            //3. return the new array with the updated produc

            const newSelectedProducts = prev.map((p) => {
              if (p.id === quantityDialog.product!.id) {
                return {
                  ...p,
                  available_quantity: p.available_quantity! + quantity,
                };
              }
              return p;
            });

            return newSelectedProducts;
          } else {
            return [
              ...prev,
              { ...quantityDialog.product!, available_quantity: quantity },
            ];
          }
        });
        setAvailableProducts((prevAvailable) => {
          return prevAvailable.map((order) => ({
            ...order,
            pallets: order.pallets.map((pallet) => ({
              ...pallet,
              palletProducts: pallet.palletProducts.map((product) =>
                product.id === quantityDialog.product!.id
                  ? {
                      ...product,
                      available_quantity: availableQuantity - quantity,
                    }
                  : product
              ),
            })),
          }));
        });
      }
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
