import { formatDate } from "@/helpers/format-date";
import { Shipment } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./_components/actions-cell";
// import ActionsCell from "./components/actions-cell";

export const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "shipment_number",
    header: "Shipment Number",
  },
  {
    accessorKey: "fba_shipment_id",
    header: "FBA Shipment ID",
  },

  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("updatedAt");
      return <div>{formatDate(date.toString())}</div>;
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="w-full text-right">
          <ActionsCell shipmentId={row.original.id} />
        </div>
      );
    },
  },
];
