"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  LocalStorageProduct,
  ProductInOrder,
} from "../interface/product-added.interface";

interface AddProductCostProps {
  productId: number;
  setProductsAdded: React.Dispatch<React.SetStateAction<ProductInOrder[]>>;
  productCost: number;
}

const AddProductCost = ({
  productId,
  setProductsAdded,
  productCost,
}: AddProductCostProps) => {
  const [costAdded, setCostAdded] = useState<number>(productCost);

  const handleAddCostToLocalStorage = () => {
    const productsAdded: LocalStorageProduct[] = JSON.parse(
      localStorage.getItem("productsAdded") ?? "[]"
    );

    const existingProductIndex = productsAdded.findIndex(
      (p: LocalStorageProduct) => p.product_id === productId
    );

    if (existingProductIndex !== -1) {
      // Actualizar costo si ya existe
      productsAdded[existingProductIndex].cost = costAdded;
    } else {
      // Agregar nuevo producto si no existe
      productsAdded.push({
        product_id: productId,
        quantity: 1,
        cost: costAdded,
      });
    }

    localStorage.setItem("productsAdded", JSON.stringify(productsAdded));

    // Actualizar el estado de los productos agregados
    setProductsAdded((prev): ProductInOrder[] => {
      return prev.map((p) => {
        const localProduct = productsAdded.find(
          (lp: LocalStorageProduct) => lp.product_id === productId
        );

        return p.product_id === productId
          ? { ...p, product_cost: localProduct?.cost ?? 0 }
          : p;
      });
    });
  };

  const handleBlur = () => {
    // Guardar el costo en localStorage al salir del campo de entrada
    handleAddCostToLocalStorage();
  };

  return (
    <Input
      type="number"
      placeholder="Cost"
      className="w-full"
      value={costAdded}
      onChange={(e) => setCostAdded(Number(e.target.value))}
      onBlur={handleBlur} // Guardar valores cuando el usuario pierde el foco
      min={0}
    />
  );
};

export default AddProductCost;
