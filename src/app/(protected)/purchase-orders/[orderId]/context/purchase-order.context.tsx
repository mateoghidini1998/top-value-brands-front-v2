"use client";

import { createContext, useContext, useState } from "react";
import { CustomTrackedProduct } from "../columns";

interface PurchaseOrderContextType {
  products: CustomTrackedProduct[];
  updateProduct: (id: number, updates: Partial<CustomTrackedProduct>) => void;
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

  const updateProduct = (
    id: number,
    updates: Partial<CustomTrackedProduct>
  ) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  return (
    <PurchaseOrderContext.Provider value={{ products, updateProduct }}>
      {children}
    </PurchaseOrderContext.Provider>
  );
}

export function usePurchaseOrder() {
  const context = useContext(PurchaseOrderContext);
  if (context === undefined) {
    throw new Error(
      "usePurchaseOrder must be used within a PurchaseOrderProvider"
    );
  }
  return context;
}
