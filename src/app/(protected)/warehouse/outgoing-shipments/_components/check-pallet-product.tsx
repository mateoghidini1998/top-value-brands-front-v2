import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentPalletProduct } from "@/types/shipments/get.types";
import { useCheckShipmentProducts } from "../hooks/use-shipments-service";

interface CheckPalletProductsProps {
  row: ShipmentPalletProduct;
  shipmentId: number;
}

const CheckPalletProducts = ({ row, shipmentId }: CheckPalletProductsProps) => {
  const { checkShipmentProductAsync } = useCheckShipmentProducts(
    row.OutgoingShipmentProduct.id,
    shipmentId.toString()
  );

  const handleCheckProduct = async () => {
    await checkShipmentProductAsync(row.OutgoingShipmentProduct.id);
  };

  return (
    <>
      <Checkbox
        checked={row.OutgoingShipmentProduct.is_checked}
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
