"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePalletProductsQuery } from "../hooks/usePalletProductsQuery";
import { TabbedDataTable } from "./_components/tables/tabbed-data-table";
import { SelectedProductsTable } from "./_components/tables/selected-products-table";
import { QuantityInputDialog } from "./_components/quantity-input-dialog";
import type {
  GetAllPalletProductsResponse,
  GetAllPalletProductsResponsePallet,
  GetAllPalletProductsResponsePalletProduct,
} from "@/types";
import { toast } from "sonner";
import { useShipmentMutations } from "../hooks/useShipmentMutation";

export default function Page() {
  const { palletProductsQuery } = usePalletProductsQuery();
  const { createShipment } = useShipmentMutations();
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

  useEffect(() => {
    if (palletProductsQuery.data) {
      setAvailableProducts(palletProductsQuery.data);
    }
  }, [palletProductsQuery.data]);

  if (palletProductsQuery.isError) {
    return <div>Error</div>;
  }

  if (palletProductsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!availableProducts.length) {
    return <div>No data</div>;
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

  const handleSaveShipment = () => {
    if (selectedProducts.length === 0) {
      return toast.error("Please select at least one product");
    }
    createShipment({
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

  const handleCancel = () => {
    setSelectedProducts([]);
    setAvailableProducts(palletProductsQuery.data || []);
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
          if (prev.some((p) => p.id === quantityDialog.product!.id)) {
            return prev.map((p) => {
              return { ...p, quantity: (p.quantity += quantity) };
            });
          } else {
            return [...prev, { ...quantityDialog.product!, quantity }];
          }
        });

        updateAvailableProducts([...selectedProducts, quantityDialog.product!]);
      } else if (quantity < availableQuantity) {
        setSelectedProducts((prev) => {
          // validate that the product is not already added. Else updates the quantity
          if (prev.some((p) => p.id === quantityDialog.product!.id)) {
            return prev.map((p) => {
              return { ...p, quantity: (p.quantity += quantity) };
            });
          } else {
            return [...prev, { ...quantityDialog.product!, quantity }];
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
                  data={availableProducts}
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
