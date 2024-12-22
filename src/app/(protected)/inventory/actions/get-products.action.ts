import { GetInventoryResponse } from "@/app/(protected)/inventory/interfaces/product.interface";
import { sleep } from "@/helpers";

interface GetIventoryProps {
  page: number;
  limit: number;
  keyword?: string;
  supplier?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getInventory = async ({
  page = 1,
  limit = 50,
  keyword = "",
  supplier = "",
  orderBy = "",
  orderWay = "",
}: GetIventoryProps): Promise<GetInventoryResponse> => {
  await sleep(2000);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&orderBy=${orderBy}&orderWay=${orderWay}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors ? errorData.errors[0].msg : "Network response was not ok"
    );
  }
  return response.json();
};
