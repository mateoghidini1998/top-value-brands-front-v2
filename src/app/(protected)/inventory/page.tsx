/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useState } from "react";
import {
  DataGrid,
  GridColumn,
  SummaryConfig,
} from "./components/data-grid/data-grid";
// import inventoryData from "../../../constants/inventoryReport.json";
import { useSidebar } from "@/components/ui/sidebar";
import { useGetAllProducts } from "./hooks";
import { formatDate } from "@/helpers";
import { CreateEntityButton } from "@/components/custom/create-entity-button";
import { CreateProductForm } from "./components";

// // Column definitions
// const columns: GridColumn[] = [
//   { field: "sku", caption: "SKU", width: 100 },
//   {
//     field: "product-name",
//     caption: "Product Name",
//     width: 300,
//   },
//   {
//     field: "your-price",
//     caption: "Price",
//     width: 120,
//     format: "currency",
//     alignment: "right",
//     customizeText: (cellInfo) => `$${parseFloat(cellInfo.value).toFixed(2)}`,
//   },
//   {
//     field: "afn-total-quantity",
//     caption: "Total Quantity",
//     width: 120,
//     alignment: "right",
//   },
//   {
//     field: "condition",
//     caption: "Condition",
//     width: 100,
//   },
//   {
//     field: "fnsku",
//     caption: "FNSKU",
//     width: 150,
//   },
//   {
//     field: "asin",
//     caption: "ASIN",
//     width: 150,
//   },
//   {
//     field: "store",
//     caption: "Store",
//     width: 150,
//   },
// ];

// // Master detail columns
// const masterDetailColumns = [
//   { field: "afn-warehouse-quantity", caption: "Warehouse", width: 150 },
//   {
//     field: "afn-fulfillable-quantity",
//     caption: "Fulfillable",
//     width: 100,
//     alignment: "right",
//   },
//   {
//     field: "afn-reserved-quantity",
//     caption: "Reserved",
//     width: 100,
//     alignment: "right",
//   },
//   {
//     field: "afn-unsellable-quantity",
//     caption: "Unsellable",
//     width: 100,
//     alignment: "right",
//   },
//   {
//     field: "afn-inbound-working-quantity",
//     caption: "Inbound Working",
//     width: 140,
//     alignment: "right",
//   },
//   {
//     field: "afn-inbound-receiving-quantity",
//     caption: "Inbound Receiving",
//     width: 150,
//     alignment: "right",
//   },
// ];

// // Summary configuration
// const summaryConfig: SummaryConfig = {
//   summ: [
//     {
//       key: "totalQuantity",
//       column: "afn-total-quantity",
//       type: "sum",
//       displayFormat: "Total Quantity: {0}",
//     },
//     {
//       key: "avgPrice",
//       column: "your-price",
//       type: "avg",
//       displayFormat: "Avg Price: ${0}",
//       valueFormat: "currency",
//     },
//   ],
//   group: [
//     {
//       key: "countGroup",
//       column: "sku",
//       type: "count",
//       displayFormat: "Count: {0}",
//     },
//     {
//       key: "sumGroup",
//       column: "afn-total-quantity",
//       type: "sum",
//       displayFormat: "Total: {0}",
//     },
//   ],
// };

const columns: GridColumn[] = [
  { field: "seller_sku", caption: "SKU", width: 120 },
  {
    field: "product_name",
    caption: "Product Name",
    width: 300,
  },
  {
    field: "product_cost",
    caption: "Cost",
    width: 120,
    format: "currency",
    alignment: "right",
    // customizeText: (cellInfo) => `$${parseFloat(cellInfo.value).toFixed(2)}`,
  },
  {
    field: "FBA_available_inventory",
    caption: "FBA Inventory",
    width: 140,
    alignment: "right",
  },
  {
    field: "reserved_quantity",
    caption: "Reserved",
    width: 120,
    alignment: "right",
  },
  {
    field: "Inbound_to_FBA",
    caption: "Inbound to FBA",
    width: 150,
    alignment: "right",
  },
  {
    field: "warehouse_stock",
    caption: "Warehouse Stock",
    width: 150,
  },
  {
    field: "ASIN",
    caption: "ASIN",
    width: 150,
  },
  {
    field: "supplier_name",
    caption: "Supplier",
    width: 180,
  },
  {
    field: "supplier_item_number",
    caption: "Supplier Item #",
    width: 180,
  },
  {
    field: "upc",
    caption: "UPC",
    width: 150,
  },
  {
    field: "pack_type",
    caption: "Pack Type",
    width: 150,
  },
  {
    field: "updatedAt",
    caption: "Updated At",
    width: 180,
    customizeText: (cellInfo) => formatDate(cellInfo.value),
  },
];

// const masterDetailColumns = [
//   {
//     field: "supplier_item_number",
//     caption: "Supplier Item #",
//     width: 180,
//   },
//   {
//     field: "upc",
//     caption: "UPC",
//     width: 150,
//   },
//   {
//     field: "pack_type",
//     caption: "Pack Type",
//     width: 150,
//   },
//   {
//     field: "createdAt",
//     caption: "Created At",
//     width: 180,
//     dataType: "date",
//   },
//   {
//     field: "updatedAt",
//     caption: "Updated At",
//     width: 180,
//     dataType: "date",
//   },
// ];

const summaryConfig: SummaryConfig = {
  summ: [
    {
      key: "totalFBA",
      column: "FBA_available_inventory",
      type: "sum",
      displayFormat: "Total FBA Inventory: {0}",
    },
    {
      key: "avgCost",
      column: "product_cost",
      type: "avg",
      displayFormat: "Avg Cost: ${0}",
      valueFormat: "currency",
    },
    {
      key: "skuCount",
      column: "seller_sku",
      type: "count",
      displayFormat: "Total SKUs: {0}",
      // valueFormat: "",
    },
  ],
  group: [
    {
      key: "skuCount",
      column: "seller_sku",
      type: "count",
      displayFormat: "Count: {0}",
    },
    {
      key: "sumInbound",
      column: "Inbound_to_FBA",
      type: "sum",
      displayFormat: "Total Inbound: {0}",
    },
  ],
};

// Button configuration
// const gridButtonsConfig = {
//   width: 150,
//   data: "sku",
//   buttons: [
//     {
//       id: "view",
//       icon: "fas fa-eye",
//       hint: "View Details",
//       action: (data: any) => {
//         console.log("View details for:", data.data);
//         alert(`Viewing details for ${data.data["product-name"]}`);
//       },
//     },
//     {
//       id: "edit",
//       icon: "fas fa-edit",
//       hint: "Edit Item",
//       action: (data: any) => {
//         console.log("Edit item:", data.data);
//         alert(`Editing ${data.data["product-name"]}`);
//       },
//     },
//   ],
// };

export default function InventoryGridExample() {
  // const [selectedItem, setSelectedItem] = useState<any>(null);

  const { productResponse } = useGetAllProducts({ page: 1, limit: 10000 });

  const { open } = useSidebar();

  // const handleSelectionChanged = (e: any) => {
  //   if (e.selectedRowsData && e.selectedRowsData.length > 0) {
  //     setSelectedItem(e.selectedRowsData[0]);
  //   } else {
  //     setSelectedItem(null);
  //   }
  // };

  const handleRowUpdating = (e: any) => {
    console.log("Row updating:", e);
    // You can implement validation or data transformation here
    return e;
  };

  return (
    <div
      className={`${
        open ? "max-w-[calc(100vw-265px)]" : "max-w-[calc(100vw-80px)]"
      } overflow-x-auto`}
    >
      <CreateEntityButton
        title="Create Product"
        dialog_content={<CreateProductForm />}
        dialog_title="Create New Product"
      />
      {/* <h1 className="text-2xl font-bold mb-4">Inventory Management</h1> */}

      {/* {selectedItem && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-semibold">
            Selected Item: {selectedItem.name}
          </h2>
          <p>
            SKU: {selectedItem.sku} | Stock: {selectedItem.stock} | Price: $
            {selectedItem.price.toFixed(2)}
          </p>
        </div>
      )} */}

      <DataGrid
        datatable={productResponse?.data || []}
        keyExpr="seller_sku"
        columns={columns}
        // allowedit={true}
        // allowdelete={true}
        allowadd={true}
        editMode="popup"
        height={800}
        allowSelect={false}
        selectionMode="multiple"
        // onSelectionChanged={handleSelectionChanged}
        onRowUpdating={handleRowUpdating}
        summary={summaryConfig}
        // gridButtons={gridButtonsConfig}
        // masterDetail={masterDetailColumns}
        stateStoreName="inventory-grid-state"
        excelFileName="Inventory-Report"
      />
    </div>
  );
}
