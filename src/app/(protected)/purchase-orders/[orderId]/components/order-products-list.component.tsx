import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
// import { DataTable } from "../../../warehouse/outgoing-shipments/create/_components/tables/data-table";
import { DataTable } from "@/components/custom/data-table";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useRecalculateProfits } from "../../hooks";
import { columns } from "../columns";

interface OrderProductsTableProps {
  products: PurchaseOrderSummaryProducts[];
  orderId: string;
}

export default function OrderProductsTable({
  products,
  orderId,
}: OrderProductsTableProps) {
  const { recalculateProfitsAsync, isRecalculatingProfits } =
    useRecalculateProfits();
  const amazonProducts = products.filter(
    (product) =>
      product.marketplace === "Amazon" || product.marketplace === "Unknown"
  );
  const walmartProducts = products.filter(
    (product) => product.marketplace === "Walmart"
  );

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => recalculateProfitsAsync({ orderId })}
        disabled={isRecalculatingProfits}
      >
        <RefreshCcw className="w-4 h-4 text-muted-foreground ml-auto" />{" "}
        Recalculate Profits
      </Button>
      {/* Amazon Products */}
      {amazonProducts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex flex-col items-start gap-4 justify-center w-fit space-y-0 pb-2">
              <h3 className="text-lg font-semibold">Amazon Products</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0 w-full">
            <DataTable
              columns={columns}
              data={amazonProducts}
              scrolleable
              dataLength={1000}
            />
          </CardContent>
        </Card>
      )}

      {/* Walmart Products */}
      {walmartProducts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex flex-col items-start gap-4 justify-center w-fit space-y-0 pb-2">
              <h3 className="text-lg font-semibold">Walmart Products</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0 w-full">
            <DataTable
              columns={columns}
              data={walmartProducts}
              scrolleable
              dataLength={1000}
            />
          </CardContent>
        </Card>
      )}

      {/* Add Products Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          <Link href={`/purchase-orders/create?update=${orderId}`}>
            Add Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
