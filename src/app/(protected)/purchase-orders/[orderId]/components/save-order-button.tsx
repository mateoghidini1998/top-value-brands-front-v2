"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { useUpdateOrderProducts } from "../../hooks";
import { toast } from "sonner";

interface Props {
  orderId: string;
}

const SaveOrder = ({ orderId }: Props) => {
  const { updateOrderProductsAsync, isUpdatingOrderProducts } =
    useUpdateOrderProducts();
  const { updatedPOProducts } = usePurchaseOrderContext();

  console.log(updatedPOProducts);

  const handleUpdate = () => {
    if (updatedPOProducts.length === 0) {
      return toast.error("No updates to save");
    }

    updateOrderProductsAsync({
      orderId: parseInt(orderId),
      purchaseOrderProductsUpdates: updatedPOProducts,
    });
  };

  if (isUpdatingOrderProducts) {
    return <LoadingSpinner />;
  }

  return <Button onClick={handleUpdate}>Save</Button>;
};

export default SaveOrder;
