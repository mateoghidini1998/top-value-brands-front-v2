"use client";

import { Input } from "@/components/ui/input";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { FormatUSD } from "@/helpers";
import { useEffect, useState } from "react";

interface ProductCostCellProps {
  value: number;
  productId: number;
  packType: number | null;
}

export default function ProductCostCell({
  value,
  productId,
  packType,
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
    <div className="flex flex-col justify-center items-start gap-1 max-w-[120px]">
      <Input
        type="number"
        value={productCost}
        onChange={handleChange}
        className="w-full"
        step="0.01"
        min="0"
      />

      <span className="w-fit text-yellow-400 text-xs ml-1">
        {`$ ${FormatUSD({
          number: (productCost * (packType ?? 1)).toString(),
          maxDigits: 2,
          minDigits: 2,
        })} - Pack (${packType ?? 1})`}
      </span>
    </div>
  );
}
