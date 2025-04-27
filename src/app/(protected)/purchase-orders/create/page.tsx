/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { useSidebar } from "@/components/ui/sidebar";
import { PurchaseOrderSummaryProducts } from "@/types";
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
import { ArrowDown } from "lucide-react";

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
    },
    {
      field: "lowest_fba_price",
      caption: "Lowest FBA Price",
      width: 150,
      format: "currency",
      alignment: "right",
    },
    {
      field: "roi",
      caption: "ROI",
      width: 100,
      alignment: "right",
    },
    {
      field: "units_sold",
      caption: "Units Sold",
      width: 120,
      alignment: "right",
    },
    {
      field: "current_rank",
      caption: "Current Rank",
      width: 140,
      alignment: "right",
    },
    {
      field: "thirty_days_rank",
      caption: "30D Rank",
      width: 140,
      alignment: "right",
    },
    {
      field: "ninety_days_rank",
      caption: "90D Rank",
      width: 140,
      alignment: "right",
    },
    {
      field: "product_velocity",
      caption: "Velocity (1D)",
      width: 130,
      alignment: "right",
    },
    {
      field: "product_velocity_2",
      caption: "Velocity (2D)",
      width: 130,
      alignment: "right",
    },
    {
      field: "product_velocity_7",
      caption: "Velocity (7D)",
      width: 130,
      alignment: "right",
    },
    {
      field: "product_velocity_15",
      caption: "Velocity (15D)",
      width: 130,
      alignment: "right",
    },
    {
      field: "product_velocity_60",
      caption: "Velocity (60D)",
      width: 130,
      alignment: "right",
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
    // {
    //   field: "dangerous_goods",
    //   caption: "Storage Type",
    //   width: 160,
    // },
    {
      field: "updatedAt",
      caption: "Updated At",
      width: 180,
    },
    {
      field: "createdAt",
      caption: "Created At",
      width: 180,
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
