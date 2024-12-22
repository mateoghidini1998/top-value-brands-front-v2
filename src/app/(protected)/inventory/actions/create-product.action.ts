import { sleep } from "@/helpers";

interface CreateProductProps {
  ASIN: string;
  product_cost: number;
  supplier_id: number;
  supplier_item_number: string;
}

export const createProduct = async (data: CreateProductProps) => {
  await sleep(2000);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors ? errorData.errors[0].msg : "Network response was not ok"
    );
  }
  return response.json();
};
