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
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getColumns } from "./columns";
import { useGetAllShipments } from "./hooks/use-shipments-service";

type PaginationRange = number | "...";
export interface SupplierItem {
  value: number;
  name: string;
}

interface ShipmentStatus {
  value: string;
  name: string;
}

const shipmentStatuses: ShipmentStatus[] = [
  { value: "DRAFT", name: "Draft" },
  { value: "WORKING", name: "Working" },
  { value: "IN_TRANSIT", name: "In Transit" },
  { value: "DELIVERED", name: "Delivered" },
  { value: "WORKING", name: "Working" },
  { value: "RECEIVING", name: "Receiving" },
  { value: "SHIPPED", name: "Shipped" },
  { value: "READY_TO_SHIP", name: "Ready to Ship" },
  { value: "CHECKED_IN", name: "Checked In" },
];

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[550px] top-[-31.5px]",
  tableId: "outgoing-shipments-table",
};

export default function Page() {
  const {
    shipmentsResponse,
    filterByStatus,
    filterByShipmentNumber,
    shipmentsIsLoading,
    shipmentsIsError,
    orderBy,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useGetAllShipments({
    page: 1,
    limit: 50,
  });
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Total pages calculation
  const totalPages = useMemo(() => {
    if (!shipmentsResponse) return 1;
    return Math.ceil(shipmentsResponse.total / itemsPerPage);
  }, [shipmentsResponse, itemsPerPage]);

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
    filterByShipmentNumber(searchTerm);
  };

  if (shipmentsIsLoading) {
    return <LoadingSpinner />;
  }

  if (shipmentsIsError) {
    return <div>Error</div>;
  }

  const handleFilterByStatus = (status: string) => {
    filterByStatus(status || "");
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
            placeholder="Search shipments"
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
            items={shipmentStatuses}
            value={selectedStatus}
            onValueChange={(status) => {
              setSelectedStatus(status?.toString() || "");
              handleFilterByStatus(status?.toString() || "");
            }}
            placeholder="Select status..."
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
        goToPath={"outgoing-shipments"}
        data={shipmentsResponse?.shipments || []}
        columns={getColumns(handleOrderBy)}
        dataLength={50}
        showHideColumns={showColumns}
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
