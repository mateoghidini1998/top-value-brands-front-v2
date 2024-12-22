"use client";
import { DataTable } from "@/components/custom/data-table";
import { useOrders } from "./hooks/useOrders";
import { columns } from "./columns";
import LoadingSpinner from "@/components/custom/loading-spinner";

export default function Page() {
  const { ordersQuery } = useOrders();

  if (ordersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!ordersQuery.data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <p>Purchase Orders</p>

      <DataTable
        data={ordersQuery.data.data}
        columns={columns}
        dataLength={10}
      />
    </div>
  );
}
