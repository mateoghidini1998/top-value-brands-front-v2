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
import { Supplier } from "@/types/supplier.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SupplierItem } from "../../purchase-orders/page";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { useCreateProduct } from "../hooks/inventory-service.hook";

const formSchema = z.object({
  ASIN: z.string().min(1, "ASIN is required"),
  product_cost: z.number().min(0, "Product cost must be greater than 0"),
  supplier_id: z.number().min(1, "Supplier ID is required"),
  supplier_item_number: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function CreateProductForm() {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const { createAsync, isCreating } = useCreateProduct();
  const { suppliersQuery } = useSuppliers();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ASIN: "",
      product_cost: 0,
      supplier_id: 0,
      supplier_item_number: "",
    },
  });

  if (!suppliersQuery.data) {
    return <div>Loading...</div>;
  }

  const formatSuppliers = (suppliers: Supplier[]): SupplierItem[] =>
    suppliers.map((supplier) => ({
      name: supplier.supplier_name,
      value: supplier.id,
    }));

  async function onSubmit(data: ProductFormValues) {
    await createAsync(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ASIN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ASIN</FormLabel>
              <FormControl>
                <Input placeholder="Enter ASIN" {...field} />
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
                  placeholder="Enter product cost"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
            <FormItem className="flex flex-col items-start justify-center w-full gap-1">
              <FormLabel>Supplier</FormLabel>
              <FormControl className="w-full">
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
                <Input placeholder="Enter supplier item number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isCreating} className="w-full">
          {isCreating ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
