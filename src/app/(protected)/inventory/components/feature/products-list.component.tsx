import { DataTable } from "@/components/custom/data-table";
import { getColumns } from "../../columns";
import type { Product } from "@/types/product.type";

interface InventoryTableProps {
  products: Product[];
  onOrderBy: (orderBy: string) => void;
}

export function InventoryTable({ products, onOrderBy }: InventoryTableProps) {
  return (
    <DataTable
      data={products}
      columns={getColumns({ handleOrderBy: onOrderBy })}
      dataLength={50}
      scrolleable
    />
  );
}
