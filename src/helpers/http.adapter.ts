// "use server";

// import { cookies } from "next/headers";
import { sleep } from "./sleep";
import { HttpError } from "@/hooks/mutation-factory";
import { SerializableError } from "@/lib/api-utils";
import { getSessionId } from "./get-session-id";

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    console.log("we have an error");
    const errorData = await response.json();
    const backendMessage = errorData.msg || "An unexpected error occurred";

    // Ensure error is serializable for client-side
    return Promise.reject({
      name: "HttpError",
      message: backendMessage,
      status: response.status,
    });
  }

  return response.json() as Promise<T>;
};

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  delay: number = 1
): Promise<T> => {
  const authHeader = `${await getSessionId()}`;
  // const authHeader = cookies().get("__session")?.value;

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
    // Convert serialized error to HttpError if needed
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "HttpError"
    ) {
      throw HttpError.fromSerializable(error as SerializableError);
    }
    throw error;
  }
};
