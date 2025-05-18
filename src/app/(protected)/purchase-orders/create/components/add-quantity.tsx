"use client";

import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import {
  LocalStorageProduct,
  ProductInOrder,
} from "../interface/product-added.interface";

interface AddQuantityProps {
  productId: number;
  setProductsAdded: React.Dispatch<React.SetStateAction<ProductInOrder[]>>;
  productQuantity: number;
  packType: number | null;
}

const AddQuantity = ({
  productId,
  setProductsAdded,
  productQuantity,
  packType,
}: AddQuantityProps) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update products in state
    setProductsAdded((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );

    // Update localStorage
    const productsAdded: LocalStorageProduct[] = JSON.parse(
      localStorage.getItem("productsAdded") ?? "[]"
    );

    const existingProductIndex = productsAdded.findIndex(
      (p: LocalStorageProduct) => p.product_id === productId
    );

    if (existingProductIndex !== -1) {
      productsAdded[existingProductIndex].quantity = newQuantity;
    } else {
      productsAdded.push({
        product_id: productId,
        quantity: newQuantity,
        cost: 1,
      });
    }

    localStorage.setItem("productsAdded", JSON.stringify(productsAdded));
  };

  return (
    <div className="flex justify-between items-center gap-2 relative">
      <Input
        type="number"
        placeholder="Quantity"
        className="w-full"
        value={productQuantity || 1}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
        min={1}
      />
      {packType && packType > 1 && (
        <span className="w-fit font-semibold text-green-500 absolute right-10">
          {(productQuantity || 1) * packType}
        </span>
      )}
    </div>
  );
};

export default AddQuantity;
