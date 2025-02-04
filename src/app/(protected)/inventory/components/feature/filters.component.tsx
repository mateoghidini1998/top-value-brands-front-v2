import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterSearch } from "@/components/custom/filter-search";
import { CreateEntityButton } from "@/components/custom/create-entity-button";
import type { Supplier } from "@/types/supplier.type";
import { useSuppliers } from "@/app/(protected)/suppliers/hooks";
import { CreateProductForm } from "../create-product-form";

interface InventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSupplier: number | null;
  onSearch: () => void;
  onFilterBySupplier: (supplierId: number | null) => void;
}

export function InventoryFilters({
  searchTerm,
  setSearchTerm,
  selectedSupplier,
  onSearch,
  onFilterBySupplier,
}: InventoryFiltersProps) {
  const { suppliersQuery } = useSuppliers();

  const formatSuppliers = (suppliers: Supplier[] = []) =>
    suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search product"
          className="w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <Button onClick={onSearch}>
          {searchTerm !== "" ? "Search" : "Reset"}
        </Button>
        <FilterSearch
          items={formatSuppliers(suppliersQuery.data?.data || [])}
          value={selectedSupplier}
          onValueChange={(supplierId) =>
            onFilterBySupplier(supplierId as number)
          }
        />
      </div>
      <CreateEntityButton
        title="Create Product"
        dialog_content={<CreateProductForm />}
        dialog_title="Create New Product"
      />
    </div>
  );
}
