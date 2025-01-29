"use server";

import { cookies } from "next/headers";
import { sleep } from "./sleep";

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      const errorMessage = errorData.msg || "An unexpected error occurred";
      throw new HttpError(errorMessage, response.status);
    } catch {
      throw new HttpError(response.statusText, response.status);
    }
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
  // Obtener la cookie de sesión
  const sessionToken = cookies().get("__session")?.value;
  const authHeader = `Bearer ${sessionToken}`;

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
      console.error(`HTTP Error (${error.status}): ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Relanzar el error si es necesario para manejarlo en el llamado
  }
};
