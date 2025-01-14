"use client";

import { Input } from "@/components/ui/input";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { useEffect, useState } from "react";

interface QuantityCellProps {
  value: number;
  productId: number;
}

export default function QuantityCell({ value, productId }: QuantityCellProps) {
  const [quantity, setQuantity] = useState(value);
  const { updateProduct } = usePurchaseOrderContext();

  useEffect(() => {
    setQuantity(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setQuantity(newValue);
    updateProduct(productId, {
      quantity_purchased: newValue,
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
