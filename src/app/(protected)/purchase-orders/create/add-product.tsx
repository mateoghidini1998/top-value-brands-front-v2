import { DogIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ProductInOrder } from "./interface/product-added.interface";
import { TrackedProduct } from "../../inventory/tracked-products/interfaces/tracked-product.interface";
import { formatTrackedProduct } from "./utils/format-tracked-product";
import { toast } from "sonner";

interface ActionsCellRow {
  trackedProduct: TrackedProduct;
  setData: Dispatch<SetStateAction<ProductInOrder[]>>;
}

const AddProduct = ({ trackedProduct, setData }: ActionsCellRow) => {
  const formattedProduct = formatTrackedProduct(trackedProduct);

  const handleAddProduct = () => {
    setData((prev: ProductInOrder[]) => {
      // si ya existe un producto con el mismo id, no lo agrega
      if (prev.some((product) => product.id === formattedProduct.id)) {
        toast.error("Product already added");
        return prev;
      } else {
        toast.success("Product added successfully");
        return [...prev, formattedProduct];
      }
    });
  };

  return <DogIcon className="cursor-pointer" onClick={handleAddProduct} />;
};

export default AddProduct;
