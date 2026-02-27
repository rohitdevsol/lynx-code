import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "./auth-client";

export async function requireAuth() {
  const reqHeaders = await headers();
  const session = await authClient.getSession({
    fetchOptions: {
      headers: reqHeaders,
    },
  });

  if (!session?.data?.session) {
    redirect("/login");
  }

  return session.data;
}

export async function requireUnAuth() {
  const reqHeaders = await headers();
  const session = await authClient.getSession({
    fetchOptions: {
      headers: reqHeaders,
    },
  });

  if (session?.data?.session) {
    redirect("/home");
  }

  return session.data;
}
