import { DogIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ProductInOrder } from "../interface/product-added.interface";

interface ActionsCellRow {
  productInOrder: ProductInOrder;
  setData: Dispatch<SetStateAction<ProductInOrder[]>>;
}

const RemoveProduct = ({ productInOrder, setData }: ActionsCellRow) => {
  const handleRemoveProduct = () => {
    setData((prev: ProductInOrder[]) => {
      // Filter out the product to remove from the local state
      const updatedState = prev.filter(
        (product) => product.product_id !== productInOrder.product_id
      );

      // Update the localStorage to remove the product
      const storedProducts = JSON.parse(
        localStorage.getItem("productsAdded") ?? "[]"
      );
      const updatedLocalStorage = storedProducts.filter(
        (product: { product_id: number }) =>
          product.product_id !== productInOrder.product_id
      );
      localStorage.setItem(
        "productsAdded",
        JSON.stringify(updatedLocalStorage)
      );

      return updatedState;
    });
  };

  return <DogIcon className="cursor-pointer" onClick={handleRemoveProduct} />;
};

export default RemoveProduct;
