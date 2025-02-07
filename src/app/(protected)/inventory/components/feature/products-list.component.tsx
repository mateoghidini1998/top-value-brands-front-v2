import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { getColumns } from "../../columns";
import type { Product } from "@/types/product.type";

interface InventoryTableProps {
  products: Product[];
  onOrderBy: (orderBy: string) => void;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[550px] top-[-31.5px]",
};

export function InventoryTable({ products, onOrderBy }: InventoryTableProps) {
  return (
    <DataTable
      data={products}
      columns={getColumns({ handleOrderBy: onOrderBy })}
      dataLength={50}
      scrolleable
      showHideColumns={showColumns}
    />
  );
}
