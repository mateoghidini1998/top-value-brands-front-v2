"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  LocalStorageProduct,
  ProductInOrder,
} from "../interface/product-added.interface";

interface AddQuantityProps {
  productId: number;
  setProductsAdded: React.Dispatch<React.SetStateAction<ProductInOrder[]>>;
  productQuantity: number;
}

const AddQuantity = ({
  productId,
  setProductsAdded,
  productQuantity,
}: AddQuantityProps) => {
  const [quantityAdded, setQuantityAdded] = useState<number>(productQuantity);

  const handleAddQuantityToLocalStorage = () => {
    const productsAdded: LocalStorageProduct[] = JSON.parse(
      localStorage.getItem("productsAdded") ?? "[]"
    );

    const existingProductIndex = productsAdded.findIndex(
      (p: LocalStorageProduct) => p.product_id === productId
    );

    if (existingProductIndex !== -1) {
      // Actualizar cantidad si ya existe
      productsAdded[existingProductIndex].quantity = quantityAdded;
    } else {
      // Agregar nuevo producto si no existe
      productsAdded.push({
        product_id: productId,
        quantity: quantityAdded,
        cost: 0,
      });
    }

    localStorage.setItem("productsAdded", JSON.stringify(productsAdded));

    // Actualizar el estado de los productos agregados
    setProductsAdded((prev) => {
      return prev.map((p) => {
        const localProduct = productsAdded.find(
          (p: LocalStorageProduct) => p.product_id === productId
        );

        return p.product_id === productId
          ? { ...p, quantity: localProduct?.quantity ?? 0 }
          : p;
      });
    });
  };

  const handleBlur = () => {
    // Guardar la cantidad en localStorage al salir del campo de entrada
    handleAddQuantityToLocalStorage();
  };

  return (
    <Input
      type="number"
      placeholder="Quantity"
      className="w-full"
      value={quantityAdded}
      onChange={(e) => setQuantityAdded(Number(e.target.value))}
      onBlur={handleBlur} // Guardar valores cuando el usuario pierde el foco
      min={0}
    />
  );
};

export default AddQuantity;
