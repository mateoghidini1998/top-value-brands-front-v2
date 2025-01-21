import { formatDate } from "@/helpers/format-date";
import { ColumnDef } from "@tanstack/react-table";
// import { ActionsCell } from "./components";
import { Supplier } from "@/types/supplier.type";

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="w-full overflow-hidden text-ellipsis">
        # {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis text-center w-full">
        {formatDate(new Date(row.getValue("createdAt")).toString())}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis text-center w-full">
        {formatDate(new Date(row.getValue("updatedAt")).toString())}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const orderId: number = row.original.id;
      return (
        <div className="text-right">
          {/* <ActionsCell orderId={orderId} /> */}
          <p>{orderId}</p>
        </div>
      );
    },
  },
];
