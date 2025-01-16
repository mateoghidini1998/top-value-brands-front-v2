"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/helpers/format-date";
import { cn } from "@/lib/utils";
import { PurchaseOrderSummaryProducts } from "@/types";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface ExpireDateCellProps {
  row: PurchaseOrderSummaryProducts;
  onExpireDateChange: (rowId: string, value: Date | undefined) => void;
}

export const ExpireDateCell = ({
  row,
  onExpireDateChange,
}: ExpireDateCellProps) => {
  const [date, setDate] = useState<Date | undefined>(
    row.expire_date ? new Date(row.expire_date) : new Date()
  );
  const [inputValue, setInputValue] = useState(
    date ? formatDate(date.toString()) : ""
  );
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parts = inputValue.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1; // Meses son 0-indexados en JavaScript.
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
        onExpireDateChange(row.id.toString(), newDate);
      } else {
        // Restablecer el valor si la fecha no es válida.
        setInputValue(date ? formatDate(date.toString()) : "");
      }
    } else {
      // Restablecer el valor si el formato es incorrecto.
      setInputValue(date ? formatDate(date.toString()) : "");
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setInputValue(formatDate(newDate.toString()));
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
