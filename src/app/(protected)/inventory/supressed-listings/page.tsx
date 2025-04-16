"use client";

import { DataTable } from "../../warehouse/outgoing-shipments/create/_components/tables/data-table";
import { useGetSupressedListings } from "../hooks";
import { columns } from "./columns";

export default function SupressedListings() {
  const { supressedListings } = useGetSupressedListings();

  return (
    <>
      <DataTable data={supressedListings?.data || []} columns={columns} />
    </>
  );
}
