"use client";

import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import { FilterSearch } from "@/components/custom/filter-search";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WarehouseLocation } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getColumns } from "./columns";
import { useGetAllPallets } from "./hooks/use-pallets-service";
import { useWarehouseUnavailableLocations } from "./hooks/use-warehouse-locations-service";
export interface SupplierItem {
  value: number;
  name: string;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[550px] top-[-31.5px]",
  tableId: "pallets-table",
};

export default function Page() {
  const {
    palletsResponse,
    filterByLocation,
    palletsIsLoading,
    filterByPalletNumber,
    orderBy,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useGetAllPallets({
    page: 1,
    limit: 50,
  });

  const { getWarehouseUnavailableLocations } =
    useWarehouseUnavailableLocations();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const handleSearch = () => {
    filterByPalletNumber(searchTerm);
  };

  if (palletsIsLoading) {
    return <LoadingSpinner />;
  }

  if (!palletsResponse) {
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
    filterByLocation(location_id);
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
          <Button type="submit" onClick={handleSearch} variant={"outline"}>
            {searchTerm !== "" ? "Search" : "Reset"}
          </Button>
          <FilterSearch
            items={
              getWarehouseUnavailableLocations.data
                ? formatWarehouseLocations(
                    getWarehouseUnavailableLocations.data.data
                  )
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
          variant={"outline"}
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
        goToPath={"storage"}
        data={palletsResponse.data}
        columns={getColumns(handleOrderBy)}
        dataLength={palletsResponse.total}
        showHideColumns={showColumns}
      />

      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={palletsResponse.total}
        onPageChange={changePage}
        onLimitChange={changeLimit}
      />
    </>
  );
}
