"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentPalletProduct } from "@/types";
import { useOutgoingShipmentsMutations } from "../[shipmentId]/hooks/useOutgoingShipmentsMutation";

interface CheckPalletProductsProps {
  row: ShipmentPalletProduct;
}

const CheckPalletProducts = ({ row }: CheckPalletProductsProps) => {
  const { checkShipmentProduct } = useOutgoingShipmentsMutations();

  const handleCheckProduct = () => {
    checkShipmentProduct({
      outgoingShipmentProductId: row.OutgoingShipmentProduct.id,
    });
  };

  return (
    <>
      <Checkbox
        checked={row.OutgoingShipmentProduct.is_checked}
        // onCheckedChange={handleCheckboxChange}
        onCheckedChange={handleCheckProduct}
        id={`checkbox-${row.id}`}
      />
      <label
        htmlFor={`checkbox-${row.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      ></label>
    </>
  );
};

export default CheckPalletProducts;
