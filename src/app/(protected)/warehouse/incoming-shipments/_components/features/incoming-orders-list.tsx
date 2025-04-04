import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { Order } from "@/types/purchase-orders";
import { columns } from "../../columns";
interface IncomingOrdersTableProps {
  orders: Order[];
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[820px] top-[-31.5px]",
  tableId: "incoming-order-id-table",
};

export function IncomingOrdersTable({ orders }: IncomingOrdersTableProps) {
  return (
    <DataTable
      goToPath={"incoming-shipments"}
      data={orders}
      columns={columns}
      dataLength={50}
      scrolleable
      showHideColumns={showColumns}
    />
  );
}
