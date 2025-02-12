import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/helpers/format-date";
import { GetPalletByIDResponse, WarehouseLocation } from "@/types";
import {
  Calendar,
  Check,
  MapPin,
  Package2,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { useUpdatePalletLocation } from "../../hooks/use-pallets-service";
import { useWarehouseAvailableLocations } from "../../hooks/use-warehouse-locations-service";

interface PalletInfoProps {
  pallet: GetPalletByIDResponse;
}

export function PalletInfo({ pallet }: PalletInfoProps) {
  const { getWarehouseAvailableLocations } = useWarehouseAvailableLocations();
  const { updatePalletLocationAsync } = useUpdatePalletLocation(
    pallet.id.toString()
  );

  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [location, setLocation] = useState({
    location_id: pallet.warehouseLocation.id,
    location: pallet.warehouseLocation.location,
  });

  const handleEditLocation = () => {
    setIsEditingLocation(true);
  };

  const handleSaveLocation = () => {
    updatePalletLocationAsync({
      palletId: pallet.id,
      warehouseLocationId: location.location_id,
    });

    setIsEditingLocation(false);
  };

  const handleCancelLocation = () => {
    setIsEditingLocation(false);
    setLocation({
      location_id: pallet.warehouseLocation.id,
      location: pallet.warehouseLocation.location,
    });
  };

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
          {!isEditingLocation ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditLocation}
              className="ml-auto w-4 h-4"
            >
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </Button>
          ) : (
            <div className="flex ml-auto gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto w-4 h-4"
                onClick={handleSaveLocation}
              >
                <Check className="w-4 h-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelLocation}
                className="ml-auto w-4 h-4"
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingLocation ? (
            <Select
              onValueChange={(value) =>
                setLocation({ ...location, location_id: parseInt(value) })
              }
              value={location.location_id.toString()}
            >
              <SelectTrigger className="w-52 bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem className="w-full" key={0} value={"11"}>
                  <div className="w-full flex items-center justify-between">
                    <p>{"Floor"}</p>
                  </div>
                </SelectItem>
                {getWarehouseAvailableLocations.data?.data.map(
                  (location: WarehouseLocation) => {
                    return (
                      location.id !== 11 && (
                        <SelectItem
                          className="w-full"
                          key={location.id}
                          value={location.id.toString()}
                        >
                          <div className="w-full flex items-center justify-between">
                            <p>{location.location}</p>
                          </div>
                        </SelectItem>
                      )
                    );
                  }
                )}
              </SelectContent>
            </Select>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {pallet.warehouseLocation.location}
              </div>
              <p className="text-xs text-muted-foreground">Current location</p>
            </>
          )}
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
