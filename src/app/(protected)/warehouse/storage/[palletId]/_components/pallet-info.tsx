import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/helpers/format-date";
import { GetPalletByIDResponse } from "@/types";

interface PalletInfoProps {
  pallet: GetPalletByIDResponse;
}

export function PalletInfo({ pallet }: PalletInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pallet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Pallet Number: </span>
              <span>{pallet.pallet_number}</span>
            </div>
            <div>
              <span className="font-medium">Location: </span>
              <span>{pallet.warehouseLocation.location}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Purchase Order: </span>
              <span>{pallet.purchaseOrder.order_number}</span>
            </div>
            <div>
              <span className="font-medium">Created: </span>
              <span>{formatDate(pallet.createdAt.toString())}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
