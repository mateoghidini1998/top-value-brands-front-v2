"use client";

import { Input } from "@/components/ui/input";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { FormatUSD } from "@/helpers";
import { useEffect, useState } from "react";

interface QuantityCellProps {
  value: number;
  productId: number;
  packType: number | null;
}

export default function QuantityCell({
  value,
  productId,
  packType,
}: QuantityCellProps) {
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
    <div className="flex flex-col justify-center items-start gap-1 max-w-[120px]">
      <Input
        type="number"
        value={quantity}
        onChange={handleChange}
        className="w-full"
        min="0"
      />

      <span className="w-fit text-green-500 font-semibold text-xs ml-1">
        {`${FormatUSD({
          number: (quantity * (packType ?? 1)).toString(),
          maxDigits: 0,
          minDigits: 0,
        })} - Pack (${packType ?? 1})`}
      </span>
    </div>
  );
}
