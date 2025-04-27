/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { formatDate } from "@/helpers";
import {
  DataGrid,
  GridColumn,
  SummaryConfig,
} from "./components/data-grid/data-grid";
import { useGetAllProducts } from "./hooks";
// import { CreateEntityButton } from "@/components/custom/create-entity-button";
import { useState } from "react";
import { CreateProductForm, EditProductForm } from "./components";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

export default function InventoryGridExample() {
  const { productResponse } = useGetAllProducts({ page: 1, limit: 10000 });
  const { open } = useSidebar();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleRowUpdating = (e: any) => {
    console.log("Row updating:", e);
    return e;
  };

  const handleInitNewRow = (e: any) => {
    console.log(openCreateModal);
    e.cancel = true; // 🚨 Cancelamos que el DataGrid agregue la fila automáticamente
    setOpenCreateModal(true); // 🚨 Abrimos nuestro modal custom
  };

  const handleDeleteProduct = (e: any) => {
    console.log("Delete product:", e);
  };

  const handleEditProduct = (e: any) => {
    e.cancel = true; // 🚨 Cancelamos el edit default de DevExtreme
    setSelectedRow(e.data); // 🚀 Guardamos la fila seleccionada
    setOpenEditModal(true); // 🚀 Abrimos nuestro modal de edición
  };

  return (
    <div
      className={`${
        open ? "max-w-[calc(100vw-265px)]" : "max-w-[calc(100vw-80px)]"
      } overflow-x-auto`}
    >
      {openCreateModal && (
        <Dialog open onOpenChange={setOpenCreateModal}>
          <DialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>{"Create New Product"}</DialogTitle>
            </AlertDialogHeader>
            <CreateProductForm />
          </DialogContent>
        </Dialog>
      )}

      {openEditModal && (
        <Dialog open onOpenChange={setOpenEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </AlertDialogHeader>
            <EditProductForm
              product={selectedRow}
              onSuccess={() => {
                setOpenEditModal(false);
                toast.success("Product edited successfully");
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <DataGrid
        datatable={productResponse?.data || []}
        keyExpr="seller_sku"
        columns={columns}
        allowadd={true}
        allowedit={true}
        allowdelete={true}
        editMode="popup"
        onEditingStart={handleEditProduct}
        onRowRemoving={handleDeleteProduct}
        height={800}
        allowSelect={false}
        setOpenCreateModal={setOpenCreateModal}
        selectionMode="multiple"
        onRowUpdating={handleRowUpdating}
        onInitNewRow={handleInitNewRow}
        summary={summaryConfig}
        stateStoreName="inventory-grid-state"
        excelFileName="Inventory-Report"
      />
    </div>
  );
}
