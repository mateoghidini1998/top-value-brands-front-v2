"use client";

import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
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
import { WarehouseLocation } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getColumns } from "./columns";
import { usePallets } from "./hooks";
import { useWarehouseLocations } from "./hooks/useWarehouseLocations";

type PaginationRange = number | "...";
export interface SupplierItem {
  value: number;
  name: string;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[550px] top-[-31.5px]",
};

export default function Page() {
  const {
    palletsQuery,
    filterByWarehouseLocation,
    filterByPalletNumber,
    orderBy,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = usePallets();

  const { warehouseLocationsQuery } = useWarehouseLocations(false);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );

  // Total pages calculation
  const totalPages = useMemo(() => {
    if (!palletsQuery.data) return 1; // Valor por defecto si no hay datos
    return Math.ceil(palletsQuery.data.total / itemsPerPage);
  }, [palletsQuery.data, itemsPerPage]);

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
    filterByPalletNumber(searchTerm);
  };

  if (palletsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!palletsQuery.data) {
    return <div>Error</div>;
  }

  const formatWarehouseLocations = (
    locations: WarehouseLocation[]
  ): SupplierItem[] =>
    locations.map((location) => ({
      name: location.location,
      value: location.id,
    }));

  const handleFilterByWarehouseLocation = (location_id: number | null) => {
    filterByWarehouseLocation(location_id);
  };

  const handleOrderBy = (columnId: string) => {
    orderBy(columnId);
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
            placeholder="Search pallet"
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
            items={
              warehouseLocationsQuery.data
                ? formatWarehouseLocations(warehouseLocationsQuery.data.data)
                : []
            }
            value={selectedLocationId}
            onValueChange={(location_id) => {
              setSelectedLocationId(location_id as number);
              handleFilterByWarehouseLocation(location_id as number);
            }}
            placeholder="Select location..."
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
        data={palletsQuery.data.data}
        columns={getColumns(handleOrderBy)}
        dataLength={palletsQuery.data.total}
        showHideColumns={showColumns}
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
