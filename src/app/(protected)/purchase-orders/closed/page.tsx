"use client";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useState } from "react";
import { OrdersFilters } from "../../purchase-orders/components/features/filters.component";
import { useSuppliers } from "../../suppliers/hooks";
import { useGetAllIncomingOrders } from "../../warehouse/incoming-shipments/hooks/use-incoming-orders-service";
import { ClosedOrdersTable } from "./_components/feature/close-orders-list";

export interface SupplierItem {
  value: number;
  name: string;
}

const INCOMING_ORDER_STATUSES = [
  { name: "Cancelled", value: 4 },
  { name: "In transit", value: 5 },
  { name: "Arrived", value: 6 },
  { name: "Closed", value: 7 },
];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const {
    incomingOrdersResponse,
    incomingOrdersIsLoading,
    incomingOrdersIsError,
    filterBySupplier,
    filterByStatus,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useGetAllIncomingOrders({
    page: 1,
    limit: 50,
    status: "7",
  });

  const { suppliersQuery } = useSuppliers();

  if (incomingOrdersIsLoading || suppliersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (incomingOrdersIsError || suppliersQuery.isError) {
    return <p>{incomingOrdersIsError || "An error occurred"}</p>;
  }

  return (
    <>
      <OrdersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSupplier={selectedSupplier}
        onSearch={() => filterByKeyword(searchTerm)}
        onFilterBySupplier={(supplierId) => {
          setSelectedSupplier(supplierId);
          filterBySupplier(supplierId);
        }}
        selectedStatus={selectedStatus}
        onFilterByStatus={(statusId) => {
          setSelectedStatus(statusId);
          filterByStatus(statusId);
        }}
        possibleStatuses={INCOMING_ORDER_STATUSES}
        hasFilterByStatus={false}
      />

      <ClosedOrdersTable orders={incomingOrdersResponse?.data || []} />

      <DataTablePagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={incomingOrdersResponse?.total || 0}
        onPageChange={changePage}
        onLimitChange={changeLimit}
      />
    </>
  );
}
