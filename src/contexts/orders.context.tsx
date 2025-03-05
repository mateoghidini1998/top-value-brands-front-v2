"use client";
import { PurchaseOrderSummaryProducts } from "@/types";
import { PurchaseOrderProductsUpdates } from "@/types/purchase-orders";
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
  removeProduct: (id: number) => void;
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

  // const updateProduct = (
  //   id: number,
  //   updates: Partial<PurchaseOrderSummaryProducts>
  // ) => {
  //   setProducts((currentProducts) => {
  //     const updatedProducts = currentProducts.map((product) => {
  //       if (product.id === id) {
  //         const updatedProduct = { ...product, ...updates };
  //         // Asegurarse de que total_amount se actualiza correctamente
  //         updatedProduct.total_amount =
  //           parseFloat(updatedProduct.product_cost) *
  //           updatedProduct.quantity_purchased;
  //         return updatedProduct;
  //       }
  //       return product;
  //     });
  //     setUpdatedPOProducts(transformProductsUpdates(updatedProducts));
  //     return updatedProducts;
  //   });
  // };

  const updateProduct = (
    id: number,
    updates: Partial<PurchaseOrderSummaryProducts>
  ) => {
    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) => {
        if (product.id === id) {
          const updatedProduct = { ...product, ...updates };
          updatedProduct.total_amount =
            parseFloat(updatedProduct.product_cost) *
            updatedProduct.quantity_purchased;
          return updatedProduct;
        }
        return product;
      });

      // Encontrar el producto modificado
      const modifiedProduct = updatedProducts.find((p) => p.id === id);
      if (!modifiedProduct) return currentProducts; // Si no hay cambios, salir

      setUpdatedPOProducts((prevUpdated) => {
        // Verificar si el producto ya fue modificado antes
        const exists = prevUpdated.some(
          (p) =>
            p.purchaseOrderProductId ===
            modifiedProduct.purchase_order_product_id
        );

        if (exists) {
          // Si ya existe, actualizarlo en la lista
          return prevUpdated.map((p) =>
            p.purchaseOrderProductId ===
            modifiedProduct.purchase_order_product_id
              ? {
                  product_cost: modifiedProduct.product_cost,
                  profit: modifiedProduct.profit?.toString(),
                  purchaseOrderProductId:
                    modifiedProduct.purchase_order_product_id,
                  quantityPurchased: modifiedProduct.quantity_purchased,
                  unit_price: modifiedProduct.product_cost,
                }
              : p
          );
        } else {
          // Si no existe, agregarlo
          return [
            ...prevUpdated,
            {
              product_cost: modifiedProduct.product_cost,
              profit: modifiedProduct.profit?.toString(),
              purchaseOrderProductId: modifiedProduct.purchase_order_product_id,
              quantityPurchased: modifiedProduct.quantity_purchased,
              unit_price: modifiedProduct.product_cost,
            },
          ];
        }
      });

      return updatedProducts;
    });
  };

  const removeProduct = (id: number) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );

    setUpdatedPOProducts((prevUpdated) =>
      prevUpdated.filter((p) => p.purchaseOrderProductId !== id)
    );
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
        removeProduct,
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
