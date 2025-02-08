import type { BaseService, IApiRequest } from "./base-service";
import { InventoryService } from "./inventory-service";
import { apiRequest } from "@/helpers/http.adapter";

export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, BaseService> = new Map();

  private constructor(private apiRequest: IApiRequest) {}

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory(apiRequest);
    }
    return ServiceFactory.instance;
  }

  public getInventoryService(): InventoryService {
    if (!this.services.has("inventory")) {
      this.services.set("inventory", new InventoryService(this.apiRequest));
    }
    return this.services.get("inventory") as InventoryService;
  }

  // Add methods for other services as needed
}

// Export a singleton instance of the ServiceFactory
export const serviceFactory = ServiceFactory.getInstance();
