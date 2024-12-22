"use client";

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
import * as z from "zod";
import { EditProductProps } from "../actions/edit-product.action";
import { useInventory } from "../hooks/useInventory";
import { Product } from "../interfaces/product.interface";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(product);

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
      pack_type: product.pack_type || 1,
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
    } catch (error) {
      console.error("Failed to edit product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <FormItem>
              <FormLabel>Supplier ID</FormLabel>
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
      </form>
    </Form>
  );
}
