"use client";

import { Input } from "@/components/ui/input";
import { usePurchaseOrderContext } from "@/contexts/orders.context";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormatUSD } from "@/helpers";

interface ProductCostCellProps {
  value: number;
  productId: number;
  packType: number | null;
}

export default function ProductCostCell({
  value,
  productId,
  packType,
}: ProductCostCellProps) {
  const [productCost, setProductCost] = useState(value);
  const [showAlert, setShowAlert] = useState(false);
  const { updateProduct } = usePurchaseOrderContext();

  useEffect(() => {
    setProductCost(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value);
    setProductCost(newValue);
    checkDecimalPlaces(newValue);
    updateProduct(productId, {
      product_cost: newValue.toString(),
    });
  };

  const checkDecimalPlaces = (cost: number) => {
    if (packType === null || packType === 0) return;

    const result = cost / packType;
    const decimalPlaces = (result.toString().split(".")[1] || "").length;

    if (decimalPlaces > 2) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      updateProduct(productId, {
        product_cost: cost.toString(),
      });
    }
  };

  const roundToNearestValidValue = () => {
    if (packType === null || packType === 0) return;

    let roundedValue = Math.round(productCost * 100) / 100;
    while (
      (roundedValue / packType).toFixed(2) !==
      (roundedValue / packType).toString()
    ) {
      roundedValue = Math.round((roundedValue + 0.01) * 100) / 100;
    }

    setProductCost(roundedValue);
    setShowAlert(false);
    updateProduct(productId, {
      product_cost: roundedValue.toString(),
    });
  };

  return (
    <div className="flex flex-col justify-center items-start gap-1 max-w-[120px]">
      <Input
        type="number"
        value={productCost}
        onChange={handleChange}
        className="w-full"
        step="0.01"
        min="0"
      />

      {showAlert && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <span className="text-xs text-yellow-500">
            More than 2 decimal places
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={roundToNearestValidValue}
            className="text-xs py-0 h-6"
          >
            Round
          </Button>
        </div>
      )}

      <span className="w-fit text-yellow-400 text-xs ml-1">
        <span className="w-fit text-yellow-400 text-xs ml-1">
          {`${FormatUSD({
            number: (productCost / (packType ?? 1)).toString(),
            maxDigits: 20,
            minDigits: 2,
          })} - Pack (${packType ?? 1})`}
        </span>
      </span>
    </div>
  );
}
