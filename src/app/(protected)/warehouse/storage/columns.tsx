import { formatDate } from "@/helpers/format-date";
import { Pallet } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Pallet>[] = [
  {
    accessorKey: "pallet_number",
    header: "Pallet Number",
    cell: ({ row }) => {
      return <p># {row.original.pallet_number}</p>;
    },
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
    header: "Date",
    cell: ({ row }) => <p>{formatDate(row.original.updatedAt.toString())}</p>,
  },
  {
    id: "qr_code",
    header: "QR Code",
    cell: ({ row }) => (
      <div className="w-full overflow-hidden text-ellipsis">
        <p>missing {row.original.id}</p>
      </div>
    ),
  },

  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <p>missing {row.original.id}</p>
        </div>
      );
    },
  },
];
