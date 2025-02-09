import type { BaseService, IApiRequest } from "./base-service";
import { InventoryService } from "./inventory-service";
import { apiRequest } from "@/helpers/http.adapter";
import { PurchaseOrderService } from "./purchase-order-service";
import { AuthService } from "./auth-service";

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

  public getPurchaseOrderService(): PurchaseOrderService {
    if (!this.services.has("purchaseOrder")) {
      this.services.set(
        "purchaseOrder",
        new PurchaseOrderService(this.apiRequest)
      );
    }
    return this.services.get("purchaseOrder") as PurchaseOrderService;
  }

  public getAuthService(): AuthService {
    if (!this.services.has("auth")) {
      this.services.set("auth", new AuthService(this.apiRequest));
    }
    return this.services.get("auth") as AuthService;
  }

  // Add methods for other services as needed
}

// Export a singleton instance of the ServiceFactory
export const serviceFactory = ServiceFactory.getInstance();
