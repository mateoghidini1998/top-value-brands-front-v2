import { toast } from "sonner";
import { useOrders } from "../../hooks/useOrders";
import { ProductInOrder } from "../interface/product-added.interface";
import generateId from "../utils/generate-po-id";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useOrderSummaryMutations } from "../../[orderId]/hooks";
import { ProductsToAdd } from "../../[orderId]/actions";

interface CreateOrderSummaryProps {
  productsAdded: ProductInOrder[];
  setProductsAdded: React.Dispatch<React.SetStateAction<ProductInOrder[]>>;
  orderNumber: string;
  notes: string;
  isEditing?: boolean;
  orderId?: string;
}

export default function CreateOrderSummary({
  productsAdded,
  setProductsAdded,
  orderNumber,
  notes,
  isEditing = false,
  orderId = "",
}: CreateOrderSummaryProps) {
  const { createOrderMutation } = useOrders();
  const { updatePurchaseOrderAsync } = useOrderSummaryMutations(orderNumber);

  const [orderNotes, setOrderNotes] = useState<string>(notes);

  console.log(orderNotes);

  const handleCreateOrder = async (
    productsAdded: ProductInOrder[],
    isEditing: boolean
  ) => {
    if (!isEditing) {
      if (productsAdded.length === 0) {
        toast.error("No products added");
        return;
      }

      await createOrderMutation
        .mutateAsync({
          products: productsAdded.map((product) => {
            return {
              product_id: product.product_id,
              quantity: product.quantity,
              product_cost: product.product_cost,
            };
          }),
          order_number: generateId(productsAdded[0].supplier_name),
          supplier_id: parseInt(productsAdded[0].supplier_id),
          purchase_order_status_id: 1,
          notes: orderNotes,
        })
        .then(() => {
          localStorage.removeItem("productsAdded");
          setOrderNotes("");
          setProductsAdded([]);
          return toast.success("Order created successfully");
        })
        .catch((error) => {
          console.error("Error creating order:", error);
          return toast.error("Error creating order");
        });
    } else {
      const transformedProducts: ProductsToAdd[] = productsAdded.map(
        (product) => {
          return {
            fees: product.fees,
            lowest_fba_price: product.lowest_fba_price,
            product_cost: product.product_cost.toString(),
            product_id: product.product_id,
            quantity: product.quantity,
          };
        }
      );

      updatePurchaseOrderAsync({
        orderId,
        products: transformedProducts,
        notes: orderNotes,
      })
        .then(() => {
          localStorage.removeItem("productsAdded");
          setOrderNotes("");
          setProductsAdded([]);
        })
        .catch((error) => {
          console.error("Error creating order:", error);
        });
    }
  };

  const handleCleanOrder = () => {
    localStorage.removeItem("productsAdded");
    setOrderNotes("");
    setProductsAdded([]);
    toast.success("Order cleaned");
  };

  return (
    <>
      <div className="w-full border-solid border-[1px] rounded-lg border-gray-300 p-4 h-fit dark:text-white space-y-4 mb-12 text-sm">
        <h6 className="font-bold">Order Summary</h6>
        <div className="flex justify-between items-center">
          <p>Order Number:</p>
          <p>{orderNumber}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Supplier:</p>
          <p>{productsAdded[0]?.supplier_name || ""}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Date:</p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between items-center ">
          <p className="font-bold">Total:</p>
          <p>{`$ ${productsAdded
            .reduce(
              (acc, product) => acc + product.product_cost * product.quantity,
              0
            )
            .toFixed(3)}`}</p>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2 min-w-[300px] w-auto">
            <p>Notes</p>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="dark:bg-dark w-full h-[100px] border-solid border-[1px] rounded-lg border-gray-300 p-4 dark:text-white"
              placeholder="Order Notes"
            />
          </div>
          <div className="flex gap-2 items-center justify-between">
            {createOrderMutation.isPending ? (
              <span className="flex items-center justify-center w-[240px]">
                <LoaderCircle className="animate-spin " />
              </span>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleCreateOrder(productsAdded, isEditing);
                  }}
                  className="bg-[#438EF3] text-white rounded-lg p-2 w-[130px]"
                >
                  {isEditing ? "Save Order" : "Submit Order"}
                </button>
                <button
                  onClick={handleCleanOrder}
                  className="bg-[#393E4F] text-white rounded-lg p-2 w-[107px]"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
