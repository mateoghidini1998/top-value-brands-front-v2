"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PurchaseOrderProvider } from "@/contexts/orders.context";
import { formatDate } from "@/helpers/format-date";
import {
  Check,
  Clock,
  DollarSign,
  Pencil,
  Store,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";
import SaveOrder from "./components/save-order-button";
import { useOrderSummaryMutations, useOrderSummaryQuery } from "./hooks";
import Link from "next/link";

export default function PurchaseOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data, isLoading, error } = useOrderSummaryQuery(params.orderId);

  const { updateOrderNotes, updateOrderNumber } = useOrderSummaryMutations(
    params.orderId
  );

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [isEditingOrderNumber, setIsEditingOrderNumber] = useState(false);
  const [editedOrderNumber, setEditedOrderNumber] = useState("");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading purchase order: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const {
    order_number,
    total_price,
    updatedAt,
    supplier_name,
    // updatedStatusAt,
    notes,
  } = data.data.order;
  const { purchaseOrderProducts } = data.data;

  // Notes handlers
  const handleEditNotes = () => {
    setEditedNotes(notes || "");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    updateOrderNotes({
      orderId: params.orderId,
      notes: editedNotes,
    });
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes("");
  };

  // Order Number handlers
  const handleEditOrderNumber = () => {
    setEditedOrderNumber(order_number || "");
    setIsEditingOrderNumber(true);
  };

  const handleSaveOrderNumber = () => {
    updateOrderNumber({
      orderId: params.orderId,
      order_number: editedOrderNumber,
    });
    setIsEditingOrderNumber(false);
  };

  const handleCancelOrderNumber = () => {
    setIsEditingOrderNumber(false);
    setEditedOrderNumber("");
  };

  return (
    <PurchaseOrderProvider initialProducts={purchaseOrderProducts}>
      <div className="py-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Purchase Order {order_number}
            </h1>
            <SaveOrder orderId={params.orderId} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Order Number Card */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Number
                </CardTitle>
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
                    <div className="text-2xl font-bold">{order_number}</div>
                    <p className="text-xs text-muted-foreground">
                      Purchase Order ID
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Total Price Card */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Amount
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Number(total_price).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total order value
                </p>
              </CardContent>
            </Card>

            {/* Supplier Card */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supplier</CardTitle>
                <Store className="w-4 h-4 text-muted-foreground ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {supplier_name}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supplier details
                </p>
              </CardContent>
            </Card>

            {/* Last Updated Card */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Updated
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(updatedAt.toString()) || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last modification date
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1">
            {/* Notes Card */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notes</CardTitle>
                {!isEditingNotes ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditNotes}
                    className="ml-auto"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                ) : (
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveNotes}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Enter notes here..."
                  />
                ) : (
                  <>
                    <div className="text-lg">
                      {notes || "No notes available"}
                    </div>
                    <p className="text-xs text-muted-foreground">Order notes</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products Table Card */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex flex-col items-start gap-4 justify-center w-fit space-y-0 pb-2">
              {/* <CardTitle>Products</CardTitle> */}
              {/*
               ** TODO: Style
               */}
              <Button className="">
                <Link href={`/purchase-orders/create?update=${params.orderId}`}>
                  Add Products
                </Link>
              </Button>
            </div>
            <Truck className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={columns} data={purchaseOrderProducts} />
          </CardContent>
        </Card>
      </div>
    </PurchaseOrderProvider>
  );
}
