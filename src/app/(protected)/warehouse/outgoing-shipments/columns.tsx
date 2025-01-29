import { formatDate } from "@/helpers/format-date";
import { Shipment } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./_components/actions-cell";
import { ArrowUpDown } from "lucide-react";
// import ActionsCell from "./components/actions-cell";

export const getColumns = (
  handleOrderBy: (col: string) => void
): ColumnDef<Shipment>[] => [
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
    header: () => (
      <div
        className="text-right flex items-center cursor-pointer justify-center gap-2"
        onClick={() => handleOrderBy("updatedAt")}
      >
        <ArrowUpDown className="mr-2 w-4 h-4 " /> Last Update
      </div>
    ),
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
