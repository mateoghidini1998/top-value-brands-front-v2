"use client";
import { InventoryPagination } from "@/components/custom/data-table-pagination";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useState } from "react";
import { OrdersFilters } from "./components/features/filters.component";
import { OrdersTable } from "./components/features/orders-list.component";
import { useGetAllOrders } from "./hooks/use-purchase-order-service";

export interface SupplierItem {
  value: number;
  name: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const {
    ordersResponse,
    ordersIsLoading,
    ordersIsError,
    ordersErrorMessage,
    filterBySupplier,
    filterByStatus,
    filterByKeyword,
    orderBy,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useGetAllOrders({ page: 1, limit: 50 });

  if (ordersIsLoading) {
    return <LoadingSpinner />;
  }

  if (ordersIsError) {
    return <p>{ordersErrorMessage || "An error occurred"}</p>;
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

      <OrdersTable orders={ordersResponse?.data || []} onOrderBy={orderBy} />

      <InventoryPagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={ordersResponse?.total || 0}
        onPageChange={changePage}
        onLimitChange={changeLimit}
      />
    </>
  );
}
