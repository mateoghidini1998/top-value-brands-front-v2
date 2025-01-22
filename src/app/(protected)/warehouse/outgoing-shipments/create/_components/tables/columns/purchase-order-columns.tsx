// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { GetAllPalletProductsResponse } from "@/types";
// import { DataTableColumnHeader } from "./data-table-column-header";
// import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
// import { palletColumns } from "./pallet-columns";
// import { DataTable } from "../data-table";

// export const purchaseOrderColumns: ColumnDef<GetAllPalletProductsResponse>[] = [
//   {
//     id: "expander",
//     header: () => null,
//     cell: ({ row }) => {
//       return row.getCanExpand() ? (
//         <Button
//           variant="ghost"
//           onClick={row.getToggleExpandedHandler()}
//           className="p-0 h-6 w-6"
//         >
//           <ChevronDown
//             className={`h-4 w-4 transition-transform ${
//               row.getIsExpanded() ? "transform rotate-180" : ""
//             }`}
//           />
//         </Button>
//       ) : null;
//     },
//   },
//   {
//     accessorKey: "order_number",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Order Number" />
//     ),
//   },
//   {
//     accessorKey: "pallets",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Total Pallets" />
//     ),
//     cell: ({ row }) => {
//       return (
//         <div>
//           {row.original.pallets.length} Pallet(s)
//           <DataTable columns={palletColumns} data={row.original.pallets} />
//         </div>
//       );
//     },
//   },
// ];
