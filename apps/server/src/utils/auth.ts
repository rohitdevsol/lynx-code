import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [openAPI()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_BASE_URL!,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_FRONTEND_URL!],
});

export type Auth = typeof auth;
export const OpenAPI = auth.api;

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const BetterAuthOpenAPI = {
  getPaths: (prefix = "/api/auth") =>
    getSchema().then(({ paths }) => {
      const result: typeof paths = Object.create(null);
      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        result[key] = paths[path] as any;
        for (const method of Object.keys(paths[path]!)) {
          (result[key] as any)[method].tags = ["Auth"];
        }
      }
      return result;
    }) as Promise<any>,
  getComponents: () =>
    getSchema().then(({ components }) => components) as Promise<any>,
};
