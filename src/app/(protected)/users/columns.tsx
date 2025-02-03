import { formatDate } from "@/helpers/format-date";
import { ColumnDef } from "@tanstack/react-table";
// import { ActionsCell } from "./components";
import { GetUsersData } from "@/types/auth.type";

export const columns: ColumnDef<GetUsersData>[] = [
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
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
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
    accessorKey: "lastSignInAt",
    header: "Last Sign In At",
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis text-center w-full">
        {formatDate(new Date(row.getValue("lastSignInAt")).toString())}
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
];
