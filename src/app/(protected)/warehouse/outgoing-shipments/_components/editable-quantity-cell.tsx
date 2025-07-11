import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface EditableQuantityCellProps {
  value: number;
  onChange: (value: number) => void;
}

const EditableQuantityCell = ({
  value,
  onChange,
}: EditableQuantityCellProps) => {
  const [localValue, setLocalValue] = useState<number>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Input
      type="number"
      value={localValue}
      className="w-24"
      min={1}
      onChange={(e) => setLocalValue(Number(e.target.value))}
      onBlur={() => onChange(localValue)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onChange(localValue);
          // e.currentTarget.blur(); // Si querés blurrear automáticamente
        }
      }}
    />
  );
};

export default EditableQuantityCell;
