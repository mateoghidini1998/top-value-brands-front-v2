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
import { Supplier } from "@/types/supplier.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSupplierMutations } from "../hooks/useSuppliersMutation";

const editSupplierSchema = z.object({
  supplier_name: z.string().min(3, "Supplier name is required"),
});

interface EditSupplierFormProps {
  supplier: Supplier;
  onSuccess: () => void;
}

export function EditSupplierForm({
  supplier,
  onSuccess,
}: EditSupplierFormProps) {
  const { updateSupplierAsync } = useSupplierMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof editSupplierSchema>>({
    resolver: zodResolver(editSupplierSchema),
    defaultValues: {
      supplier_name: supplier.supplier_name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof editSupplierSchema>) {
    setIsSubmitting(true);
    try {
      const editData = {
        id: supplier.id,
        ...values,
      };

      await updateSupplierAsync(editData);
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
          name="supplier_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
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
