import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { Order } from "@/types/purchase-orders";
import { getColumns } from "../../columns";

interface OrdersTableProps {
  orders: Order[];
  onOrderBy: (orderBy: string) => void;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[820px] top-[-31.5px]",
};

export function OrdersTable({ orders, onOrderBy }: OrdersTableProps) {
  return (
    <DataTable
      data={orders}
      columns={getColumns(onOrderBy)}
      dataLength={50}
      showHideColumns={showColumns}
    />
  );
}
