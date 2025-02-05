import { getSessionId } from "./get-session-id";
import { sleep } from "./sleep";

class HttpError extends Error {
  status: number;
  backendMessage?: string;

  constructor(message: string, status: number, backendMessage?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.backendMessage = backendMessage;
  }
}

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    const backendMessage = errorData.msg || "An unexpected error occurred";
    return Promise.reject(new HttpError(backendMessage, response.status));
  }
  // Determinar si la respuesta es JSON o un Blob (ej., PDF)
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.blob() as unknown as T;
  }
};

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  delay: number = 1
): Promise<T> => {
  const authHeader = `Bearer ${await getSessionId()}`;

  // Verificar si ya existen headers, de lo contrario inicializarlos
  options.headers = {
    ...options.headers, // Mantiene los headers existentes si hay
    // @ts-expect-error Authroization no está definido en RequestInit
    Authorization: options.headers?.Authorization || authHeader, // Agregar el header si no existe
  };
  try {
    await sleep(delay);
    const response = await fetch(url, options);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError) {
      return Promise.reject(error);
    }
    throw error;
  }
};
