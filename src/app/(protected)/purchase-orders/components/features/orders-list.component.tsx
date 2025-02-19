import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { Order } from "@/types/purchase-orders";
import { getColumns } from "../../columns";
import { useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  onOrderBy: (orderBy: string) => void;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[820px] top-[-31.5px]",
};

export function OrdersTable({ orders, onOrderBy }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  console.log(selectedOrders);

  return (
    <DataTable
      data={orders}
      columns={getColumns(onOrderBy, setSelectedOrders)}
      dataLength={50}
      showHideColumns={showColumns}
    />
  );
}
