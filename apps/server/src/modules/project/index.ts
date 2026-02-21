import Elysia from "elysia";
import { ProjectSchemas, type ProjectModel } from "./model";
import { betterAuthPlugin } from "@/middlewares/auth";
import { ProjectService } from "./service";

export const projectsRouter = new Elysia()
  .use(betterAuthPlugin)
  .get(
    "/projects",
    async ({ user, body }) => {
      return await ProjectService.getProjects(user.id, body);
    },
    {
      auth: true,
      body: ProjectSchemas.getProjectsRequestBody,
      detail: {
        tags: ["Project"],
      },
    },
  )
  .get(
    "project/:name",
    async ({ params, user }) => {
      return await ProjectService.getProject(user.id, params);
    },
    {
      auth: true,
      params: ProjectSchemas.getProjectNameParam,
      detail: {
        tags: ["Project"],
      },
    },
  )
  .post(
    "/project",
    async ({ user, body }) => {
      return await ProjectService.createProject(user.id, body);
    },
    {
      auth: true,
      body: ProjectSchemas.createProjectBody,
      detail: {
        tags: ["Project"],
      },
    },
  )
  .post(
    "/project/:id",
    async ({ params, user, body }) => {
      return await ProjectService.updateProjectName(user.id, params, body);
    },
    {
      auth: true,
      params: ProjectSchemas.updateProjectNameParams,
      body: ProjectSchemas.createProjectBody,
      detail: {
        tags: ["Project"],
      },
    },
  );
