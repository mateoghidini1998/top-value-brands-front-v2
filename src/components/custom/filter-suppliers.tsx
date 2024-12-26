import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { SupplierItem } from "@/app/(protected)/inventory/page";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface FilterSuppliersProps {
  items: SupplierItem[];
  value: number | null;
  onValueChange: (value: number | null) => void;
}

export function FilterSuppliers({
  items,
  value,
  onValueChange,
}: FilterSuppliersProps) {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  if (items.length === 0) {
    console.log("No suppliers found");
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value !== null
            ? items.find((supplier) => supplier.value === value)?.name
            : "Select supplier..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search supplier..." className="h-9" />
          <CommandList>
            <CommandEmpty>No supplier found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onValueChange(null);
                  setOpen(false);
                }}
              >
                Clear
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === null ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {items.map((supplier) => (
                <CommandItem
                  key={supplier.value}
                  onSelect={() => {
                    onValueChange(supplier.value);
                    queryClient.invalidateQueries({ queryKey: ["inventory"] });
                    setOpen(false);
                  }}
                >
                  {supplier.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
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
