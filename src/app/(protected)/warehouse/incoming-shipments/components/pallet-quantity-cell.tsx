"use client";

import { Input } from "@/components/ui/input";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useState } from "react";

interface PalletQuantityCellProps {
  row: PurchaseOrderSummaryProducts;
  onUpdatePalletQuantity: (productId: number, newQuantity: number) => void;
}

export const PalletQuantityCell = ({
  row,
  onUpdatePalletQuantity,
}: PalletQuantityCellProps) => {
  const [value, setValue] = useState<number>(row.pallet_quantity || 0);

  return (
    <Input
      type="number"
      min={1}
      max={row.quantity_available}
      value={value}
      onChange={(e) => {
        setValue(parseInt(e.target.value));
      }}
      onBlur={() => {
        onUpdatePalletQuantity(row.product_id, value);
        setValue(value);
      }}
      className="w-24 text-center"
    />
  );
};
