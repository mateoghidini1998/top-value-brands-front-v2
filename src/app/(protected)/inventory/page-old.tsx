// "use client";

// import { useState } from "react";
// import { useGetAllProducts } from "./hooks/inventory-service.hook";
// import LoadingSpinner from "@/components/custom/loading-spinner";
// import { InventoryFilters } from "./components/feature/filters.component";
// import { InventoryTable } from "./components/feature/products-list.component";
// import { DataTablePagination } from "@/components/custom/data-table-pagination";

// export default function InventoryPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

//   const {
//     productResponse,
//     productIsLoading,
//     productIsError,
//     productErrorMessage,
//     filterBySupplier,
//     filterByKeyword,
//     orderBy,
//     changePage,
//     changeLimit,
//     currentPage,
//     itemsPerPage,
//   } = useGetAllProducts({ page: 1, limit: 50 });

//   if (productIsLoading) {
//     return <LoadingSpinner />;
//   }

//   if (productIsError) {
//     return <p>{productErrorMessage || "An error occurred"}</p>;
//   }

//   return (
//     <>
//       <InventoryFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedSupplier={selectedSupplier}
//         onSearch={() => filterByKeyword(searchTerm)}
//         onFilterBySupplier={(supplierId) => {
//           setSelectedSupplier(supplierId);
//           filterBySupplier(supplierId);
//         }}
//       />

//       <InventoryTable
//         products={productResponse?.data || []}
//         onOrderBy={orderBy}
//       />

//       <DataTablePagination
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//         totalItems={productResponse?.total || 0}
//         onPageChange={changePage}
//         onLimitChange={changeLimit}
//       />
//     </>
//   );
// }
