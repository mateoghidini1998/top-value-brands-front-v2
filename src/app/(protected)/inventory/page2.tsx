"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import inventoryData from "../../../constants/inventoryReport.json";
import { DataGrid2 } from "./components/data-grid/data-grid2";
// import { SelectedItem } from "./components/data-grid/selected-item";

type InventoryItem = {
  sku: string;
  name: string;
  // Add other properties from your inventory data
};

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem>();
  const { open } = useSidebar();

  if (selectedItem) {
    console.log(selectedItem);
  }

  return (
    <div
      className={`${
        open ? "max-w-[calc(100vw-265px)]" : "max-w-[calc(100vw-80px)]"
      } overflow-x-auto`}
    >
      {/* <SelectedItem<InventoryItem>
        item={selectedItem}
        renderItem={(item) => (
          <div>
            <h3 className="text-lg font-medium">Selected Item</h3>
            <p>SKU: {item.sku}</p>
            <p>Name: {item.name}</p>
          </div>
        )}
      /> */}
      <DataGrid2<InventoryItem>
        // @ts-expect-error @typescript-eslint/no-unsafe-member-access
        data={inventoryData}
        keyExpr="sku"
        onSelectionChanged={setSelectedItem}
        allowEditing={true}
        className="h-[100%] overflow-y-auto"
      />
    </div>
  );
}
