import { apiRequest } from "@/helpers/http.adapter";
import { AuthService } from "./auth-service";
import type { BaseService, IApiRequest } from "./base-service";
import { IncomingOrdersService } from "./incoming-orders-service";
import { InventoryService } from "./inventory-service";
import { PalletsService } from "./pallets-service";
import { PurchaseOrderService } from "./purchase-order-service";
import { ShipmentsService } from "./shipments-service";
import { TrackedProductService } from "./tracked-products-service";
import { WarehouseLocationService } from "./warehouse-location-service";

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

  public getIncomingOrderService(): IncomingOrdersService {
    if (!this.services.has("incomingOrder")) {
      this.services.set(
        "incomingOrder",
        new IncomingOrdersService(this.apiRequest)
      );
    }
    return this.services.get("incomingOrder") as IncomingOrdersService;
  }

  public getPalletsService(): PalletsService {
    if (!this.services.has("pallets")) {
      this.services.set("pallets", new PalletsService(this.apiRequest));
    }
    return this.services.get("pallets") as PalletsService;
  }

  public getWarehouseLocationsService(): WarehouseLocationService {
    if (!this.services.has("warehouseLocations")) {
      this.services.set(
        "warehouseLocations",
        new WarehouseLocationService(this.apiRequest)
      );
    }
    return this.services.get("warehouseLocations") as WarehouseLocationService;
  }

  public getTrackedProductService(): TrackedProductService {
    if (!this.services.has("trackedProducts")) {
      this.services.set(
        "trackedProducts",
        new TrackedProductService(this.apiRequest)
      );
    }
    return this.services.get("trackedProducts") as TrackedProductService;
  }

  public getShipmentsService(): ShipmentsService {
    if (!this.services.has("shipments")) {
      this.services.set("shipments", new ShipmentsService(this.apiRequest));
    }
    return this.services.get("shipments") as ShipmentsService;
  }

  // Add methods for other services as needed
}

// Export a singleton instance of the ServiceFactory
export const serviceFactory = ServiceFactory.getInstance();
