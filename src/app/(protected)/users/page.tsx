"use client";

import { DataTable } from "@/components/custom/data-table";
import { useClerkAuthQuery } from "./hooks/useClerkAuthQuery";
import { columns } from "./columns";

export default function Page() {
  const { getClerkUsers } = useClerkAuthQuery();

  return (
    <div>
      <h1>Users</h1>
      <DataTable
        data={getClerkUsers?.data?.data || []}
        columns={columns}
        dataLength={1000}
      />
    </div>
  );
}
