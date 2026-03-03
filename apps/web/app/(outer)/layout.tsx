import { requireAuth } from "@/lib/auth-utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <>{children}</>;
}
