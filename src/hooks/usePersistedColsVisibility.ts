import { useEffect } from "react";
import { Table } from "@tanstack/react-table";

export function usePersistedColumnsVisibility(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>,
  tableId: string
) {
  useEffect(() => {
    const hiddenColumns = JSON.parse(localStorage.getItem(tableId) || "[]");

    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(!hiddenColumns.includes(column.id));
      }
    });
  }, [table, tableId]);

  const handleVisibilityChange = (columnId: string, isVisible: boolean) => {
    const hiddenColumns = JSON.parse(localStorage.getItem(tableId) || "[]");

    if (!isVisible) {
      // Ocultar columna -> agregar a `hiddenColumns`
      if (!hiddenColumns.includes(columnId)) {
        hiddenColumns.push(columnId);
      }
    } else {
      // Mostrar columna -> quitar de `hiddenColumns`
      const index = hiddenColumns.indexOf(columnId);
      if (index !== -1) {
        hiddenColumns.splice(index, 1);
      }
    }

    localStorage.setItem(tableId, JSON.stringify(hiddenColumns));
  };

  return handleVisibilityChange;
}
