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
import { useState } from "react";
import { DataTable } from "../../../components/custom/data-table";
import { useSuppliers } from "../suppliers/hooks/useSuppliers";
import { Supplier } from "../suppliers/interfaces/supplier.interface";
import { columns } from "./columns";
import { CreateProductForm } from "./components/create-product-form";
import { useInventory } from "./hooks/useInventory";

export default function Page() {
  const { inventoryQuery, filterBySupplier, filterByKeyword } = useInventory();
  const { suppliersQuery } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState("");

  if (inventoryQuery.isLoading || inventoryQuery.isFetching) {
    return <LoadingSpinner />;
  }
  if (!inventoryQuery.data || !suppliersQuery.data) {
    return <div>Error</div>;
  }

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
  const debouncedFilterByKeyword = debounce((value: string) => {
    filterByKeyword(value);
  }, 700);

  const handleFilterByKeyword = (value: string) => {
    setSearchTerm(value);
    debouncedFilterByKeyword(value);
  };
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
        dataLength={50}
      />
    </div>
  );
}
