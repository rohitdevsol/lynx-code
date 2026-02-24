import Elysia from "elysia";
import { ProjectSchemas } from "./model";
import { betterAuthPlugin } from "@/middlewares/auth";
import { ProjectService } from "./service";

export const projectsRouter = new Elysia()
  .use(betterAuthPlugin)
  .guard({ auth: true, detail: { tags: ["Project"] } }, (app) =>
    app
      // Handler:: to get all projects paginated
      .get(
        "/projects",
        async ({ user, query }) => {
          return await ProjectService.getAllProjects(user.id, query);
        },
        {
          query: ProjectSchemas.getProjectsRequestQuery,
        },
      )

      // Handler:: to get specific project vy project name(unique)
      .get(
        "project/:name",
        async ({ params, user }) => {
          return await ProjectService.getProjectByName(user.id, params);
        },
        {
          params: ProjectSchemas.getProjectNameParam,
        },
      )

      // Handler:: to create a project
      .post(
        "/project",
        async ({ user, body }) => {
          return await ProjectService.createProject(user.id, body);
        },
        {
          body: ProjectSchemas.createProjectBody,
        },
      )

      // Handler:: to update the project name via id
      .patch(
        "/project/:id",
        async ({ params, user, body }) => {
          return await ProjectService.updateProject(user.id, params, body);
        },
        {
          params: ProjectSchemas.updateProjectNameParams,
          body: ProjectSchemas.createProjectBody,
        },
      )

      // Handler:: to delete project by id
      .delete(
        "/project/:id",
        async ({ params, user }) => {
          return await ProjectService.deleteProjectById(user.id, params);
        },
        {
          params: ProjectSchemas.deleteProjectParams,
        },
      ),
  );
