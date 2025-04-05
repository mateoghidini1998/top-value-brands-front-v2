import { Checkbox } from "@/components/ui/checkbox";
import { useToggleCheckAllShipmentProducts } from "../hooks/use-shipments-service";

export default function ToggleCheckAllShipmentProducts({
  shipmentId,
  palletId,
  isChecked,
}: {
  shipmentId: number;
  palletId: number;
  isChecked: boolean;
}) {
  const { toggleCheckAllShipmentProductsAsync } =
    useToggleCheckAllShipmentProducts(shipmentId, palletId);
  return (
    <Checkbox
      checked={isChecked}
      // @ts-expect-error @typescript-eslint/no-unsafe-member-access
      onClick={() => toggleCheckAllShipmentProductsAsync(shipmentId, palletId)}
    />
  );
}
