import {
  DataTable,
  ShowHideColsumnsProps,
} from "@/components/custom/data-table";
import { getColumns, getWarehouseColumns } from "../../columns";
import type { Product } from "@/types/product.type";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@/types/auth.type";

interface InventoryTableProps {
  products: Product[];
  onOrderBy: (orderBy: string) => void;
}

const showColumns: ShowHideColsumnsProps = {
  show: true,
  styles: "absolute left-[550px] top-[-31.5px]",
  tableId: "inventory-table",
};

export function InventoryTable({ products, onOrderBy }: InventoryTableProps) {
  // get the user
  const { user } = useUser();

  if (!user) return;

  const customUser: UserResource = {
    publicMetadata: {
      role: user.publicMetadata.role as string,
      warehouse: user.publicMetadata.warehouse as string,
    },
    username: user.username as string | null,
    primaryEmailAddress: {
      emailAddress: user.primaryEmailAddress?.emailAddress as string | null,
    },
  };

  const isWarehouse = customUser?.publicMetadata.role === "warehouse";

  return (
    <DataTable
      data={products}
      columns={
        isWarehouse
          ? getWarehouseColumns({ handleOrderBy: onOrderBy })
          : getColumns({ handleOrderBy: onOrderBy })
      }
      dataLength={50}
      scrolleable
      showHideColumns={showColumns}
    />
  );
}
