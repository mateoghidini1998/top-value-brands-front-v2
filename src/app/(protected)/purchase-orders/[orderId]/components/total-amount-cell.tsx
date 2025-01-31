"use client";

import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { FormatUSD } from "@/helpers";

interface TotalAmountCellProps {
  productId: number;
}

export default function TotalAmountCell({ productId }: TotalAmountCellProps) {
  const { products } = usePurchaseOrderContext();
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  const total = FormatUSD({
    number: product.total_amount.toString() || "0",
    maxDigits: 2,
    minDigits: 2,
  });

  return <span>$ {total}</span>;
}
