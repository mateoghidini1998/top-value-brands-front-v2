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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSupplierMutations } from "../hooks/useSuppliersMutation";
import { useState } from "react";

const formSchema = z.object({
  supplier_name: z.string().min(3, "Supplier name is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function CreateSupplierForm() {
  const { createSupplierAsync } = useSupplierMutations();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_name: "",
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    await createSupplierAsync(data);
    form.reset();
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="supplier_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter supplier name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create Supplier"}
        </Button>
      </form>
    </Form>
  );
}
