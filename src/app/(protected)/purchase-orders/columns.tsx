import NotesCell from "@/components/custom/notes-cell";
import { StatusType } from "@/components/custom/status-badge";
import { StatusCell } from "@/components/custom/status-cell";
import { Badge } from "@/components/ui/badge";
import { FormatUSD } from "@/helpers";
import { formatDate } from "@/helpers/format-date";
import { Order } from "@/types/purchase-orders";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ActionsCell } from "./components";
import CheckDataTableRow from "./components/features/check-data-table-row.component";

export const getColumns = (
  handleOrderBy: (key: string) => void
): ColumnDef<Order>[] => [
  {
    id: "select",
    cell: ({ row }) => {
      return <CheckDataTableRow row={row} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
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
    header: () => (
      <div
        className="text-right flex items-center cursor-pointer justify-center gap-2"
        onClick={() => handleOrderBy("updatedAt")}
      >
        <ArrowUpDown className="mr-2 w-4 h-4 " /> Last Update
      </div>
    ),

    cell: ({ row }) => (
      <div className="max-w-xs overflow-hidden text-ellipsis">
        {formatDate(new Date(row.getValue("updatedAt")).toString())}
      </div>
    ),
  },

  {
    accessorKey: "total_price",
    header: () => (
      <div
        className="text-right flex items-center cursor-pointer justify-center gap-2"
        onClick={() => handleOrderBy("total_price")}
      >
        <ArrowUpDown className="mr-2 w-4 h-4 " /> Total Price
      </div>
    ),
    cell: ({ row }) => (
      <span>
        {`$ ${FormatUSD({
          number: row.original.total_price.toString(),
          maxDigits: 2,
          minDigits: 2,
        })}`}
      </span>
    ),
  },
  {
    accessorKey: "notes",
    header: () => <div className="">Notes</div>,
    cell: ({ row }) => {
      const notes = row.original.notes;
      return (
        <div className="flex item-center justify-center max-h-[100px]">
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
