import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/helpers/format-date";
import { PalletProductByID } from "@/types";

interface PalletProductCardProps {
  product: PalletProductByID;
}

export function PalletProductCard({ product }: PalletProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {product.purchaseOrderProduct.Product.product_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg">
            <Image
              src={
                product.purchaseOrderProduct.Product.product_image ||
                "/placeholder.svg"
              }
              alt={product.purchaseOrderProduct.Product.product_name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <span className="font-medium">SKU:</span>
              <span>{product.purchaseOrderProduct.Product.seller_sku}</span>
              <span className="font-medium">Quantity:</span>
              <span>{product.quantity}</span>
              <span className="font-medium">Available:</span>
              <span>{product.available_quantity}</span>
              <span className="font-medium">Last Updated:</span>
              <span>{formatDate(product.updatedAt.toString())}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
