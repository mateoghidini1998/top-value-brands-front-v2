"use client";

import { DataTable } from "@/components/custom/data-table";
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
import { PurchaseOrderSummaryProducts } from "@/types";
import { Supplier } from "@/types/supplier.type";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTrackedProducts } from "../../inventory/tracked-products/hooks/useTrackedProducts";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { useOrderSummaryQuery } from "../[orderId]/hooks";
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
    orderBy,
    changePage,
    changeLimit,
    currentPage,
    itemsPerPage,
  } = useTrackedProducts();

  const { suppliersQuery } = useSuppliers();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("update");
  const { data } = useOrderSummaryQuery(orderId as string);

  const transoformProducts = (data: PurchaseOrderSummaryProducts[]) => {
    return data.map((product) => ({
      id: product.id,
      product_id: product.product_id,
      supplier_id: product.supplier_id,
      pack_type: product.pack_type,
      product_name: product.product_name,
      product_image: product.product_image,
      ASIN: product.ASIN,
      supplier_name: product.supplier_name,
      quantity: product.quantity_purchased,
      product_cost: parseFloat(product.product_cost),
      total_amount: product.total_amount,
      units_sold: product.units_sold,
      fees: product.fees ?? 0,
      lowest_fba_price: product.lowest_fba_price,
      in_seller_account: product.in_seller_account,
    }));
  };

  const addTransformedProducts = (
    transformedProducts: ProductInOrder[],
    setData: React.Dispatch<React.SetStateAction<ProductInOrder[]>>
  ) => {
    setData((prev: ProductInOrder[]) => {
      if (prev.length > 0) {
        const supplierId = prev[0].supplier_id;
        const hasDifferentSupplier = transformedProducts.some(
          (product) => product.supplier_id !== supplierId
        );

        if (hasDifferentSupplier) {
          toast.error("Products must have the same supplier");
          return prev;
        }
      }

      const newProducts = transformedProducts.filter(
        (product) => !productsAdded.some((p) => p.id === product.id)
      );

      const updatedLocalStorage = [
        ...newProducts.map((product) => ({
          product_id: product.product_id,
          quantity: product.quantity || 1,
          cost: product.product_cost,
        })),
      ];

      localStorage.setItem(
        "productsAdded",
        JSON.stringify(updatedLocalStorage)
      );
      toast.success("Products added successfully");

      return [...newProducts];
    });
  };

  const [productsAdded, setProductsAdded] = useState<ProductInOrder[]>(
    transoformProducts([])
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(
    data?.data.order.supplier_id ?? null
  );

  const handleFilterBySupplier = (supplier_id: number | null) => {
    filterBySupplier(supplier_id);
  };

  const handleOrderBy = (orderByCol: string) => {
    orderBy(orderByCol);
  };

  useEffect(() => {
    if (orderId) {
      // add the data.data.purchaseOrderProducts to the productsAdded state
      handleFilterBySupplier(data?.data.order.supplier_id ?? null);

      addTransformedProducts(
        transoformProducts(data?.data.purchaseOrderProducts ?? []),
        setProductsAdded
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (trackedProductsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data) {
    return <div>Error</div>;
  }

  console.log(productsAdded);

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
        <FilterSearch
          items={formatSuppliers(suppliersQuery.data.data)}
          value={selectedSupplier}
          onValueChange={(supplier_id) => {
            setSelectedSupplier(supplier_id as number);
            handleFilterBySupplier(supplier_id as number);
          }}
        />
      </div>

      {/* 2. Table and pagination */}
      <div
        className={`${
          productsAdded.length <= 0
            ? ""
            : "max-h-[400px] overflow-y-auto transition-all duration-300"
        }`}
      >
        <DataTable
          data={trackedProductsQuery.data.data}
          columns={getTrackedProductsColumns(setProductsAdded, handleOrderBy)}
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
            orderNumber={
              data?.data.order.order_number ||
              "The order number would be automatically generated"
            }
            notes={data?.data.order.notes || ""}
            isEditing={!!orderId}
            orderId={orderId || ""}
          />
        </>
      )}
    </section>
  );
}
