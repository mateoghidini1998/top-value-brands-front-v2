import { apiRequest } from "@/helpers/http.adapter";
import { GetPalletByIDResponse } from "@/types";

export const GetPalletById = async (props: {
  palletId: string;
}): Promise<GetPalletByIDResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets/${props.palletId}`;
  return await apiRequest<GetPalletByIDResponse>(url);
};
