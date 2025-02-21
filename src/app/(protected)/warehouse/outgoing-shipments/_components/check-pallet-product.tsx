"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentPalletProduct } from "@/types/shipments/get.types";
import { useCheckShipmentProducts } from "../hooks/use-shipments-service";

interface CheckPalletProductsProps {
  row: ShipmentPalletProduct;
}

const CheckPalletProducts = ({ row }: CheckPalletProductsProps) => {
  const { checkShipmentProductAsync } = useCheckShipmentProducts(
    row.OutgoingShipmentProduct.id
  );

  const handleCheckProduct = () => {
    checkShipmentProductAsync(row.OutgoingShipmentProduct.id);
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
