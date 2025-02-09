"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormatUSD } from "@/helpers";
import { formatDate } from "@/helpers/format-date";
import { Check, Clock, DollarSign, Pencil, Store, X } from "lucide-react";
import { useState } from "react";
import { useUpdateOrderNumber } from "../../hooks";
import SaveOrder from "./save-order-button";
import { Order } from "@/types";

interface OrderDetailsProps {
  order: Order;
  orderId: string;
}

export default function OrderDetails({ order, orderId }: OrderDetailsProps) {
  const { updateOrderNumberAsync } = useUpdateOrderNumber();
  const [isEditingOrderNumber, setIsEditingOrderNumber] = useState(false);
  const [editedOrderNumber, setEditedOrderNumber] = useState(
    order.order_number || ""
  );

  const handleEditOrderNumber = () => {
    setIsEditingOrderNumber(true);
  };

  const handleSaveOrderNumber = () => {
    updateOrderNumberAsync({
      orderId,
      order_number: editedOrderNumber,
    });
    setIsEditingOrderNumber(false);
  };

  const handleCancelOrderNumber = () => {
    setIsEditingOrderNumber(false);
    setEditedOrderNumber(order.order_number || "");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Purchase Order {order.order_number}
        </h1>
        <SaveOrder orderId={orderId} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Number</CardTitle>
            {!isEditingOrderNumber ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditOrderNumber}
                className="ml-auto"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
            ) : (
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveOrderNumber}
                >
                  <Check className="w-4 h-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelOrderNumber}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isEditingOrderNumber ? (
              <Input
                value={editedOrderNumber}
                onChange={(e) => setEditedOrderNumber(e.target.value)}
                className="font-bold text-2xl"
                placeholder="Enter order number..."
              />
            ) : (
              <>
                <div className="text-2xl font-bold">{order.order_number}</div>
                <p className="text-xs text-muted-foreground">
                  Purchase Order ID
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`$ ${FormatUSD({
                number: order.total_price.toString(),
                maxDigits: 2,
                minDigits: 2,
              })}`}
            </div>
            <p className="text-xs text-muted-foreground">Total order value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplier</CardTitle>
            <Store className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {order.supplier_name}
            </div>
            <p className="text-xs text-muted-foreground">Supplier details</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(order.updatedAt.toString()) || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Last modification date
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
