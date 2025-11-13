/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/helpers";
import { Product, PurchaseOrderSummaryProducts } from "@/types";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DataGrid,
  GridColumn,
} from "../../inventory/components/data-grid/data-grid";
import { useGetAllProducts } from "../../inventory/hooks";
import { useGetTrackedProducts } from "../../inventory/tracked-products/hooks";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { DataTable as TrackedProductsTable } from "../../warehouse/outgoing-shipments/create/_components/tables/data-table";
import { useGetPurchaseOrderSummary } from "../hooks";
import { getAddedProductsColumns } from "./columns";
import CreateOrderSummary from "./components/create-order-summary";
import { ProductInOrder } from "./interface/product-added.interface";
import { checkIfHazmat } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@/types/auth.type";

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
    limit: 100000,
  });

  const { productResponse } = useGetAllProducts({ page: 1, limit: 100000 });

  const { user } = useUser();

  const customUser: UserResource = {
    publicMetadata: {
      role: user?.publicMetadata.role as string,
      warehouse: user?.publicMetadata.warehouse as string,
    },
    username: user?.username as string | null,
    primaryEmailAddress: {
      emailAddress: user?.primaryEmailAddress?.emailAddress as string | null,
    },
  };
  
  const isWalmartUser = customUser?.publicMetadata.warehouse === "walmart";

  const [marketplace, setMarketplace] = useState<string>(isWalmartUser ? "walmart" : "amazon");

  const { suppliersQuery } = useSuppliers();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("update");
  const { ordersSummaryResponse } = useGetPurchaseOrderSummary(
    orderId as string
  );

  const transformProducts = (data: PurchaseOrderSummaryProducts[]) => {
    return data.map((p) => ({
      id: p.id,
      product_id: p.product_id,
      supplier_id: p.supplier_id,
      pack_type: p.pack_type,
      product_name: p.product_name,
      product_image: p.product_image,
      ASIN: p.ASIN,
      supplier_name: p.supplier_name || "missing",
      quantity: p.quantity_purchased,
      product_cost: parseFloat(p.product_cost),
      total_amount: p.total_amount,
      units_sold: p.units_sold,
      fees: p.fees ?? 0,
      lowest_fba_price: p.lowest_fba_price,
      in_seller_account: p.in_seller_account,
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
          product_id: product.ASIN ? product.product_id : product.id,
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

  const columns = useMemo<GridColumn[]>(
    () => [
      {
        field: "product_image",
        caption: "Img",
        width: 50,
        edit: false,
        cellRender: (cellData: any) => {
          const imageUrl = cellData.value;
          const ASIN = cellData.data.ASIN;
          const WPID = cellData.data.WPID;
          const getProductUrl = () => {
            if (ASIN) {
              return `https://www.amazon.com/dp/${ASIN}`;
            }
            if (WPID != null) {
              return `https://www.walmart.com/ip/${WPID}`;
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
      {
        field: "seller_sku",
        caption: "SKU",
        width: 120,
      },
      {
        field: "listing_status",
        caption: "Listing Status",
        width: 120,
        cellRender: (cellData: any) => {
          const listing_status = cellData.value;
          const listing_status_id = cellData.data.listing_status_id;
          return (
            <span className={listing_status_id === 3 ? "text-red-500" : ""}>
              {listing_status ? listing_status.replace(/_/g, " ") : "N/A"}
            </span>
          );
        },
      },
      {
        field: "upc",
        caption: "UPC",
        width: 80,
      },
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
        customizeText: (cellInfo) =>
          `$${parseFloat(cellInfo.value).toFixed(2)}`,
      },
      {
        field: "lowest_fba_price",
        caption: "Lowest FBA Price",
        width: 150,
        format: "currency",
        alignment: "right",
        customizeText: (cellInfo) =>
          `$${parseFloat(cellInfo.value).toFixed(2)}`,
      },
      {
        field: "fees",
        caption: "Fees",
        width: 100,
        alignment: "right",
        format: "currency",
        customizeText: (cellInfo) => {
          const value = parseFloat(cellInfo.value);
          return isNaN(value) ? "-" : `$${value.toFixed(2)}`;
        },
      },
      {
        field: "profit",
        caption: "Profit",
        width: 100,
        alignment: "right",
        format: "currency",
        cellRender: (cellInfo) => {
          const profit = parseFloat(cellInfo.value);
          let color = "";
          if (profit < 0) color = "text-red-500";
          else if (profit > 2) color = "text-green-500";
          else color = "text-yellow-500";
          return (
            <span className={`${color} w-full h-full`}>
              {profit ? `$${profit.toFixed(2)}` : "N/A"}
            </span>
          );
        },
      },
      {
        field: "avg_selling_price",
        caption: "Avg Selling Price",
        width: 150,
        format: "currency",
        alignment: "right",
        customizeText: (cellInfo) => {
          const value = parseFloat(cellInfo.value);
          return isNaN(value) ? "-" : `$${value.toFixed(2)}`;
        },
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
              {roi ? ` ${roi.toFixed(2)}%` : "N/A"}
            </span>
          );
        },
      },
      // {
      //   field: "units_sold",
      //   caption: "Units Sold",
      //   width: 120,
      //   alignment: "right",
      //   customizeText: (cellInfo) => {
      //     const value = parseInt(cellInfo.value);
      //     return new Intl.NumberFormat("en-US").format(value); // Formateo con comas
      //   },
      // },
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
        caption: "Reserved Qty",
        width: 130,
        alignment: "right",
        format: "###,##0",
        cellRender: ({ data: product }: { data: Product }) => {
          const {
            reserved_quantity,
            fc_transfer,
            fc_processing,
            customer_order,
          } = product;
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
        alignment: "right",
        customizeText: (cellInfo) => {
          const value = parseInt(cellInfo.value);
          return isNaN(value)
            ? "0"
            : new Intl.NumberFormat("en-US").format(value);
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
        cellRender: ({ value }: any) => (
          <div className="text-center">
            {value ? (value.includes("Pack") ? value : value + " Pack") : "-"}
          </div>
        ),
      },
      {
        field: "dangerous_goods",
        caption: "Hazmat",
        width: 70,
        cellRender: (cellData: any) => {
          const isHazmat = checkIfHazmat(cellData.value);
          const tooltipContent = cellData.value;
          return (
            <div title={tooltipContent?.trim()} className="text-center">
              {isHazmat ? (
                <span className="text-red-500 cursor-pointer">Yes</span>
              ) : (
                <span>No</span>
              )}
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
    ],
    []
  );

  const walmartCols = useMemo<GridColumn[]>(
    () => [
      {
        field: "product_image",
        caption: "Img",
        width: 50,
        edit: false,
        cellRender: (cellData: any) => {
          const imageUrl = cellData.value;
          return (
            <div className="flex justify-center items-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="product_image"
                  loading="lazy"
                  className="cover rounded-xl w-7 h-7"
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
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
        field: "pack_type",
        caption: "Pack Type",
        width: 150,
        cellRender: ({ value }: any) => (
          <div className="text-center">
            {value ? (value.includes("Pack") ? value : value + " Pack") : "-"}
          </div>
        ),
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
      {
        field: "price",
        caption: "Price",
        width: 120,
        format: "currency",
        alignment: "right",
        customizeText: (cellInfo) => {
          const value = parseFloat(cellInfo.value);
          return isNaN(value) ? "-" : `$${value.toFixed(2)}`;
        },
      },
      { field: "marketplace", caption: "Marketplace", width: 100 },
      {
        field: "warehouse_stock",
        caption: "Warehouse Stock",
        width: 140,
        alignment: "right",
        format: "#,##0",
      },
      {
        field: "in_seller_account",
        caption: "In Seller Account",
        width: 140,
        cellRender: ({ value }) => (
          <span
            className={`font-bold ${value ? "text-green-600" : "text-red-500"}`}
          >
            {value ? "Yes" : "No"}
          </span>
        ),
      },
      { field: "upc", caption: "UPC", width: 120 },
      { field: "gtin", caption: "GTIN", width: 120 },
      {
        field: "dangerous_goods",
        caption: "Hazmat",
        width: 70,
        edit: false, // No editable, opcional
        cellRender: (cellData: any) => {
          const isHazmat: boolean =
            cellData.value !== "--" &&
            cellData.value !== "STANDARD" &&
            cellData.value !== "" &&
            cellData.value !== null &&
            cellData.value !== undefined;

          return (
            <div className="flex justify-center items-center relative group">
              {isHazmat ? <span>Yes</span> : <span>No</span>}
              <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm p-1 rounded overflow-visible">
                {cellData.value}
              </div>
            </div>
          );
        },
      },
      {
        field: "updatedAt",
        caption: "Updated At",
        width: 180,
        customizeText: (cellInfo) => formatDate(cellInfo.value),
      },
    ],
    []
  );

  const handleAddProduct = useCallback(
    (data: any) => {
      setProductsAdded((prevProducts) => {
        if (prevProducts.some((p) => p.id === data.id)) {
          toast.error("Product already added");
          return prevProducts;
        }
        if (
          prevProducts.length > 0 &&
          prevProducts[0].supplier_id !== data.supplier_id
        ) {
          toast.error("Products must have the same supplier");
          return prevProducts;
        }
        return [...prevProducts, data];
      });
    },
    [setProductsAdded]
  );

  const gridButtonsConfig = useMemo(
    () => ({
      width: 54,
      data: "Action",
      buttons: [
        {
          id: "add",
          icon: "fas fa-plus-circle",
          hint: "Add to Selection",
          action: handleAddProduct,
        },
      ],
    }),
    [handleAddProduct]
  );

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

  function normalizeProduct(product: any): any {
    const isWalmart = product.marketplace === "walmart" || !product.ASIN;

    if (!isWalmart) {
      // Producto Amazon ya formateado, aseguramos compatibilidad con Walmart
      return {
        ...product,
        marketplace: "amazon",
        supplier_name: product.supplier_name ?? null,
        roi: product.roi ?? null,
      };
    }

    return {
      id: product.id,
      gtin: product?.gtin || null,
      wpid: product?.wpid || null,
      product_id: product.id,
      current_rank: null,
      thirty_days_rank: null,
      ninety_days_rank: null,
      units_sold: 0,
      product_velocity: 0,
      product_velocity_2: 0,
      product_velocity_7: 0,
      product_velocity_15: 0,
      product_velocity_60: 0,
      avg_selling_price: parseFloat(product.price ?? 0),
      lowest_fba_price: null,
      fees: null,
      profit: null,
      roi: null,
      is_active: product.is_active === 1 || product.is_active === true,
      createdAt: null,
      updatedAt: product.updatedAt ?? null,

      product_name: product.product_name,
      product_cost: product.product_cost ?? "0.00",
      product_image: product.product_image,
      supplier_id: product.supplier_id,
      supplier_name: product.supplier_name ?? null,
      in_seller_account:
        product.in_seller_account === 1 || product.in_seller_account === true,
      supplier_item_number: product.supplier_item_number,
      warehouse_stock: product.warehouse_stock ?? null,
      pack_type: product.pack_type,

      ASIN: null,
      seller_sku: product.seller_sku,
      FBA_available_inventory: 0,
      reserved_quantity: 0,
      Inbound_to_FBA: 0,
      dangerous_goods: null,

      marketplace: "walmart",
    };
  }

  return (
    <section className="flex flex-col w-full h-full">
      {/* Create a float button to go to the bottom of the page. */}

      <div
        className={`relative ${
          open ? "max-w-[calc(100vw-265px)]" : "max-w-[calc(100vw-80px)]"
        } overflow-x-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue={isWalmartUser ? "walmart" : "amazon"} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                disabled={isWalmartUser}
                className={isWalmartUser ? "opacity-50 cursor-not-allowed" : ""}
                value="amazon"
                onClick={() => setMarketplace("amazon")}
              >
                {isWalmartUser ? '🔒' : "Amazon"}
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

        <DataGrid
          key={marketplace}
          datatable={
            marketplace === "amazon"
              ? trackedProductsResponse.data?.filter(
                  (p) => p.supplier_id !== null
                ) || []
              : productResponse?.data
                  ?.filter(
                    (product: any) =>
                      product.marketplace === "walmart" &&
                      product.supplier_id !== null
                  )
                  .map((product: any) => normalizeProduct(product)) || []
          }
          keyExpr="id"
          columns={marketplace === "amazon" ? columns : walmartCols}
          height={productsAdded.length > 0 ? "90vh" : "90vh"}
          allowSearch={true}
          allowFilter={true}
          allowSelect={false}
          allowedit={false}
          allowdelete={false}
          allowadd={false}
          gridButtons={gridButtonsConfig}
          stateStoreName={
            marketplace === "amazon" ? "create-po-amazon" : "create-po-walmart"
          }
          rowAlternation={false}
          onRowPrepared={(e) => {
            if (e.rowType === "data" && marketplace === "amazon") {
              const data = e.data;
              if (data.listing_status_id === 3) {
                e.rowElement.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; // Light red background
              } else {
                // Si no es listing_status_id === 3, alternamos entre blanco y gris
                const rowIndex = e.rowIndex;
                e.rowElement.style.backgroundColor =
                  rowIndex % 2 === 0 ? "white" : "rgba(0, 0, 0, 0.05)";
              }
            }
          }}
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
