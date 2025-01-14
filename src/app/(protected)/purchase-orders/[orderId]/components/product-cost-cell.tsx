"use client";

import { Input } from "@/components/ui/input";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { useEffect, useState } from "react";

interface ProductCostCellProps {
  value: number;
  productId: number;
}

export default function ProductCostCell({
  value,
  productId,
}: ProductCostCellProps) {
  const [productCost, setProductCost] = useState(value);
  const { updateProduct } = usePurchaseOrderContext();

  useEffect(() => {
    setProductCost(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setProductCost(newValue);
    updateProduct(productId, {
      product_cost: newValue.toString(),
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
