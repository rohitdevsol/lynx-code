import Elysia from "elysia";
import { betterAuthPlugin } from "@server/middlewares/auth";
import { GithubService } from "@server/utils/github";

export const userRouter = new Elysia()
  .use(betterAuthPlugin)
  .guard({ auth: true, detail: { tags: ["User"] } }, (app) =>
    app.get("/user/profile", async ({ user }) => {
      try {
        const profile = await GithubService.getUserDetails(user.id);
        return { success: true, profile };
      } catch (error: any) {
        console.error("Failed to fetch user profile", error);
        return { success: false, error: error.message };
      }
    })
  );
