"use client";
import {
  PurchaseOrderProductsUpdates,
  PurchaseOrderSummaryProducts,
} from "@/types";
import { createContext, useContext, useState } from "react";

interface PurchaseOrderContextType {
  products: PurchaseOrderSummaryProducts[];
  updateProduct: (
    id: number,
    updates: Partial<PurchaseOrderSummaryProducts>
  ) => void;
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
  initialProducts: PurchaseOrderSummaryProducts[];
}) {
  const [products, setProducts] =
    useState<PurchaseOrderSummaryProducts[]>(initialProducts);

  const [updatedPOProducts, setUpdatedPOProducts] = useState<
    PurchaseOrderProductsUpdates[]
  >([]);

  const updateProduct = (
    id: number,
    updates: Partial<PurchaseOrderSummaryProducts>
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
    productsToUpdate: PurchaseOrderSummaryProducts[]
  ) => {
    return productsToUpdate.map((product): PurchaseOrderProductsUpdates => {
      return {
        product_cost: product.product_cost,
        profit: product.profit?.toString(),
        purchaseOrderProductId: product.purchase_order_product_id,
        quantityPurchased: product.quantity_purchased,
        unit_price: product.product_cost,
      };
    });
  };

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
