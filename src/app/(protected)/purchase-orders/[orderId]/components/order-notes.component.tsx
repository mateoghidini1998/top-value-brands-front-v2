"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useUpdateOrderNotes } from "../../hooks";
import { Order } from "@/types";

type OrderDetailsProps = {
  order: Order;
  orderId: string;
};

export default function OrderNotes({ order, orderId }: OrderDetailsProps) {
  const { updateOrderNotesAsync } = useUpdateOrderNotes();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(order.notes || "");

  const handleEditNotes = () => {
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    updateOrderNotesAsync({
      orderId,
      notes: editedNotes,
    });
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes(order.notes || "");
  };

  return (
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
            <Button variant="ghost" size="icon" onClick={handleSaveNotes}>
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
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
            <div className="text-lg">{order.notes || "No notes available"}</div>
            <p className="text-xs text-muted-foreground">Order notes</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
