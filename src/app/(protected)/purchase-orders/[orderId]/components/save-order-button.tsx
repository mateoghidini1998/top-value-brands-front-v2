"use client";

import { Button } from "@/components/ui/button";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import React from "react";
import { usePurchaseOrder } from "../hooks/usePurchaseOrder";
import LoadingSpinner from "@/components/custom/loading-spinner";

interface Props {
  orderId: string;
}

const SaveOrder = ({ orderId }: Props) => {
  const { updateOrderProducts, isLoading } = usePurchaseOrder(orderId);
  const { updatedPOProducts } = usePurchaseOrderContext();

  const handleUpdate = () => {
    updateOrderProducts({
      orderId: parseInt(orderId),
      purchaseOrderProductsUpdates: updatedPOProducts,
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <Button onClick={() => handleUpdate()}>Save</Button>;
};

export default SaveOrder;
