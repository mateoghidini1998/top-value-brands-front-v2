"use client";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useEffect, useState } from "react";
import { OrdersFilters } from "./components/features/filters.component";
import { OrdersTable } from "./components/features/orders-list.component";
import { useGetAllOrders } from "./hooks/use-purchase-order-service";
import { MergeOrdersProvider } from "@/contexts/merge-orders.context";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

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

const FILTER_STORAGE_KEY = "ordersFilters";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Recuperar filtros desde localStorage o URL
  const getStoredFilters = () => {
    if (typeof window !== "undefined") {
      const storedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
      return storedFilters ? JSON.parse(storedFilters) : {};
    }
    return {};
  };

  const storedFilters = getStoredFilters();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || storedFilters.searchTerm || ""
  );
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(
    searchParams.get("supplier")
      ? Number(searchParams.get("supplier"))
      : storedFilters.selectedSupplier || null
  );
  const [selectedStatus, setSelectedStatus] = useState<number | null>(
    searchParams.get("status")
      ? Number(searchParams.get("status"))
      : storedFilters.selectedStatus || null
  );

  // Aplicar debounce a los filtros
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const debouncedSupplier = useDebounce(selectedSupplier, 1000);
  const debouncedStatus = useDebounce(selectedStatus, 1000);

  // Obtener datos de la API con filtros iniciales
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
  } = useGetAllOrders({
    page: 1,
    limit: 50,
    keyword: searchParams.get("search") || storedFilters.searchTerm || "",
    supplier: searchParams.get("supplier") || storedFilters.selectedSupplier,
    status: searchParams.get("status") || storedFilters.selectedStatus,
  });

  // Guardar los filtros en localStorage
  useEffect(() => {
    const filters = {
      searchTerm: debouncedSearchTerm,
      selectedSupplier: debouncedSupplier,
      selectedStatus: debouncedStatus,
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [debouncedSearchTerm, debouncedSupplier, debouncedStatus]);

  // Actualizar la URL cuando los filtros cambian
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    if (debouncedSupplier) {
      params.set("supplier", debouncedSupplier.toString());
    } else {
      params.delete("supplier");
    }

    if (debouncedStatus) {
      params.set("status", debouncedStatus.toString());
    } else {
      params.delete("status");
    }

    router.push(`?${params.toString()}`);
  }, [debouncedSearchTerm, debouncedSupplier, debouncedStatus, router]);

  // Aplicar filtros cuando cambian los valores con debounce
  useEffect(() => {
    filterByKeyword(debouncedSearchTerm);
    filterBySupplier(debouncedSupplier);
    filterByStatus(debouncedStatus);
    // eslint-disable-next-line
  }, [debouncedSearchTerm, debouncedSupplier, debouncedStatus]);

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
