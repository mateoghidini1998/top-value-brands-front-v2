export class HttpAPI {
  public static async fetch(
    url: string,
    options: RequestInit
  ): Promise<unknown> {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors
          ? errorData.errors[0].msg
          : "Network response was not ok"
      );
    }
    return response.json();
  }

  public static async get(
    url: string,
    options?: RequestInit
  ): Promise<unknown> {
    return this.fetch(url, { method: "GET", ...options });
  }

  public static async post(
    url: string,
    body: object,
    accessToken?: string
  ): Promise<unknown> {
    return this.fetch(url, {
      method: "POST",
      headers: !accessToken
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
      body: JSON.stringify(body),
    });
  }

  public static async patch(
    url: string,
    body?: object,
    accessToken?: string
  ): Promise<unknown> {
    return this.fetch(url, {
      method: "PATCH",
      headers: !accessToken
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
      body: JSON.stringify(body),
    });
  }

  public static async delete(
    url: string,
    accessToken?: string
  ): Promise<unknown> {
    return this.fetch(url, {
      method: "DELETE",
      headers: !accessToken
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
    });
  }
}
