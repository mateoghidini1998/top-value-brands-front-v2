import { Checkbox } from "@/components/ui/checkbox";
import { useToggleCheckAllShipmentProducts } from "../hooks/use-shipments-service";

export default function ToggleCheckAllShipmentProducts({
  shipmentId,
  palletId,
  isChecked,
  hide,
}: {
  shipmentId: number;
  palletId: number;
  isChecked: boolean;
  hide: boolean;
}) {
  const { toggleCheckAllShipmentProductsAsync } =
    useToggleCheckAllShipmentProducts(shipmentId, palletId);
  return (
    <Checkbox
      className={` ${hide && "hidden"}`}
      checked={isChecked}
      // @ts-expect-error @typescript-eslint/no-unsafe-member-access
      onClick={() => toggleCheckAllShipmentProductsAsync(shipmentId, palletId)}
    />
  );
}
