"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SupplierItem = {
  value: number;
  name: string;
};

interface FilterSuppliersProps {
  items: SupplierItem[];
  onValueChange: (value: number | null) => void;
}

export function FilterSuppliers({
  items,
  onValueChange,
}: FilterSuppliersProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value !== null
            ? items.find((supplier) => supplier.value === value)?.name
            : "Select supplier..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search supplier..." className="h-9" />
          <CommandList>
            <CommandEmpty>No supplier found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setValue(null);
                  setOpen(false);
                  onValueChange(null);
                }}
              >
                Clear
                <Check
                  className={cn(
                    "ml-auto",
                    value === null ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {items.map((supplier) => (
                <CommandItem
                  key={supplier.value}
                  onSelect={() => {
                    const newValue =
                      supplier.value === value ? null : supplier.value;
                    setValue(newValue);
                    setOpen(false);
                    onValueChange(newValue);
                  }}
                >
                  {supplier.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === supplier.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
