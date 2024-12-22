import { DogIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ProductInOrder } from "./interface/product-added.interface";
import { TrackedProduct } from "../../inventory/tracked-products/interfaces/tracked-product.interface";
import { formatTrackedProduct } from "./utils/format-tracked-product";

interface ActionsCellRow {
  trackedProduct: TrackedProduct;
  setData: Dispatch<SetStateAction<ProductInOrder[]>>;
}

const AddProduct = ({ trackedProduct, setData }: ActionsCellRow) => {
  const formattedProduct = formatTrackedProduct(trackedProduct);

  const handleAddProduct = () => {
    setData((prev: ProductInOrder[]) => {
      return [...prev, formattedProduct];
    });
  };

  return <DogIcon className="cursor-pointer" onClick={handleAddProduct} />;
};

export default AddProduct;
