import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "./components/actions-cell";
import { Order } from "./interfaces/orders.interface";
import { formatDate } from "@/helpers/format-date";

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
    header: "Notes",
    cell: ({ row }) => (
      <div className="w-full overflow-hidden text-ellipsis">
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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("avg_roi")).toFixed(2);

      const getBadgeVariant = (amount: number) => {
        if (amount >= 2) {
          return "default";
        }

        if (amount <= 0) {
          return "destructive";
        }

        return "secondary";
      };

      return (
        <Badge
          variant={getBadgeVariant(parseFloat(amount))}
          className={`cursor-pointer`}
        >
          {amount}
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
