import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface FilterProps {
  items: { value: number | string; name: string }[];
  value: number | string | null;
  onValueChange: (value: number | string | null) => void;
  className?: string;
  placeholder?: string;
}

export function FilterSearch({
  items,
  value,
  onValueChange,
  className = "w-[250px]",
  placeholder = "Select supplier...",
}: FilterProps) {
  const [open, setOpen] = useState<boolean>(false);
  if (items.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value !== null
            ? items.find((item) => item.value === value)?.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", className)}>
        <Command className="bg-background">
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No filter found.</CommandEmpty>
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
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
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
