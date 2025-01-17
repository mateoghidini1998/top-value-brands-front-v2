import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/helpers/format-date";
import { GetPalletByIDResponse } from "@/types";
import { Package2, MapPin, ShoppingCart, Calendar } from "lucide-react";

interface PalletInfoProps {
  pallet: GetPalletByIDResponse;
}

export function PalletInfo({ pallet }: PalletInfoProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Pallet Number Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pallet Number</CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pallet.pallet_number}</div>
          <p className="text-xs text-muted-foreground">Unique identifier</p>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Location</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pallet.warehouseLocation.location}
          </div>
          <p className="text-xs text-muted-foreground">Warehouse position</p>
        </CardContent>
      </Card>

      {/* Purchase Order Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Purchase Order</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pallet.purchaseOrder.order_number}
          </div>
          <p className="text-xs text-muted-foreground">Associated order</p>
        </CardContent>
      </Card>

      {/* Created Date Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Created</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDate(pallet.createdAt.toString())}
          </div>
          <p className="text-xs text-muted-foreground">Registration date</p>
        </CardContent>
      </Card>
    </div>
  );
}
