import { formatDate } from "@/helpers/format-date";
import { Shipment } from "@/types/shipments/get.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import ActionsCell from "./_components/actions-cell";
import { PrintManifest } from "./_components/print-manifest";

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
    cell: ({ row }) => {
      const fba_shipment_id: string = row.getValue("fba_shipment_id");
      return <div>{fba_shipment_id || "--"}</div>;
    },
  },
  {
    accessorKey: "reference_id",
    header: "Reference ID",
    cell: ({ row }) => {
      const reference_id: string = row.getValue("reference_id");
      return <div>{reference_id || "--"}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isReadyToPick = row.original.readyToPick;

      return (
        <div className="flex flex-col gap-1">
          <span>{status}</span>
          {isReadyToPick && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Ready to Pick
            </span>
          )}
        </div>
      );
    },
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
    id: "Print",
    header: () => <div className="">Print</div>,
    cell: ({ row }) => {
      const canBePrinted = row.original.fba_shipment_id;
      return (
        <div
          className={canBePrinted ? "" : "hidden"}
          onClick={(e) => e.stopPropagation()}
        >
          <PrintManifest shipment={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="w-full text-right" onClick={(e) => e.stopPropagation()}>
          <ActionsCell shipmentId={row.original.id} />
        </div>
      );
    },
  },
];
