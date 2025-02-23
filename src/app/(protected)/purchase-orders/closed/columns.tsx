import NotesCell from "@/components/custom/notes-cell";
import { StatusType } from "@/components/custom/status-badge";
import { StatusCell } from "@/components/custom/status-cell";
import { formatDate } from "@/helpers/format-date";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./_components/actions-cell";
import { Order } from "@/types/purchase-orders";

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
    cell: ({ row }) => (
      <div className="max-w-xs overflow-hidden text-ellipsis">
        {formatDate(row.getValue("updatedStatusAt"))}
      </div>
    ),
  },
  {
    accessorKey: "incoming_order_notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.original.incoming_order_notes || "";
      return (
        <div className="flex item-center justify-center">
          <NotesCell notes={notes} width={"400px"} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.purchaseOrderStatus;
      const description = status.description as StatusType; // type imported from status cell
      return (
        <StatusCell
          orderId={row.original.id.toString()}
          statusDescription={description}
          isWarehouse={true}
        />
      );
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const activeProducts = row.original.purchaseOrderProducts.filter(
        (product) => product.is_active
      );

      const missingProducts: boolean = activeProducts.some(
        (product) =>
          product.quantity_purchased > (product.quantity_received || 0)
      );

      return (
        <div className="text-right">
          <ActionsCell
            orderId={row.original.id}
            missingProducts={missingProducts}
          />
        </div>
      );
    },
  },
];
