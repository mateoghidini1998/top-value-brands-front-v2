import { useSuppliers } from "@/app/(protected)/suppliers/hooks";
import { FilterSearch } from "@/components/custom/filter-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMergeOrdersContext } from "@/contexts/merge-orders.context";
import type { Supplier } from "@/types/supplier.type";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrdersFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSupplier: number | null;
  onSearch: () => void;
  onFilterBySupplier: (supplierId: number | null) => void;
  selectedStatus: number | null;
  onFilterByStatus: (statusId: number | null) => void;
  possibleStatuses: { name: string; value: number }[];
  hasFilterByStatus?: boolean;
}

export function OrdersFilters({
  searchTerm,
  setSearchTerm,
  selectedSupplier,
  onSearch,
  onFilterBySupplier,
  selectedStatus,
  onFilterByStatus,
  possibleStatuses,
  hasFilterByStatus = true,
}: OrdersFiltersProps) {
  const { suppliersQuery } = useSuppliers();
  const router = useRouter();
  const { isMerging, setIsMerging, orders, setOrders } =
    useMergeOrdersContext();

  const formatSuppliers = (suppliers: Supplier[] = []) =>
    suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));

  const handleMergePOs = () => {
    console.log("Merging POs", orders);
    setIsMerging(false);
    setOrders([]);
    onFilterBySupplier(null);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by order number..."
          className="w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trim())}
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
        {hasFilterByStatus && (
          <FilterSearch
            items={possibleStatuses}
            value={selectedStatus}
            placeholder="Select status..."
            onValueChange={(status_id) => {
              onFilterByStatus(status_id as number);
            }}
          />
        )}

        {isMerging && (
          <Button
            className="w-fit ml-[60px]"
            onClick={() => {
              setIsMerging(false);
              setOrders([]);
            }}
            variant={"destructive"}
          >
            Cancel
          </Button>
        )}

        {isMerging && orders.length > 0 && (
          <>
            <Button onClick={handleMergePOs}>
              Merge POs ({orders.length})
            </Button>
          </>
        )}
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
  );
}
