import { apiRequest } from "@/helpers/http.adapter";

interface DeletePalletResponse {
    success: boolean;
    data: DeletePalletData;
}

interface DeletePalletData {
    id: number;
    pallet_number: string;
    warehouse_location_id: number;
    purchase_order_id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeletePalletProps {
    palletId: number;
}

export const deletePallet = async ({
    palletId,
}: DeletePalletProps): Promise<DeletePalletResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets/${palletId}`;
    const options: RequestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return apiRequest<DeletePalletResponse>(url, options);
}