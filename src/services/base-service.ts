export abstract class BaseService {
  protected static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  constructor(protected apiRequest: IApiRequest) {
    if (!BaseService.API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
  }

  protected abstract getEndpoint(): string;

  protected constructUrl(path: string): string {
    return `${BaseService.API_BASE_URL}/api/v1${this.getEndpoint()}${path}`;
  }

  protected constructOptions(method: string, data?: unknown): RequestInit {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    };
  }
}

export type IApiRequest = <T>(url: string, options?: RequestInit) => Promise<T>;
