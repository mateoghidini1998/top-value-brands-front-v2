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
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./columns";
import { Supplier } from "@/types/supplier.type";
import { useIncomingShipments } from "./hooks";
import { useSuppliers } from "../../suppliers/hooks";

type PaginationRange = number | "...";
export interface SupplierItem {
  value: number;
  name: string;
}

export default function Page() {
  const {
    ordersQuery,
    filterBySupplier,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useIncomingShipments();
  const { suppliersQuery } = useSuppliers();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<
    string | number | null
  >(null);

  // Total pages calculation
  const totalPages = useMemo(() => {
    if (!ordersQuery.data) return 1;
    return Math.ceil(ordersQuery.data.total / itemsPerPage);
  }, [ordersQuery.data, itemsPerPage]);

  // Pagination range
  const paginationRange: PaginationRange[] = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: PaginationRange[] = [];
    let lastNumber: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const page of range) {
      if (lastNumber !== null) {
        if (page - lastNumber === 2) {
          rangeWithDots.push(lastNumber + 1);
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
    const normalizedTerm = searchTerm.trim().toLowerCase();
    const encodedTerm = encodeURIComponent(normalizedTerm);
    filterByKeyword(encodedTerm);
  };

  if (ordersQuery.isLoading || suppliersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const formatSuppliers = (suppliers: Supplier[]): SupplierItem[] =>
    suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));

  const handleFilterBySupplier = (supplier_id: string | number | null) => {
    filterBySupplier(supplier_id);
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
            placeholder="Search Incoming Order"
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
            items={formatSuppliers(suppliersQuery.data?.data || [])}
            value={selectedSupplier}
            onValueChange={(supplier_id) => {
              setSelectedSupplier(supplier_id as number);
              handleFilterBySupplier(supplier_id as number);
            }}
          />
        </div>
        <Button
          className="w-fit h-7"
          onClick={() => {
            router.push("/warehouse/outgoing-shipments/create");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </div>

      <DataTable
        data={ordersQuery.data?.data || []}
        columns={columns}
        dataLength={ordersQuery.data?.total || 0}
      />

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
