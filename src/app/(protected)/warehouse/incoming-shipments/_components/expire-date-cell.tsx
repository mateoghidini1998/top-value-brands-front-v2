"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateWithoutHours } from "@/helpers/format-date";
import { cn } from "@/lib/utils";
import type { PurchaseOrderSummaryProducts } from "@/types";

interface ExpireDateCellProps {
  row: PurchaseOrderSummaryProducts;
  onExpireDateChange: (rowId: string, value: Date | undefined) => void;
}

export const ExpireDateCell = ({
  row,
  onExpireDateChange,
}: ExpireDateCellProps) => {
  const [date, setDate] = useState<Date | undefined>(
    row.expire_date ? new Date(row.expire_date) : undefined
  );
  const [inputValue, setInputValue] = useState(
    date ? formatDateWithoutHours(date.toString()) : ""
  );
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    // Autocomplete with current year if MM/DD is entered
    if (value.length === 5) {
      const currentYear = new Date().getFullYear();
      value = `${value}/${currentYear}`;
    }

    setInputValue(value);
  };

  const handleInputBlur = () => {
    const parts = inputValue.split("/");
    if (parts.length === 3) {
      const month = Number.parseInt(parts[0], 10) - 1;
      const day = Number.parseInt(parts[1], 10);
      const year = Number.parseInt(parts[2], 10);

      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
        onExpireDateChange(row.id.toString(), newDate);
      } else {
        setInputValue(date ? formatDateWithoutHours(date.toString()) : "");
      }
    } else {
      setInputValue(date ? formatDateWithoutHours(date.toString()) : "");
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setInputValue(formatDateWithoutHours(newDate.toString()));
    }
    onExpireDateChange(row.id.toString(), newDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex w-full max-w-[240px] items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="MM/DD/YYYY"
          className="w-[150px]"
        />
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[40px] p-0", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleCalendarSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
