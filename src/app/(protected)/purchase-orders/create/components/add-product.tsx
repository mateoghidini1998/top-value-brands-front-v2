import { SquarePlus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import {
  LocalStorageProduct,
  ProductInOrder,
} from "../interface/product-added.interface";
import { formatTrackedProduct } from "../utils/format-tracked-product";
import { TrackedProduct } from "@/types";

interface ActionsCellRow {
  trackedProduct: TrackedProduct;
  setData: Dispatch<SetStateAction<ProductInOrder[]>>;
}

const AddProduct = ({ trackedProduct, setData }: ActionsCellRow) => {
  const formattedProduct = formatTrackedProduct(trackedProduct);
  // Recupera los productos guardados en localStorage
  const storedProducts: LocalStorageProduct[] = JSON.parse(
    localStorage.getItem("productsAdded") ?? "[]"
  );

  const handleAddProduct = () => {
    // Verifica si el producto tiene un suppplier_id y si no lo tiene, muestra un mensaje de error
    if (!trackedProduct.supplier_id) {
      toast.error("Product without supplier");
      return;
    }

    setData((prev: ProductInOrder[]) => {
      // Si existe un producto ya agregado, verifica que tengan el mismo supplier_id
      if (prev.length > 0) {
        const productWithSameSupplier = prev.find(
          (product) => product.supplier_id !== formattedProduct.supplier_id
        );

        if (productWithSameSupplier) {
          toast.error("Products must have the same supplier");
          return prev;
        }
      }

      // Si no hay productos en localStorage, simplemente crea un array vacío y agrega el nuevo producto
      if (storedProducts.length === 0) {
        localStorage.setItem(
          "productsAdded",
          JSON.stringify([
            {
              product_id: formattedProduct.product_id,
              quantity: 1,
              cost: formattedProduct.product_cost,
            },
          ])
        );
        return [
          {
            ...formattedProduct,
            quantity: 1,
          },
        ];
      }

      // Busca el producto en localStorage para recuperar su cantidad, si existe
      const storedProduct = storedProducts.find(
        (product: LocalStorageProduct) =>
          product.product_id === formattedProduct.product_id
      );

      // Si ya existe un producto con el mismo id en el estado, no lo agrega
      if (
        prev.some(
          (product) => product.product_id === formattedProduct.product_id
        )
      ) {
        toast.error("Product already added");
        return prev;
      } else {
        toast.success("Product added successfully");

        const updatedProduct: ProductInOrder = {
          ...formattedProduct,
          quantity: storedProduct?.quantity || 1, // Usa la cantidad del localStorage o una inicial
        };

        // Agrega el nuevo producto al array
        const newLocalStorageProduct = {
          product_id: formattedProduct.product_id,
          quantity: 1,
          cost: formattedProduct.product_cost,
        };

        localStorage.setItem(
          "productsAdded",
          JSON.stringify([...storedProducts, newLocalStorageProduct])
        );

        // Actualiza el estado y guarda la nueva lista en localStorage
        const updatedData = [...prev, updatedProduct];

        return updatedData;
      }
    });
  };

  return (
    <SquarePlus className="w-5 h-5 cursor-pointer" onClick={handleAddProduct} />
  );
};

export default AddProduct;
