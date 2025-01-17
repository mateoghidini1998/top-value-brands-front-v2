"use client";
import { usePallets } from "../hooks";
import { PalletInfo } from "./_components/pallet-info";
import { PalletProductCard } from "./_components/pallet-product-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PalletDetailsPage({
  params,
}: {
  params: { palletId: string };
}) {
  const { palletByIdQuery } = usePallets(params.palletId);
  const { data: pallet, error } = palletByIdQuery;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the pallet details. Please try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!pallet) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pallet Details</h1>

      <PalletInfo pallet={pallet} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="grid gap-4">
          {pallet.PalletProducts.map((product) => (
            <PalletProductCard
              key={product.purchaseorderproduct_id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
