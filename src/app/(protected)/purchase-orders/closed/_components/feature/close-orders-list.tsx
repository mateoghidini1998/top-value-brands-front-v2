import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { Order } from "@/types/purchase-orders";
import { columns } from "../../columns";
interface ClosedOrdersTableProps {
  orders: Order[];
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[820px] top-[-31.5px]",
};

export function ClosedOrdersTable({ orders }: ClosedOrdersTableProps) {
  return (
    <DataTable
      data={orders}
      columns={columns}
      dataLength={50}
      showHideColumns={showColumns}
    />
  );
}
