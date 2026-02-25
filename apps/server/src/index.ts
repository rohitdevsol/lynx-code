import "dotenv/config";
import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { betterAuthPlugin } from "@server/middlewares/auth";
import { projectsRouter } from "@server/modules/project";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { BetterAuthOpenAPI } from "./utils/auth";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL!,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    openapi({
      references: fromTypes(),
      documentation: {
        info: {
          title: "Lynx Code",
          version: "1.0.0",
          description: "Backend APIs for Lynx Code",
        },
        components: {
          ...(await BetterAuthOpenAPI.getComponents()),
          securitySchemes: {
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "better-auth.session_token",
              description:
                "Login via POST /api/auth/sign-in/email first, the cookie is set automatically",
            },
          },
        },
        paths: await BetterAuthOpenAPI.getPaths("/api/auth"),
        tags: [
          {
            name: "Auth",
            description: "Authentication endpoints (Better Auth)",
          },
          { name: "Project", description: "Project endpoints" },
        ],
        security: [{ cookieAuth: [] }],
      },
    }),
  )
  .use(betterAuthPlugin)
  .use(projectsRouter)
  .get("/health", () => ({ status: "ok" }))
  .listen(4000);

export type App = typeof app;
