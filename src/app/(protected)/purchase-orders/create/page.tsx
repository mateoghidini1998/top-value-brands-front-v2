/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { useSidebar } from "@/components/ui/sidebar";
import { formatDate } from "@/helpers";
import { PurchaseOrderSummaryProducts } from "@/types";
import { ArrowDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DataGrid,
  GridColumn,
} from "../../inventory/components/data-grid/data-grid";
import { useGetTrackedProducts } from "../../inventory/tracked-products/hooks";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { DataTable as TrackedProductsTable } from "../../warehouse/outgoing-shipments/create/_components/tables/data-table";
import { useGetPurchaseOrderSummary } from "../hooks";
import { getAddedProductsColumns } from "./columns";
import CreateOrderSummary from "./components/create-order-summary";
import { ProductInOrder } from "./interface/product-added.interface";

export interface SupplierItem {
  value: number;
  name: string;
}

export default function Page() {
  const {
    trackedProductsResponse,
    trackedProductsIsLoading,
    trackedProductsIsError,
  } = useGetTrackedProducts({
    page: 1,
    limit: 10000,
  });

  const { suppliersQuery } = useSuppliers();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("update");
  const { ordersSummaryResponse } = useGetPurchaseOrderSummary(
    orderId as string
  );

  const transformProducts = (data: PurchaseOrderSummaryProducts[]) => {
    return data.map((product) => ({
      id: product.id,
      product_id: product.product_id,
      supplier_id: product.supplier_id,
      pack_type: product.pack_type,
      product_name: product.product_name,
      product_image: product.product_image,
      ASIN: product.ASIN,
      supplier_name: product.supplier_name,
      quantity: product.quantity_purchased,
      product_cost: parseFloat(product.product_cost),
      total_amount: product.total_amount,
      units_sold: product.units_sold,
      fees: product.fees ?? 0,
      lowest_fba_price: product.lowest_fba_price,
      in_seller_account: product.in_seller_account,
    }));
  };

  const addTransformedProducts = (
    transformedProducts: ProductInOrder[],
    setData: React.Dispatch<React.SetStateAction<ProductInOrder[]>>
  ) => {
    setData((prev: ProductInOrder[]) => {
      if (prev.length > 0) {
        const supplierId = prev[0].supplier_id;
        const hasDifferentSupplier = transformedProducts.some(
          (product) => product.supplier_id !== supplierId
        );

        if (hasDifferentSupplier) {
          toast.error("Products must have the same supplier");
          return prev;
        }
      }

      const newProducts = transformedProducts.filter(
        (product) => !productsAdded.some((p) => p.id === product.id)
      );

      const updatedLocalStorage = [
        ...newProducts.map((product) => ({
          product_id: product.product_id,
          quantity: product.quantity || 1,
          cost: product.product_cost,
        })),
      ];

      localStorage.setItem(
        "productsAdded",
        JSON.stringify(updatedLocalStorage)
      );
      toast.success("Products added successfully");

      return [...newProducts];
    });
  };

  const [productsAdded, setProductsAdded] = useState<ProductInOrder[]>(
    transformProducts([])
  );

  const columns: GridColumn[] = [
    { field: "seller_sku", caption: "SKU", width: 120 },
    { field: "product_name", caption: "Product Name", width: 300 },
    {
      field: "product_cost",
      caption: "Cost",
      width: 120,
      format: "currency",
      alignment: "right",
      customizeText: (cellInfo) => `$${parseFloat(cellInfo.value).toFixed(2)}`,
    },
    {
      field: "lowest_fba_price",
      caption: "Lowest FBA Price",
      width: 150,
      format: "currency",
      alignment: "right",
      customizeText: (cellInfo) => `$${parseFloat(cellInfo.value).toFixed(2)}`,
    },
    {
      field: "roi",
      caption: "ROI",
      width: 100,
      alignment: "right",
      format: "percent",
      cellRender: (cellInfo) => {
        const roi = parseFloat(cellInfo.value);
        let color = "";
        if (roi < 0) color = "text-red-500"; // Rojo para valores menores a 0
        else if (roi > 2)
          color = "text-green-500"; // Verde para valores mayores a 2
        else color = "text-yellow-500"; // Amarillo para valores entre 0 y 2
        return (
          <span className={`${color} w-full h-full`}>
            {roi.toFixed(2) + "%"}
          </span>
        );
      },
    },
    {
      field: "profit",
      caption: "Profit",
      width: 100,
      alignment: "right",
      format: "currency",
      cellRender: (cellInfo) => {
        const roi = parseFloat(cellInfo.value);
        let color = "";
        if (roi < 0) color = "text-red-500"; // Rojo para valores menores a 0
        else if (roi > 2)
          color = "text-green-500"; // Verde para valores mayores a 2
        else color = "text-yellow-500"; // Amarillo para valores entre 0 y 2
        return (
          <span className={`${color} w-full h-full`}>
            {roi ? roi.toFixed(2) + "%" : "N/A"}
          </span>
        );
      },
    },
    {
      field: "units_sold",
      caption: "Units Sold",
      width: 120,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "current_rank",
      caption: "Current Rank",
      width: 140,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "thirty_days_rank",
      caption: "30D Rank",
      width: 140,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "ninety_days_rank",
      caption: "90D Rank",
      width: 140,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "product_velocity",
      caption: "Velocity (30D)",
      width: 130,
      alignment: "right",
      cellRender: (cellData: any) => {
        const {
          data: {
            product_velocity,
            product_velocity_2,
            product_velocity_7,
            product_velocity_15,
            // product_velocity_60,
          },
        } = cellData;

        // Armo el contenido del tooltip
        const tooltipContent = `
        Velocities:
          2D: ${parseFloat(product_velocity_2).toFixed(2)}
          7D: ${parseFloat(product_velocity_7).toFixed(2)}
          15D: ${parseFloat(product_velocity_15).toFixed(2)}
          `;
        // 60D: ${parseFloat(product_velocity_60).toFixed(2)}
        return (
          <div title={tooltipContent.trim()} className="text-right">
            {parseFloat(product_velocity).toFixed(2)}
          </div>
        );
      },
    },
    {
      field: "FBA_available_inventory",
      caption: "FBA Inventory",
      width: 140,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "reserved_quantity",
      caption: "Reserved",
      width: 120,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "Inbound_to_FBA",
      caption: "Inbound to FBA",
      width: 150,
      alignment: "right",
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
    },
    {
      field: "warehouse_stock",
      caption: "Warehouse Stock",
      width: 150,
      customizeText: (cellInfo) => {
        const value = parseInt(cellInfo.value);
        return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      },
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
      field: "pack_type",
      caption: "Pack Type",
      width: 150,
    },
    {
      field: "dangerous_goods",
      caption: "Hazmat",
      width: 70,
      edit: false, // No editable, opcional
      cellRender: (cellData: any) => {
        const isHazmat: boolean = !(
          cellData.value === "--" || cellData.value === "STANDARD"
        );

        return (
          <div className="flex justify-center items-center relative group">
            {isHazmat ? <span>Yes</span> : <span>No</span>}
            <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm p-1 rounded">
              {cellData.value}
            </div>
          </div>
        );
      },
    },
    {
      field: "updatedAt",
      caption: "Updated At",
      width: 150,
      customizeText: (cellInfo) => formatDate(cellInfo.value),
    },
    {
      field: "createdAt",
      caption: "Created At",
      width: 150,
      customizeText: (cellInfo) => formatDate(cellInfo.value),
    },
  ];

  const gridButtonsConfig = {
    width: 54,
    data: "Action", // <- deja esto vacío si no hay valor a mostrar
    buttons: [
      {
        id: "add",
        icon: "fas fa-plus-circle",
        hint: "Add to Selection",
        action: (data: any) => {
          // console.log("Adding product:", data);
          setProductsAdded((prevProducts) => [...prevProducts, data]);
        },
      },
    ],
  };

  useEffect(() => {
    if (orderId) {
      addTransformedProducts(
        transformProducts(
          ordersSummaryResponse?.data.purchaseOrderProducts ?? []
        ),
        setProductsAdded
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { open } = useSidebar();

  // Render condicional después de los hooks
  if (trackedProductsIsLoading || suppliersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsResponse || !suppliersQuery.data) {
    return <div>Error</div>;
  }

  if (trackedProductsIsError || suppliersQuery.isError) {
    return <div>Error</div>;
  }

  if (!trackedProductsResponse) {
    return <div>Error</div>;
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="flex flex-col w-full h-full">
      {/* Create a float button to go to the bottom of the page. */}

      <div
        className={`${
          open ? "max-w-[calc(100vw-265px)]" : "max-w-[calc(100vw-80px)]"
        } overflow-x-auto`}
      >
        <DataGrid
          datatable={trackedProductsResponse.data}
          keyExpr="id"
          columns={columns}
          height={productsAdded.length > 0 ? "90vh" : "90vh"}
          allowSearch={true}
          allowFilter={true}
          allowSelect={false}
          // Disable editing functionality
          allowedit={false}
          allowdelete={false}
          allowadd={false}
          // Add our custom button column
          gridButtons={gridButtonsConfig}
          stateStoreName="create-po-grid-state"
        />
      </div>

      {productsAdded.length > 0 && (
        <div className="mt-6 relative">
          {/* <FloatButton /> */}
          <button
            className="w-[30px] h-[30px] bg-gray-500 absolute top-[-55px] left-1/2  mx-auto rounded-full flex items-center justify-center z-[6000px] hover:bg-gray-500/80 transition-all ease-linear"
            onClick={scrollToBottom}
          >
            <ArrowDown className="w-4 h-4 text-white" />
          </button>
          {/* 3. Added products table */}
          <div className="max-h-[400px] overflow-y-auto">
            <TrackedProductsTable
              data={productsAdded}
              columns={getAddedProductsColumns(setProductsAdded)}
            />
          </div>

          {/* 4. Create order summary */}
          <CreateOrderSummary
            productsAdded={productsAdded}
            setProductsAdded={setProductsAdded}
            orderNumber={
              ordersSummaryResponse?.data.order.order_number ||
              "The order number would be automatically generated"
            }
            notes={ordersSummaryResponse?.data.order.notes || ""}
            isEditing={!!orderId}
            orderId={orderId || ""}
          />
        </div>
      )}
    </section>
  );
}
