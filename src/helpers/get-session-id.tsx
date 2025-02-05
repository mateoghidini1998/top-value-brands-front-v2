"use server";

import { cookies } from "next/headers";

export const getSessionId = async () => {
  const sessionToken = cookies().get("__session")?.value;
  return sessionToken ? sessionToken : null;
};
