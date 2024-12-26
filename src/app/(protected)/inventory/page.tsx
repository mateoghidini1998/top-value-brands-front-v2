"use client";
import { FilterSuppliers } from "@/components/custom/filter-suppliers";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "../../../components/custom/data-table";
import { useSuppliers } from "../suppliers/hooks/useSuppliers";
import { Supplier } from "../suppliers/interfaces/supplier.interface";
import { columns } from "./columns";
import { CreateProductForm } from "./components/create-product-form";
import { useInventory } from "./hooks/useInventory";
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

export default function Page() {
  const {
    inventoryQuery,
    filterBySupplier,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useInventory();
  const { suppliersQuery } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Format suppliers for dropdown
   */
  const formatSuppliers = (suppliers: Supplier[]) => {
    return suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));
  };

  const handleFilterBySupplier = (supplier_id: number | null) => {
    filterBySupplier(supplier_id);
  };

  // Debounce the filterByKeyword function to avoid too many API calls
  const debouncedFilterByKeyword = useCallback(
    debounce((value: string) => {
      filterByKeyword(value);
    }, 600),
    []
  );
  const handleFilterByKeyword = (value: string) => {
    setSearchTerm(value);
    debouncedFilterByKeyword(value);
  };

  const totalPages = Math.ceil(inventoryQuery.data?.total / itemsPerPage);

  const paginationRange = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of the current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (inventoryQuery.isLoading || inventoryQuery.isFetching) {
    return <LoadingSpinner />;
  }
  if (!inventoryQuery.data || !suppliersQuery.data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <div className="w-fit flex items-center justify-between gap-4">
          <Input
            placeholder="Search product"
            className="w-[200px]"
            value={searchTerm}
            onChange={(e) => handleFilterByKeyword(e.target.value)}
          />
          {/* Dropdown to filter all product by supplier */}
          <FilterSuppliers
            items={formatSuppliers(suppliersQuery.data.data)}
            onValueChange={(supplier_id: number | null) =>
              handleFilterBySupplier(supplier_id)
            }
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-fit h-7 ">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <CreateProductForm />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={inventoryQuery.data.data}
        columns={columns}
        dataLength={inventoryQuery.data.total}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 ? (
                <PaginationPrevious
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                />
              ) : (
                <PaginationPrevious isActive={false} />
              )}
            </PaginationItem>
            {paginationRange.map((pageNumber, index) => (
              <PaginationItem key={index}>
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
            <PaginationItem>
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
  );
}
