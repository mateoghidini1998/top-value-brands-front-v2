import { Checkbox } from "@/components/ui/checkbox";
import { useMergeOrdersContext } from "@/contexts/merge-orders.context";
import { Order } from "@/types/purchase-orders";
import { Row } from "@tanstack/react-table";
import React from "react";

interface CheckDataTableRowProps {
  row: Row<Order>;
  supplierId: number | null;
}

const CheckDataTableRow = ({
  row,
  supplierId,
}: // setSelectedOrders,
CheckDataTableRowProps) => {
  const { isMerging } = useMergeOrdersContext();
  const { isTheRowChecked, setOrders } = useMergeOrdersContext();

  const validateIfCanBeChecked = (): boolean => {
    if (supplierId && isMerging) return true;
    if (isMerging) return true;
    return false;
  };

  return (
    <Checkbox
      className={`${validateIfCanBeChecked() ? "cursor-pointer" : "hidden"}`}
      checked={isTheRowChecked(row.original.id)}
      onCheckedChange={(value) => {
        row.toggleSelected(!!value);
        // @ts-expect-error @typescript-eslint/no-unsafe-member-access
        setOrders((prev: { index: number; orderId: number }[]) => {
          const newOrders = prev.some(
            (order) => order.orderId === row.original.id
          )
            ? prev.filter((order) => order.orderId !== row.original.id)
            : [...prev, { index: row.index, orderId: row.original.id }];
          return newOrders;
        });
      }}
      aria-label="Select row"
    />
  );
};

export default CheckDataTableRow;
