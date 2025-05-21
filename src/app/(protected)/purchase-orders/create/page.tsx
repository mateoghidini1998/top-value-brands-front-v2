/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingSpinner from "@/components/custom/loading-spinner";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/helpers";
import { PurchaseOrderSummaryProducts } from "@/types";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

  const { productResponse } = useGetAllProducts({ page: 1, limit: 10000 });

  const [marketplace, setMarketplace] = useState<string>("amazon");

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

  const columns: GridColumn[] = [
    {
      field: "product_image",
      caption: "Img",
      width: 50,
      edit: false,
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
    {
      field: "seller_sku",
      caption: "SKU",
      width: 120,
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
      cellRender:({ value }: any) => <div className="text-center">{value ? value + ' Pack' : "-"}</div>,
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
  ];

  const walmartCols: GridColumn[] = [
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
      cellRender:({ value }: any) => <div className="text-center">{value ? value + ' Pack' : "-"}</div>,
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
      field: "is_active",
      caption: "Active",
      width: 80,
      cellRender: ({ value }) => (
        <span
          className={`font-bold ${value ? "text-green-600" : "text-red-500"}`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
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
          setProductsAdded((prevProducts) => {
            // validate the product is not already added
            const existingProduct = prevProducts.find(
              (product) => product.id === data.id
            );

            if (existingProduct) {
              toast.error("Product already added");
              return prevProducts;
            }

            // validate that the product has the same supplier_id than the first one added.
            if (prevProducts.length > 0) {
              if (prevProducts[0].supplier_id !== data.supplier_id) {
                toast.error("Products must have the same supplier");
                return prevProducts;
              }
            }

            return [...prevProducts, data];
          });
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
        <Tabs
          defaultValue="amazon"
          className="w-[200px] absolute top-0 left-[550px] z-[10]"
        >
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
          // Disable editing functionality
          allowedit={false}
          allowdelete={false}
          allowadd={false}
          // Add our custom button column
          gridButtons={gridButtonsConfig}
          stateStoreName={
            marketplace === "amazon" ? "create-po-amazon" : "create-po-walmart"
          }
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
