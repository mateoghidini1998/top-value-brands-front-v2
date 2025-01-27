import { StatusCell } from "@/components/custom/status-cell";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/helpers/format-date";
import { Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./components";
import { StatusType } from "@/components/custom/status-badge";
import NotesCell from "@/components/custom/notes-cell";

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
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => (
      <div className="max-w-xs overflow-hidden text-ellipsis">
        {formatDate(new Date(row.getValue("updatedAt")).toString())}
      </div>
    ),
  },

  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "notes",
    header: () => <div className="">Notes</div>,
    cell: ({ row }) => {
      const notes = row.original.notes;
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
        />
      );
    },
  },
  {
    accessorKey: "average_roi",
    header: "ROI",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("average_roi")).toFixed(2);

      const getBadgeVariant = (amount: number) => {
        if (amount >= 2) {
          return "arrived";
        }

        if (amount <= 0) {
          return "cancelled";
        }

        return "secondary";
      };

      return (
        <Badge
          variant={getBadgeVariant(parseFloat(amount))}
          className={`cursor-pointer`}
        >
          {!isNaN(parseFloat(amount)) ? amount + "%" : "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const orderId: number = row.original.id;
      return (
        <div className="text-right">
          <ActionsCell orderId={orderId} />
        </div>
      );
    },
  },
];
