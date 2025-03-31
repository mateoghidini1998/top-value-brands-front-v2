import { ManualDGInsertionResponse } from "@/types/settings/settings.type";
import { BaseService, IApiRequest } from "./base-service";

export class SettingsService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/settings";
  }

  public toggleManualDGInsertion = () => {
    const url = this.constructUrl("/");
    const options = this.constructOptions("PUT");
    return this.apiRequest<ManualDGInsertionResponse>(url, options);
  };
}
