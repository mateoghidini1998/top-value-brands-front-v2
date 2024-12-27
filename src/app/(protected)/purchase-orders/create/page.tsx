"use client";

import { DataTable } from "@/components/custom/data-table";
import { FilterSuppliers } from "@/components/custom/filter-suppliers";
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
import { useMemo, useState } from "react";
import { useTrackedProducts } from "../../inventory/tracked-products/hooks/useTrackedProducts";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { Supplier } from "../../suppliers/interfaces/supplier.interface";
import { getAddedProductsColumns, getTrackedProductsColumns } from "./columns";
import CreateOrderSummary from "./components/create-order-summary";
import { ProductInOrder } from "./interface/product-added.interface";

type PaginationRange = number | "...";
export interface SupplierItem {
  value: number;
  name: string;
}

export default function Page() {
  const {
    trackedProductsQuery,
    filterBySupplier,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useTrackedProducts();

  const { suppliersQuery } = useSuppliers();

  const [productsAdded, setProductsAdded] = useState<ProductInOrder[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

  // Total pages calculation
  const totalPages = useMemo(() => {
    if (!trackedProductsQuery.data) return 1; // Valor por defecto si no hay datos
    return Math.ceil(trackedProductsQuery.data.total / itemsPerPage);
  }, [trackedProductsQuery.data, itemsPerPage]);

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
  if (trackedProductsQuery.isLoading || trackedProductsQuery.isFetching) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data || !suppliersQuery.data) {
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

  if (trackedProductsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <section className="flex flex-col gap-6 w-full">
      {/* 1. Search and filter */}
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
        <FilterSuppliers
          items={formatSuppliers(suppliersQuery.data.data)}
          value={selectedSupplier}
          onValueChange={(supplier_id) => {
            setSelectedSupplier(supplier_id);
            handleFilterBySupplier(supplier_id);
          }}
        />
      </div>

      {/* 2. Table and pagination */}
      <div className="max-h-[400px] overflow-y-auto">
        <DataTable
          data={trackedProductsQuery.data.data}
          columns={getTrackedProductsColumns(setProductsAdded)}
          dataLength={trackedProductsQuery.data.total}
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
      </div>

      {productsAdded.length > 0 && (
        <>
          {/* 3. Added products table */}
          <div className="max-h-[400px] overflow-y-auto">
            <DataTable
              data={productsAdded}
              columns={getAddedProductsColumns(setProductsAdded)}
              dataLength={10}
            />
          </div>

          {/* 4. Create order summary */}
          <CreateOrderSummary
            productsAdded={productsAdded}
            setProductsAdded={setProductsAdded}
          />
        </>
      )}
    </section>
  );
}
