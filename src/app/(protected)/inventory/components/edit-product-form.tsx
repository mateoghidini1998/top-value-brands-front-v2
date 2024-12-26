"use client";

import { FilterSuppliers } from "@/components/custom/filter-suppliers";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { Supplier } from "../../suppliers/interfaces/supplier.interface";
import { EditProductProps } from "../actions/edit-product.action";
import { useInventory } from "../hooks/useInventory";
import { Product } from "../interfaces/product.interface";
import { SupplierItem } from "../page";

const editProductSchema = z.object({
  ASIN: z.string().min(1, "ASIN is required"),
  seller_sku: z.string().nullable(),
  product_cost: z.number().nullable(),
  supplier_id: z.number().nullable(),
  supplier_item_number: z.number().nullable(),
  upc: z.string().nullable(),
  pack_type: z.number().nullable(),
});

interface EditProductFormProps {
  product: Product;
  onSuccess: () => void;
}

export function EditProductForm({ product, onSuccess }: EditProductFormProps) {
  const { editProductMutation } = useInventory();
  const { suppliersQuery } = useSuppliers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      ASIN: product.ASIN,
      seller_sku: product.seller_sku || "",
      product_cost: parseFloat(product.product_cost),
      supplier_id: product.supplier_id || null,
      supplier_item_number: product.supplier_item_number
        ? parseInt(product.supplier_item_number)
        : null,
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
      await editProductMutation.mutateAsync(editData);
      onSuccess();
      toast.success("Product edited successfully");
    } catch (error) {
      console.error("Failed to edit product:", error);
      toast.error("Failed to edit product");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="seller_sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seller SKU</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
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
                <FilterSuppliers
                  className="w-full"
                  items={formatSuppliers(suppliersQuery.data.data)}
                  value={selectedSupplier}
                  onValueChange={(supplier_id) => {
                    setSelectedSupplier(supplier_id);
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
