"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { usePurchaseOrder } from "../context/purchase-order.context";

interface QuantityCellProps {
  value: number;
  productId: number;
  productCost: string;
}

export default function QuantityCell({
  value,
  productId,
  productCost,
}: QuantityCellProps) {
  const [quantity, setQuantity] = useState(value);
  const { updateProduct } = usePurchaseOrder();

  useEffect(() => {
    setQuantity(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setQuantity(newValue);
    updateProduct(productId, {
      quantity_purchased: newValue,
      total_amount: newValue * parseFloat(productCost),
    });
  };

  return (
    <Input
      type="number"
      value={quantity}
      onChange={handleChange}
      className="w-24"
      min="0"
    />
  );
}
