/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/helpers";
import { Product } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { CreateProductForm, EditProductForm } from "./components";
import {
  DataGrid,
  GridColumn,
  SummaryConfig,
} from "./components/data-grid/data-grid";
import { useDeleteProduct, useGetAllProducts } from "./hooks";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@/types/auth.type";

const amzCols: GridColumn[] = [
  {
    field: "product_image",
    caption: "Img",
    width: 50,
    edit: false,
    cellRender: (cellData: any) => {
      const imageUrl = cellData.value;
      const asin = cellData.data.asin || cellData.data.ASIN;
      const wpid = cellData.data.wpid || cellData.data.WPID;
      const getProductUrl = () => {
        if (asin) {
          return `https://www.amazon.com/dp/${asin}`;
        }
        if (wpid != null) {
          return `https://www.walmart.com/ip/${wpid}`;
        }
        return "#";
      };

      return (
        <div className="flex justify-center items-center">
          {imageUrl ? (
            <Link target="a_blank" href={getProductUrl()}>
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
  { field: "listing_status", caption: "Listing Status", width: 120 },
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
    field: "fba_available_inventory",
    caption: "FBA Inventory",
    width: 140,
    alignment: "right",
    // displayFormat: "# {0}",
    // valueFormat: "###,##0",
    format: "###,##0",
  },
  {
    field: "reserved_quantity",
    caption: "Reserved Qty",
    width: 130,
    alignment: "right",
    format: "###,##0",
    cellRender: ({ data: product }: { data: Product }) => {
      const { reserved_quantity, fc_transfer, fc_processing, customer_order } =
        product;
      const tooltipContent = `
      Reserved:
          FC Transfer: ${fc_transfer}
          FC Processing: ${fc_processing}
          Customer Order: ${customer_order}
          `;
      return (
        <div title={tooltipContent.trim()} className="text-left">
          {reserved_quantity}
        </div>
      );
    },
  },
  {
    field: "inbound_to_fba",
    caption: "Inbound to FBA",
    width: 150,
    alignment: "right",
    format: "###,##0",
  },
  {
    field: "warehouse_stock",
    caption: "Warehouse Stock",
    width: 140,
    alignment: "right",
    format: "#,##0",
    customizeText: (cellInfo) => {
      const value = parseInt(cellInfo.value);
      return isNaN(value) ? "0" : value.toString();
    },
  },
  {
    field: "asin",
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

// Columnas específicas para warehouse (sin las columnas que necesitas quitar)
const amzWarehouseCols: GridColumn[] = [
  {
    field: "product_image",
    caption: "Img",
    width: 50,
    edit: false,
    cellRender: (cellData: any) => {
      const imageUrl = cellData.value;
      const asin = cellData.data.asin || cellData.data.ASIN;
      const wpid = cellData.data.wpid || cellData.data.WPID;
      const getProductUrl = () => {
        if (asin) {
          return `https://www.amazon.com/dp/${asin}`;
        }
        if (wpid != null) {
          return `https://www.walmart.com/ip/${wpid}`;
        }
        return "#";
      };

      return (
        <div className="flex justify-center items-center">
          {imageUrl ? (
            <Link target="a_blank" href={getProductUrl()}>
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
    field: "fba_available_inventory",
    caption: "FBA Inventory",
    width: 140,
    alignment: "right",
    format: "###,##0",
  },
  {
    field: "reserved_quantity",
    caption: "Reserved Qty",
    width: 130,
    alignment: "right",
    format: "###,##0",
    cellRender: ({ data: product }: { data: Product }) => {
      const { reserved_quantity, fc_transfer, fc_processing, customer_order } =
        product;
      const tooltipContent = `
      Reserved:
          FC Transfer: ${fc_transfer}
          FC Processing: ${fc_processing}
          Customer Order: ${customer_order}
          `;
      return (
        <div title={tooltipContent.trim()} className="text-left">
          {reserved_quantity}
        </div>
      );
    },
  },
  {
    field: "inbound_to_fba",
    caption: "Inbound to FBA",
    width: 150,
    alignment: "right",
    format: "###,##0",
  },
  {
    field: "warehouse_stock",
    caption: "Warehouse Stock",
    width: 140,
    alignment: "right",
    format: "#,##0",
    customizeText: (cellInfo) => {
      const value = parseInt(cellInfo.value);
      return isNaN(value) ? "0" : value.toString();
    },
  },
  {
    field: "asin",
    caption: "ASIN",
    width: 150,
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

const walmartCols: GridColumn[] = [
  {
    field: "product_image",
    caption: "Img",
    width: 50,
    edit: false,
    cellRender: (cellData: any) => {
      const imageUrl = cellData.value;
      const wpid = cellData.data.wpid;
      return (
        <div className="flex justify-center items-center">
          {imageUrl ? (
            <Link target="a_blank" href={`https://www.walmart.com/ip/${wpid}`}>
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
  { field: "product_name", caption: "Product Name", width: 300 },
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
    field: "product_cost",
    caption: "Cost",
    width: 120,
    format: "currency",
    alignment: "right",
    customizeText: (cellInfo) => {
      const value = parseFloat(cellInfo.value);
      return isNaN(value) ? "-" : `$${value.toFixed(2)}`;
    },
  },
  {
    field: "available_to_sell_qty",
    caption: "Available Qty",
    width: 140,
    alignment: "right",
    format: "#,##0",
  },
  { field: "marketplace", caption: "Marketplace", width: 100 },
  {
    field: "warehouse_stock",
    caption: "Warehouse Stock",
    width: 140,
    alignment: "right",
    format: "#,##0",
    customizeText: (cellInfo) => {
      const value = parseInt(cellInfo.value);
      return isNaN(value) ? "0" : value.toString();
    },
  },
  {
    field: "listing_status",
    caption: "Listing Status",
    width: 120,
    cellRender: ({ value }) => <span>{value?.replace(/_/g, " ")}</span>,
  },
  { field: "upc", caption: "UPC", width: 120 },
  {
    field: "pack_type",
    caption: "Pack Type",
    width: 120,
    cellRender: ({ value }) => <span>{value ? value + " Pack" : "-"}</span>,
  },
  { field: "gtin", caption: "GTIN", width: 120 },
  {
    field: "updatedAt",
    caption: "Updated At",
    width: 180,
    customizeText: (cellInfo) => formatDate(cellInfo.value),
  },
];

// Columnas específicas para warehouse de Walmart (sin las columnas que necesitas quitar)
const walmartWarehouseCols: GridColumn[] = [
  {
    field: "product_image",
    caption: "Img",
    width: 50,
    edit: false,
    cellRender: (cellData: any) => {
      const imageUrl = cellData.value;
      const wpid = cellData.data.wpid;
      return (
        <div className="flex justify-center items-center">
          {imageUrl ? (
            <Link target="a_blank" href={`https://www.walmart.com/ip/${wpid}`}>
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
  { field: "product_name", caption: "Product Name", width: 300 },
  {
    field: "available_to_sell_qty",
    caption: "Available Qty",
    width: 140,
    alignment: "right",
    format: "#,##0",
  },
  { field: "marketplace", caption: "Marketplace", width: 100 },
  {
    field: "warehouse_stock",
    caption: "Warehouse Stock",
    width: 140,
    alignment: "right",
    format: "#,##0",
    customizeText: (cellInfo) => {
      const value = parseInt(cellInfo.value);
      return isNaN(value) ? "0" : value.toString();
    },
  },
  { field: "upc", caption: "UPC", width: 120 },
  {
    field: "pack_type",
    caption: "Pack Type",
    width: 120,
    cellRender: ({ value }) => <span>{value ? value + " Pack" : "-"}</span>,
  },
  { field: "gtin", caption: "GTIN", width: 120 },
  {
    field: "updatedAt",
    caption: "Updated At",
    width: 180,
    customizeText: (cellInfo) => formatDate(cellInfo.value),
  },
];

export default function InventoryGridExample() {
  const { productResponse } = useGetAllProducts({ page: 1, limit: 10000 });
  const { deleteAsync } = useDeleteProduct();
  const { user } = useUser();

  const { open } = useSidebar();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [marketplace, setMarketplace] = useState<string>("amazon");

  // Detectar si el usuario es warehouse
  const customUser: UserResource = {
    publicMetadata: {
      role: user?.publicMetadata.role as string,
    },
    username: user?.username as string | null,
    primaryEmailAddress: {
      emailAddress: user?.primaryEmailAddress?.emailAddress as string | null,
    },
  };

  const isWarehouse = customUser?.publicMetadata.role === "warehouse";

  // Seleccionar las columnas apropiadas según el rol del usuario
  const getAmazonColumns = () => {
    return isWarehouse ? amzWarehouseCols : amzCols;
  };

  const getWalmartColumns = () => {
    return isWarehouse ? walmartWarehouseCols : walmartCols;
  };

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
      } overflow-x-auto relative`}
    >
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="amazon" className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="amazon"
              onClick={() => setMarketplace("amazon")}
            >
              Amazon
            </TabsTrigger>
            <TabsTrigger
              value="walmart"
              onClick={() => setMarketplace("walmart")}
            >
              Walmart
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
        key={marketplace}
        datatable={
          productResponse?.data.filter(
            (p) =>
              p.marketplace?.trim().toLowerCase() ===
              (marketplace === "walmart" ? "walmart" : "amazon")
          ) || []
        }
        keyExpr="seller_sku"
        columns={
          marketplace === "walmart" ? getWalmartColumns() : getAmazonColumns()
        }
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
        stateStoreName={
          marketplace === "amazon"
            ? "inventory-po-amazon"
            : "inventory-po-walmart"
        }
        excelFileName="Inventory-Report"
        rowAlternation={false}
        borders={true}
        className="dx-datagrid-borders dx-widget"
        onCellPrepared={(e) => {
          if (
            e.rowType === "data" &&
            e.column.dataField === "reserved_quantity"
          ) {
            e.cellElement.style.overflow = "visible";
            e.cellElement.style.zIndex = "1000";
            e.cellElement.style.position = "relative";
          }
        }}
        onRowPrepared={(e) => {
          if (e.rowType === "data") {
            const data = e.data;
            if (data.listing_status_id === 3) {
              e.rowElement.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; // Light red background
            }
          }
        }}
      />
    </div>
  );
}
