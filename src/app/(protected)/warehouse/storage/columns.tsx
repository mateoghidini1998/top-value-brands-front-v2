import { formatDate } from "@/helpers/format-date";
import { Pallet } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./_components/actions-cell";
import QrCodeCell from "./_components/qr-code-cell";
import { ArrowUpDown } from "lucide-react";

export const getColumns = (
  handleOrderBy: (col: string) => void
): ColumnDef<Pallet>[] => [
  {
    accessorKey: "pallet_number",
    header: "Pallet Number",
    cell: ({ row }) => {
      return <p>{row.original.pallet_number}</p>;
    },
  },
  {
    accessorKey: "storage_type",
    header: "Storage Type",
  },
  {
    accessorKey: "warehouse_location",
    header: "Warehouse Location",
  },
  {
    accessorKey: "purchase_order_number",
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
    cell: ({ row }) => <p>{formatDate(row.original.updatedAt.toString())}</p>,
  },
  {
    id: "qr_code",
    header: "QR Code",
    cell: ({ row }) => (
      <div
        className="w-full overflow-hidden text-ellipsis"
        onClick={(e) => e.stopPropagation()}
      >
        <QrCodeCell incomingOrder={row.original} />
      </div>
    ),
  },

  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div onClick={(e) => e.stopPropagation()} className="text-right">
          <ActionsCell palletId={row.original.id} />
        </div>
      );
    },
  },
];
