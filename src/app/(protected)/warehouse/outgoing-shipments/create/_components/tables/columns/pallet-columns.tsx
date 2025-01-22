// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { GetAllPalletProductsResponsePallet } from "@/types";
// import { DataTableColumnHeader } from "./data-table-column-header";
// import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
// import { productColumns } from "./product-columns";
// import { DataTable } from "../data-table";

// export const palletColumns: ColumnDef<GetAllPalletProductsResponsePallet>[] = [
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
//     accessorKey: "pallet_number",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Pallet Number" />
//     ),
//   },
//   {
//     accessorKey: "warehouse_location",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Location" />
//     ),
//   },
//   {
//     accessorKey: "palletProducts",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Total Products" />
//     ),
//     cell: ({ row }) => (
//       <DataTable columns={productColumns} data={row.original.palletProducts} />
//     ),
//   },
// ];
