import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GetAllPalletProductsResponsePalletProduct } from "@/types";

interface QuantityInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  product: GetAllPalletProductsResponsePalletProduct | null;
  action: "add" | "remove";
}

export function QuantityInputDialog({
  isOpen,
  onClose,
  onConfirm,
  product,
  action,
}: QuantityInputDialogProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(action === "add" ? 1 : product.available_quantity || 0);
    }
  }, [product, action]);

  const handleConfirm = () => {
    onConfirm(quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "add" ? "Add" : "Remove"} Product
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">
            Enter quantity for: {product?.product.product_name}
          </p>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={
              action === "add"
                ? product?.available_quantity ?? 1
                : product?.quantity ?? 1
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
