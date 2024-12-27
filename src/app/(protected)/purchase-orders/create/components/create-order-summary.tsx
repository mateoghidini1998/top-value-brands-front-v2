import { toast } from "sonner";
import { useOrders } from "../../hooks/useOrders";
import { ProductInOrder } from "../interface/product-added.interface";
import generateId from "../utils/generate-po-id";
import { LoaderCircle } from "lucide-react";

interface CreateOrderSummaryProps {
  productsAdded: ProductInOrder[];
}

export default function CreateOrderSummary({
  productsAdded,
}: CreateOrderSummaryProps) {
  const { createOrderMutation } = useOrders();

  const handleCreateOrder = async (productsAdded: ProductInOrder[]) => {
    if (productsAdded.length === 0) {
      toast.error("No products added");
      return;
    }

    await createOrderMutation.mutateAsync({
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
    });
  };

  const handleCleanOrder = () => {
    localStorage.removeItem("productsAdded");
    window.location.reload();
  };

  return (
    <>
      <div className="w-full border-solid border-[1px] rounded-lg border-gray-300 p-4 h-fit dark:text-white space-y-4 mb-12 text-sm">
        <h6 className="font-bold">Order Summary</h6>
        <div className="flex justify-between items-center">
          <p>Order Number:</p>
          <p>The order number would be automatically generated</p>
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
              // onChange={(e) => handleNotesChange(e)}
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
                    handleCreateOrder(productsAdded);
                  }}
                  className="bg-[#438EF3] text-white rounded-lg p-2 w-[130px]"
                >
                  Submit Order
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
