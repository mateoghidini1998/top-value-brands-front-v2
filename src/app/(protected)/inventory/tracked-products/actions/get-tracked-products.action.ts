import { sleep } from "@/helpers";
import { GetTrackedProductsResponse } from "../interfaces/tracked-product.interface";

export const getTrackedProducts =
  async (): Promise<GetTrackedProductsResponse> => {
    await sleep(2000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/trackedproducts`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors
          ? errorData.errors[0].msg
          : "Network response was not ok"
      );
    }
    return response.json();
  };
