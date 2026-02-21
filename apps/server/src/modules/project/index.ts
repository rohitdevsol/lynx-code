import Elysia from "elysia";
import { ProjectSchemas, type ProjectModel } from "./model";
import { betterAuthPlugin } from "@/middlewares/auth";
import { ProjectService } from "./service";

export const projectsRouter = new Elysia().use(betterAuthPlugin).get(
  "/projects",
  async ({ user, body }) => {
    return await ProjectService.getProjects(user.id, body);
  },
  {
    auth: true,
    body: ProjectSchemas.getProjectsRequestBody,
  },
);
