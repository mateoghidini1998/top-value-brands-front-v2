"use client";

import { FilterSearch } from "@/components/custom/filter-search";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditProductProps, Product } from "@/types";
import { Supplier } from "@/types/supplier.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SupplierItem } from "../../purchase-orders/page";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { useUpdateProduct } from "../hooks/inventory-service.hook";
import { RefreshCw } from "lucide-react";

const editProductSchema = z.object({
  gtin: z.union([z.string(), z.null(), z.literal("")]),
  ASIN: z.union([z.string(), z.null(), z.literal("")]),
  seller_sku: z.union([z.string(), z.null(), z.literal("")]),
  product_cost: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable()
  ),
  supplier_id: z.number().nullable(),
  supplier_item_number: z.union([z.string(), z.null(), z.literal("")]),
  upc: z.union([z.string(), z.null(), z.literal("")]),
  pack_type: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable()
  ),
});

interface EditProductFormProps {
  product: Product;
  onSuccess: () => void;
}

const generateRandomSKU = (): string => {
  const randomNumbers = () =>
    `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      100 + Math.random() * 900
    )}`;

  return `TVB-${randomNumbers()}`;
  // return "TVB-352-952";
};

export function EditProductForm({ product, onSuccess }: EditProductFormProps) {
  const { updateAsync } = useUpdateProduct();
  const { suppliersQuery } = useSuppliers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(
    product.supplier_id
  );

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      gtin: product?.gtin,
      ASIN: product?.asin,
      seller_sku: product.seller_sku,
      product_cost: parseFloat(product.product_cost),
      supplier_id: product.supplier_id || null,
      supplier_item_number: product.supplier_item_number || "",
      upc: product.upc || "",
      pack_type: product.pack_type ? parseInt(product.pack_type) : 1,
    },
  });

  async function onSubmit(values: z.infer<typeof editProductSchema>) {
    setIsSubmitting(true);
    try {
      const editData: EditProductProps = {
        id: product.id,
        ...values,
      };
      console.log(editData);
      await updateAsync(editData);
      onSuccess();
    } catch (error) {
      console.error("Failed to edit product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!suppliersQuery.data) {
    return <div>Loading...</div>;
  }
  const formatSuppliers = (suppliers: Supplier[]): SupplierItem[] =>
    suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // form.handleSubmit(onSubmit)(e);
          // console.log("Form state:", form.getValues(), form.formState);
          onSubmit(form.getValues());
        }}
        className="space-y-8"
      >
        {product.gtin ? (
          <FormField
            control={form.control}
            name="gtin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GTIN</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="ASIN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ASIN</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="seller_sku"
          render={({ field }) => (
            <div className="relative">
              <FormItem>
                <FormLabel>Seller SKU</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <span className="absolute left-[70px] top-[1px] bg-transparent cursor-pointer">
                <RefreshCw
                  className="h-4 w-4 stroke-yellow-500"
                  onClick={() => field.onChange(generateRandomSKU())}
                />
              </span>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="product_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Cost</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplier_id"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-center gap-1">
              <FormLabel>Supplier ID</FormLabel>
              <FormControl className="">
                <FilterSearch
                  className="w-full"
                  items={formatSuppliers(suppliersQuery.data.data)}
                  value={selectedSupplier}
                  onValueChange={(supplier_id) => {
                    setSelectedSupplier(supplier_id as number);
                    field.onChange(supplier_id);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplier_item_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Item Number</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="upc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPC</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pack_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pack Type</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        {/* <Button type="submit">Save Changes</Button> */}
      </form>
    </Form>
  );
}
