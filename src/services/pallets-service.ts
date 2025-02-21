import {
  GetAllPalletProductsResponse,
  GetPalletByIDResponse,
  GetPalletsResponse,
} from "@/types";
import { CreatePalletProps } from "@/types/pallets/create.types";
import { DeletePalletResponse } from "@/types/pallets/delete.types";
import { GetPalletsProps } from "@/types/pallets/get.types";
import { BaseService, IApiRequest } from "./base-service";
import { UpdatePalletLocationProps } from "@/types/pallets/update.types";

export class PalletsService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/pallets";
  }

  public async getAllPallets({
    page = 1,
    limit = 50,
    keyword = "",
    pallet_number = "",
    warehouse_location_id = "",
    orderBy = "",
    orderWay = "",
  }: GetPalletsProps) {
    const url = this.constructUrl(
      `?page=${page}&limit=${limit}&keyword=${keyword}&pallet_number=${pallet_number}&warehouse_location_id=${warehouse_location_id}&orderBy=${orderBy}&orderWay=${orderWay}`
    );
    return this.apiRequest<GetPalletsResponse>(url);
  }

  public async getPalletById(palletId: string) {
    const url = this.constructUrl(`/${palletId}`);
    return this.apiRequest<GetPalletByIDResponse>(url);
  }

  public async createPallet(pallet: CreatePalletProps) {
    const url = this.constructUrl("/");
    const options = this.constructOptions("POST", pallet);
    return this.apiRequest<string>(url, options);
  }

  public async updatePalletLocation({
    palletId,
    warehouseLocationId,
  }: UpdatePalletLocationProps) {
    const url = this.constructUrl(`/location/${palletId}`);
    const options = this.constructOptions("PATCH", {
      warehouse_location_id: warehouseLocationId,
    });
    return this.apiRequest<string>(url, options);
  }

  public async deletePallet(palletId: number) {
    const url = this.constructUrl(`/${palletId}`);
    const options = this.constructOptions("DELETE");
    return this.apiRequest<DeletePalletResponse>(url, options);
  }

  public async getAllPalletProducts(): Promise<GetAllPalletProductsResponse[]> {
    const url = this.constructUrl("/products/all");
    return this.apiRequest<GetAllPalletProductsResponse[]>(url);
  }
}
