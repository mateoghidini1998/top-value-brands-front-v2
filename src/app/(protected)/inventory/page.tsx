/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { formatDate } from "@/helpers";
import {
  DataGrid,
  GridColumn,
  SummaryConfig,
} from "./components/data-grid/data-grid";
import { useDeleteProduct, useGetAllProducts } from "./hooks";
// import { CreateEntityButton } from "@/components/custom/create-entity-button";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CreateProductForm, EditProductForm } from "./components";
import Link from "next/link";

const columns: GridColumn[] = [
  {
    field: "product_image",
    caption: "Img",
    width: 50,
    edit: false, // No editable, opcional
    cellRender: (cellData: any) => {
      const imageUrl = cellData.value;
      const ASIN = cellData.data.ASIN;
      return (
        <div className="flex justify-center items-center">
          {imageUrl ? (
            <Link target="a_blank" href={`https://www.amazon.com/dp/${ASIN}`}>
              <img
                src={imageUrl}
                alt="product_image"
                loading="lazy"
                className="cover rounded-xl w-7 h-7"
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            </Link>
          ) : (
            <span>No Image</span>
          )}
        </div>
      );
    },
  },
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
    customizeText: (cellInfo) => `$${parseFloat(cellInfo.value).toFixed(2)}`,
  },
  {
    field: "FBA_available_inventory",
    caption: "FBA Inventory",
    width: 140,
    alignment: "right",
    // displayFormat: "# {0}",
    // valueFormat: "###,##0",
    format: "###,##0",
  },
  {
    field: "reserved_quantity",
    caption: "Reserved",
    width: 120,
    alignment: "right",
    format: "###,##0",
  },
  {
    field: "Inbound_to_FBA",
    caption: "Inbound to FBA",
    width: 150,
    alignment: "right",
    format: "###,##0",
  },
  {
    field: "warehouse_stock",
    caption: "Warehouse Stock",
    width: 150,
    alignment: "right",
    format: "###,##0",
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
      displayFormat: "{0}",
      valueFormat: "###,##0",
    },
    {
      key: "skuCount",
      column: "seller_sku",
      type: "count",
      displayFormat: "# {0}",
      // valueFormat: "",
    },
  ],
  group: [
    {
      key: "skuCount",
      column: "seller_sku",
      type: "count",
      displayFormat: "# {0}",
    },
  ],
};

export default function InventoryGridExample() {
  const { productResponse } = useGetAllProducts({ page: 1, limit: 10000 });
  const { deleteAsync } = useDeleteProduct();

  const { open } = useSidebar();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleInitNewRow = (e: any) => {
    console.log(openCreateModal);
    e.cancel = true; // 🚨 Cancelamos que el DataGrid agregue la fila automáticamente
    setOpenCreateModal(true); // 🚨 Abrimos nuestro modal custom
  };

  // Cuando hacen click en Eliminar
  const handleDeleteProduct = async (e: any) => {
    e.cancel = true; // 🚨 Cancelamos el delete default de DevExtreme
    console.log(e.data);
    if (e.data) {
      try {
        await deleteAsync(e.data.id.toString());
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
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
                setSelectedRow(null);
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
        height={"90vh"}
        allowSelect={false}
        setOpenCreateModal={setOpenCreateModal}
        selectionMode="multiple"
        onInitNewRow={handleInitNewRow}
        summary={summaryConfig}
        stateStoreName="inventory-grid-state"
        excelFileName="Inventory-Report"
      />
    </div>
  );
}
