import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { Order } from "@/types/purchase-orders";
import { getColumns } from "../../columns";
import { Dispatch, SetStateAction } from "react";

interface OrdersTableProps {
  orders: Order[];
  onOrderBy: (orderBy: string) => void;
  filterBySupplier: (supplierId: number) => void;
  ordersIsLoading: boolean;
  supplierId: number | null;
  setSelectedSupplier: Dispatch<SetStateAction<number | null>>;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[820px] top-[-31.5px]",
};

export function OrdersTable({
  orders,
  onOrderBy,
  filterBySupplier,
  ordersIsLoading,
  supplierId,
  setSelectedSupplier,
}: OrdersTableProps) {
  return (
    <DataTable
      goToPath={"purchase-orders"}
      data={orders}
      columns={getColumns(
        onOrderBy,
        filterBySupplier,
        ordersIsLoading,
        supplierId,
        setSelectedSupplier
      )}
      dataLength={50}
      showHideColumns={showColumns}
    />
  );
}
