"use client";

import {
  CustomTrackedProduct,
  PurchaseOrderProductsUpdates,
} from "@/app/(protected)/purchase-orders/interfaces/orders.interface";
import { createContext, useContext, useState } from "react";
interface PurchaseOrderContextType {
  products: CustomTrackedProduct[];
  updateProduct: (id: number, updates: Partial<CustomTrackedProduct>) => void;
  updatedPOProducts: PurchaseOrderProductsUpdates[];
  setUpdatedPOProducts: React.Dispatch<
    React.SetStateAction<PurchaseOrderProductsUpdates[]>
  >;
}

const PurchaseOrderContext = createContext<
  PurchaseOrderContextType | undefined
>(undefined);

export function PurchaseOrderProvider({
  children,
  initialProducts,
}: {
  children: React.ReactNode;
  initialProducts: CustomTrackedProduct[];
}) {
  const [products, setProducts] =
    useState<CustomTrackedProduct[]>(initialProducts);

  const [updatedPOProducts, setUpdatedPOProducts] = useState<
    PurchaseOrderProductsUpdates[]
  >([]);

  const updateProduct = (
    id: number,
    updates: Partial<CustomTrackedProduct>
  ) => {
    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) => {
        if (product.id === id) {
          const updatedProduct = { ...product, ...updates };
          // Asegurarse de que total_amount se actualiza correctamente
          updatedProduct.total_amount =
            parseFloat(updatedProduct.product_cost) *
            updatedProduct.quantity_purchased;
          return updatedProduct;
        }
        return product;
      });
      setUpdatedPOProducts(transformProductsUpdates(updatedProducts));
      return updatedProducts;
    });
  };

  // transform the products into an array of product updates
  const transformProductsUpdates = (
    productsToUpdate: CustomTrackedProduct[]
  ) => {
    return productsToUpdate.map((product): PurchaseOrderProductsUpdates => {
      return {
        product_cost: product.product_cost,
        profit: product.profit?.toString(),
        purchaseOrderProductId: product.purchaseOrderProductId,
        quantityPurchased: product.quantity_purchased,
        unit_price: product.product_cost,
      };
    });
  };

  console.log(products);

  return (
    <PurchaseOrderContext.Provider
      value={{
        products,
        updateProduct,
        updatedPOProducts,
        setUpdatedPOProducts,
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
}

export function usePurchaseOrderContext() {
  const context = useContext(PurchaseOrderContext);
  if (context === undefined) {
    throw new Error(
      "usePurchaseOrder must be used within a PurchaseOrderProvider"
    );
  }
  return context;
}
