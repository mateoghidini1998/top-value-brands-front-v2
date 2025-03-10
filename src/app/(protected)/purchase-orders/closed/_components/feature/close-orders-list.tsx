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
  styles: "absolute left-[550px] top-[-31.5px]",
  tableId: "closed-po-table",
};

export function ClosedOrdersTable({ orders }: ClosedOrdersTableProps) {
  return (
    <DataTable
      goToPath={"closed"}
      data={orders}
      columns={columns}
      dataLength={50}
      showHideColumns={showColumns}
    />
  );
}
