"use client";

import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { InventoryPagination } from "@/components/custom/data-table-pagination";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InventoryFilters } from "../../inventory/components/feature/filters.component";
import { useTrackedProducts } from "../../inventory/tracked-products/hooks/useTrackedProducts";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { DataTable as TrackedProductsTable } from "../../warehouse/outgoing-shipments/create/_components/tables/data-table";
import { useGetPurchaseOrderSummary } from "../hooks";
import { getAddedProductsColumns, getTrackedProductsColumns } from "./columns";
import CreateOrderSummary from "./components/create-order-summary";
import { ProductInOrder } from "./interface/product-added.interface";

export interface SupplierItem {
  value: number;
  name: string;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[550px] top-[-31.5px] z-[1000]",
};

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
  const { ordersSummaryResponse } = useGetPurchaseOrderSummary(
    orderId as string
  );

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
    ordersSummaryResponse?.data.order.supplier_id ?? null
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
      handleFilterBySupplier(
        ordersSummaryResponse?.data.order.supplier_id ?? null
      );

      addTransformedProducts(
        transoformProducts(
          ordersSummaryResponse?.data.purchaseOrderProducts ?? []
        ),
        setProductsAdded
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render condicional después de los hooks
  if (trackedProductsQuery.isLoading || suppliersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data || !suppliersQuery.data) {
    return <div>Error</div>;
  }

  if (trackedProductsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <section className="flex flex-col w-full">
      {/* 1. Filters and search */}
      <InventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSupplier={selectedSupplier}
        onSearch={() => filterByKeyword(searchTerm)}
        onFilterBySupplier={(supplierId) => {
          setSelectedSupplier(supplierId);
          filterBySupplier(supplierId);
        }}
      />

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
          dataLength={50}
          scrolleable={true}
          showHideColumns={showColumns}
        />

        {/* Pagination */}
        <InventoryPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={trackedProductsQuery.data?.total || 0}
          onPageChange={changePage}
          onLimitChange={changeLimit}
        />
      </div>

      {productsAdded.length > 0 && (
        <div className="mt-6">
          {/* 3. Added products table */}
          <div className="max-h-[400px] overflow-y-auto">
            <TrackedProductsTable
              data={productsAdded}
              columns={getAddedProductsColumns(setProductsAdded)}
            />
          </div>

          {/* 4. Create order summary */}
          <CreateOrderSummary
            productsAdded={productsAdded}
            setProductsAdded={setProductsAdded}
            orderNumber={
              ordersSummaryResponse?.data.order.order_number ||
              "The order number would be automatically generated"
            }
            notes={ordersSummaryResponse?.data.order.notes || ""}
            isEditing={!!orderId}
            orderId={orderId || ""}
          />
        </div>
      )}
    </section>
  );
}
