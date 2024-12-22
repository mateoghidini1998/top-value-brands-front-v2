import { ColumnDef } from "@tanstack/react-table";
import { Order } from "./actions/get-orders.action";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "supplier_name",
    header: "Supplier",
  },
  {
    accessorKey: "order_number",
    header: "Order Number",
  },
  {
    accessorKey: "updatedStatusAt",
    header: "Last Update",
  },

  {
    accessorKey: "total_price",
    header: "Total Price",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-xs overflow-hidden text-ellipsis">
        {row.getValue("notes")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "avg_roi",
    header: "avg roi",
  },
];
