import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { betterAuthPlugin } from "./middlewares/auth.middleware";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.WEB_URL!,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(betterAuthPlugin) // mounts /api/auth/*
  //   .use(projectsRouter) // mounts /projects/*
  .get("/health", () => ({ status: "ok" }))
  .listen(4000);

console.log(`🦊 Elysia running at http://localhost:${app.server?.port}`);

export type App = typeof app;
