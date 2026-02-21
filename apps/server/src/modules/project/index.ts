import Elysia from "elysia";
import { ProjectSchemas } from "./model";
import { betterAuthPlugin } from "@/middlewares/auth";
import { ProjectService } from "./service";

export const projectsRouter = new Elysia()
  .use(betterAuthPlugin)
  // Handler:: to get all projects paginated
  .get(
    "/projects",
    async ({ user, body }) => {
      return await ProjectService.getAllProjects(user.id, body);
    },
    {
      auth: true,
      body: ProjectSchemas.getProjectsRequestBody,
      detail: {
        tags: ["Project"],
      },
    },
  )

  // Handler:: to get specific project vy project name(unique)
  .get(
    "project/:name",
    async ({ params, user }) => {
      return await ProjectService.getProjectByName(user.id, params);
    },
    {
      auth: true,
      params: ProjectSchemas.getProjectNameParam,
      detail: {
        tags: ["Project"],
      },
    },
  )

  // Handler:: to get the project via id ..optional
  .get(
    "project/:id",
    async ({ params, user }) => {
      return await ProjectService.getProjectById(user.id, params);
    },
    {
      auth: true,
      params: ProjectSchemas.getProjectIdParam,
      detail: {
        tags: ["Project"],
      },
    },
  )

  // Handler:: to create a project
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

  // Handler:: to update the project name via id
  .patch(
    "/project/:id",
    async ({ params, user, body }) => {
      return await ProjectService.updateProjectByName(user.id, params, body);
    },
    {
      auth: true,
      params: ProjectSchemas.updateProjectNameParams,
      body: ProjectSchemas.createProjectBody,
      detail: {
        tags: ["Project"],
      },
    },
  )

  // Handler:: to delete project by id
  .delete(
    "/project/:id",
    async ({ params, user }) => {
      return await ProjectService.deleteProjectById(user.id, params);
    },
    {
      auth: true,
      params: ProjectSchemas.deleteProjectParams,
      detail: {
        tags: ["Project"],
      },
    },
  );
