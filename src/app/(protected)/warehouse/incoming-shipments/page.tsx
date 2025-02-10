"use client";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useState } from "react";
import { OrdersFilters } from "../../purchase-orders/components/features/filters.component";
import { useSuppliers } from "../../suppliers/hooks";
import { IncomingOrdersTable } from "./_components/features/incoming-orders-list";
import { useGetAllIncomingOrders } from "./hooks/use-incoming-orders-service";

export interface SupplierItem {
  value: number;
  name: string;
}
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
      />

      <IncomingOrdersTable orders={incomingOrdersResponse?.data || []} />

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
