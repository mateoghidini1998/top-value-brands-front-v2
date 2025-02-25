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

  // {
  //   accessorKey: "total_price",
  //   header: "Total Price",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("total_price"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="">{formatted}</div>;
  //   },
  // },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.original.incoming_order_notes;
      return (
        <div className="flex item-center justify-center">
          <NotesCell notes={notes || ""} width={"400px"} />
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
  // {
  //   accessorKey: "average_roi",
  //   header: "ROI",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("average_roi")).toFixed(2);

  //     const getBadgeVariant = (amount: number) => {
  //       if (amount >= 2) {
  //         return "arrived";
  //       }

  //       if (amount <= 0) {
  //         return "cancelled";
  //       }

  //       return "secondary";
  //     };

  //     return (
  //       <Badge
  //         variant={getBadgeVariant(parseFloat(amount))}
  //         className={`cursor-pointer`}
  //       >
  //         {!isNaN(parseFloat(amount)) ? amount + "%" : "N/A"}
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <ActionsCell orderId={row.original.id} />
        </div>
      );
    },
  },
];
