import { formatDateWithoutHours } from "@/helpers";
import { SupressedListing } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<SupressedListing>[] = [
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "ASIN",
    header: "ASIN",
  },
  {
    accessorKey: "seller_sku",
    header: "Seller SKU",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "issue_description",
    header: "Issue Description",
  },
  {
    accessorKey: "status_change_date",
    header: "Status Change Date",
    cell: ({ row }) => (
      <div>{formatDateWithoutHours(row.getValue("status_change_date"))}</div>
    ),
  },
];
