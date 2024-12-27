"use client";

import { usePurchaseOrderContext } from "../context/purchase-order.context";

interface TotalAmountCellProps {
  productId: number;
}

export default function TotalAmountCell({ productId }: TotalAmountCellProps) {
  const { products } = usePurchaseOrderContext();
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  const total = product.total_amount;

  return <span>${total.toFixed(2)}</span>;
}
