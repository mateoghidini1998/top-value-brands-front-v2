import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import Link from "next/link";
import { DataTable } from "../../../warehouse/outgoing-shipments/create/_components/tables/data-table";
import { columns } from "../columns";
import { PurchaseOrderSummaryProducts } from "@/types";

interface OrderProductsTableProps {
  products: PurchaseOrderSummaryProducts[];
  orderId: string;
}

export default function OrderProductsTable({
  products,
  orderId,
}: OrderProductsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="flex flex-col items-start gap-4 justify-center w-fit space-y-0 pb-2">
          <Button>
            <Link href={`/purchase-orders/create?update=${orderId}`}>
              Add Products
            </Link>
          </Button>
        </div>
        <Truck className="w-4 h-4 text-muted-foreground ml-auto" />
      </CardHeader>
      <CardContent className="p-0">
        <DataTable columns={columns} data={products} pagination />
      </CardContent>
    </Card>
  );
}
