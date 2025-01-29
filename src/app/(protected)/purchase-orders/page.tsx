"use client";
import { FilterSearch } from "@/components/custom/filter-search";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/types/supplier.type";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "../../../components/custom/data-table";
import { useSuppliers } from "../suppliers/hooks";
import { getColumns } from "./columns";
import { useOrders } from "./hooks/useOrders";

const PURCHASE_ORDER_STATUSES = [
  { name: "Rejected", value: 1 },
  { name: "Pending", value: 2 },
  { name: "Good to go", value: 3 },
  { name: "Cancelled", value: 4 },
  { name: "In transit", value: 5 },
  { name: "Arrived", value: 6 },
  { name: "Closed", value: 7 },
  { name: "Waiting for supplier approval", value: 8 },
];

type PaginationRange = number | "...";
export interface SupplierItem {
  value: number;
  name: string;
}

export default function Page() {
  const {
    ordersQuery,
    filterBySupplier,
    filterByStatus,
    orderBy,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useOrders();
  const { suppliersQuery } = useSuppliers();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  // Total pages calculation
  const totalPages = useMemo(() => {
    if (!ordersQuery.data) return 1; // Valor por defecto si no hay datos
    return Math.ceil(ordersQuery.data.total / itemsPerPage);
  }, [ordersQuery.data, itemsPerPage]);

  // Pagination range
  const paginationRange: PaginationRange[] = useMemo(() => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range: number[] = [];
    const rangeWithDots: PaginationRange[] = [];
    let lastNumber: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Primera página siempre
        i === totalPages || // Última página siempre
        (i >= currentPage - delta && i <= currentPage + delta) // Páginas cercanas a la actual
      ) {
        range.push(i);
      }
    }

    for (const page of range) {
      if (lastNumber !== null) {
        if (page - lastNumber === 2) {
          rangeWithDots.push(lastNumber + 1); // Página intermedia
        } else if (page - lastNumber > 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(page);
      lastNumber = page;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  const handleSearch = () => {
    filterByKeyword(searchTerm);
  };

  // Render condicional después de los hooks
  if (ordersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!ordersQuery.data || !suppliersQuery.data) {
    return <div>Error</div>;
  }

  const formatSuppliers = (suppliers: Supplier[]): SupplierItem[] =>
    suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));

  const handleFilterBySupplier = (supplier_id: number | null) => {
    filterBySupplier(supplier_id);
  };
  const handleFilterByStatus = (status_id: number | null) => {
    filterByStatus(status_id);
  };

  const handleOrderBy = (orderByCol: string) => {
    orderBy(orderByCol);
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="w-fit flex items-center justify-between gap-4">
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search product"
            className="w-[200px]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button type="submit" onClick={handleSearch}>
            {searchTerm !== "" ? "Search" : "Reset"}
          </Button>
          <FilterSearch
            items={formatSuppliers(suppliersQuery.data.data)}
            value={selectedSupplier}
            onValueChange={(supplier_id) => {
              setSelectedSupplier(supplier_id as number);
              handleFilterBySupplier(supplier_id as number);
            }}
          />
          <FilterSearch
            items={PURCHASE_ORDER_STATUSES}
            value={selectedStatus}
            placeholder="Select status..."
            onValueChange={(status_id) => {
              setSelectedStatus(status_id as number);
              handleFilterByStatus(status_id as number);
            }}
          />
        </div>
        <Button
          className="w-fit h-7 "
          onClick={() => {
            router.push("/purchase-orders/create");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <DataTable
        data={ordersQuery.data.data}
        columns={getColumns(handleOrderBy)}
        dataLength={ordersQuery.data.total}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              {currentPage > 1 ? (
                <PaginationPrevious
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                />
              ) : (
                <PaginationPrevious isActive={false} />
              )}
            </PaginationItem>
            {paginationRange.map((pageNumber, index) => (
              <PaginationItem key={index} className="cursor-pointer">
                {pageNumber === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => changePage(Number(pageNumber))}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() =>
                  changePage(Math.min(totalPages, currentPage + 1))
                }
                isActive={currentPage !== totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Select onValueChange={(value) => changeLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
