"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { usePurchaseOrder } from "../context/purchase-order.context";

interface ProductCostCellProps {
  value: number;
  productId: number;
  productQuantity: number;
}

export default function ProductCostCell({
  value,
  productQuantity,
  productId,
}: ProductCostCellProps) {
  const [productCost, setProductCost] = useState(value);
  const { updateProduct } = usePurchaseOrder();

  useEffect(() => {
    setProductCost(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setProductCost(newValue);
    updateProduct(productId, {
      product_cost: newValue.toString(),
      total_amount: newValue * productQuantity,
    });
  };

  return (
    <Input
      type="number"
      value={productCost}
      onChange={handleChange}
      className="w-24"
      step="0.01"
      min="0"
    />
  );
}
