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
    const errorData = await response.json();
    const errorMessage = errorData.msg || "An unexpected error occurred";
    throw new HttpError(errorMessage, response.status);
  }
  return response.json();
};

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  delay: number = 100
): Promise<T> => {
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
