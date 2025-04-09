import { useUpdateProductDGType } from "@/app/(protected)/warehouse/incoming-shipments/hooks/use-incoming-orders-service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DGItemCell = ({
  dgItem,
  productId,
}: {
  dgItem: string;
  productId: string;
}) => {
  const { updateProductDGTypeAsync } = useUpdateProductDGType();

  console.log(dgItem);
  return (
    <Select
      defaultValue={dgItem}
      onValueChange={(value) =>
        updateProductDGTypeAsync({
          dgType: value,
          productId: productId,
        })
      }
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select a DG Item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>DANGEROUS ITEMS</SelectLabel>
          <SelectItem value="--">--</SelectItem>
          <SelectItem value="STANDARD">STANDARD</SelectItem>
          <SelectItem value="FLAMMABLES">FLAMMABLES</SelectItem>
          <SelectItem value="AEROSOLS">AEROSOLS</SelectItem>
          <SelectItem value="OVERSIZED">OVERSIZED</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
