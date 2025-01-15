"use client";

import { Button } from "@/components/ui/button";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import React from "react";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useOrderSummaryMutations, useOrderSummaryQuery } from "../hooks";

interface Props {
  orderId: string;
}

const SaveOrder = ({ orderId }: Props) => {
  const { isLoading } = useOrderSummaryQuery(orderId);
  const { updateOrderProducts } = useOrderSummaryMutations(orderId);
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
