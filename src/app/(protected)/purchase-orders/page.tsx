"use client";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useState } from "react";
import { OrdersFilters } from "./components/features/filters.component";
import { OrdersTable } from "./components/features/orders-list.component";
import { useGetAllOrders } from "./hooks/use-purchase-order-service";
import { MergeOrdersProvider } from "@/contexts/merge-orders.context";

export interface SupplierItem {
  value: number;
  name: string;
}

const PURCHASE_ORDER_STATUSES = [
  { name: "Rejected", value: 1 },
  { name: "Pending", value: 2 },
  { name: "Good to go", value: 3 },
  { name: "Waiting for supplier approval", value: 8 },
];

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
    <MergeOrdersProvider>
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
        possibleStatuses={PURCHASE_ORDER_STATUSES}
      />

      <OrdersTable
        setSelectedSupplier={setSelectedSupplier}
        orders={ordersResponse?.data || []}
        onOrderBy={orderBy}
        filterBySupplier={filterBySupplier}
        ordersIsLoading={ordersIsLoading}
        supplierId={selectedSupplier || null}
      />

      <DataTablePagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={ordersResponse?.total || 0}
        onPageChange={changePage}
        onLimitChange={changeLimit}
      />
    </MergeOrdersProvider>
  );
}
