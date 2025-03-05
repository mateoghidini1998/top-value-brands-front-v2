"use server";

import { sleep } from "@/helpers";
import { cookies } from "next/headers";

// Define a serializable error structure
export type SerializableError = {
  name: string;
  message: string;
  status: number;
};
export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    console.log("we have an error");
    const errorData = await response.json();
    const backendMessage = errorData.msg || "An unexpected error occurred";

    // Create a serializable error object
    throw {
      name: "HttpError",
      message: backendMessage,
      status: response.status,
    } as SerializableError;
  }

  return response.json() as Promise<T>;
};

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  delay: number = 1
): Promise<T> => {
  const authHeader = cookies().get("__session")?.value;

  options.headers = {
    ...options.headers,
    // @ts-expect-error Authroization no esta definido en RequestInit
    Authorization: options.headers?.Authorization || authHeader,
  };

  try {
    await sleep(delay);
    const response = await fetch(url, options);
    return handleResponse<T>(response);
  } catch (error) {
    // Just rethrow the error - we'll handle it on the client
    throw error;
  }
};
