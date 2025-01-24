"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentPalletProduct } from "@/types";
import React, { useEffect, useState } from "react";

interface CheckPalletProductsProps {
  row: ShipmentPalletProduct;
}

const CheckPalletProducts = ({ row }: CheckPalletProductsProps) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Cargar el estado inicial desde localStorage
    const storedProducts: ShipmentPalletProduct[] = JSON.parse(
      localStorage.getItem("selectedProducts") || "[]"
    );
    const exists = storedProducts.some((p) => p.id === row.id);
    if (exists) {
      setIsChecked(true);
    }
  }, [row.id]);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => {
      const newChecked = !prev;
      updateLocalStorage(newChecked);
      return newChecked;
    });
  };

  const updateLocalStorage = (add: boolean) => {
    let storedProducts: ShipmentPalletProduct[] = JSON.parse(
      localStorage.getItem("selectedProducts") || "[]"
    );

    if (add) {
      // Agregar el producto si no está en la lista
      if (!storedProducts.some((p) => p.id === row.id)) {
        storedProducts.push(row);
      }
    } else {
      // Eliminar el producto de la lista
      storedProducts = storedProducts.filter((p) => p.id !== row.id);
    }

    localStorage.setItem("selectedProducts", JSON.stringify(storedProducts));
  };

  return (
    <>
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
        id={`checkbox-${row.id}`}
      />
      <label
        htmlFor={`checkbox-${row.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      ></label>
    </>
  );
};

export default CheckPalletProducts;
