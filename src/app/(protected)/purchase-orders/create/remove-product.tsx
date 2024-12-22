import { DogIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ProductInOrder } from "./interface/product-added.interface";

interface ActionsCellRow {
  productInOrder: ProductInOrder;
  setData: Dispatch<SetStateAction<ProductInOrder[]>>;
}

const RemoveProduct = ({ productInOrder, setData }: ActionsCellRow) => {
  console.log(productInOrder);

  const handleRemoveProduct = () => {
    setData((prev: ProductInOrder[]) => {
      return prev.filter((product) => product.id !== productInOrder.id);
    });
  };

  return <DogIcon className="cursor-pointer" onClick={handleRemoveProduct} />;
};

export default RemoveProduct;
