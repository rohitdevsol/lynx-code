import { t, type UnwrapSchema } from "elysia";

export const ProjectSchemas = {
  // Schema:: get all the projects
  getProjectsRequestBody: t.Object({
    page: t.Number({ minimum: 1 }),
    pageSize: t.Number({ minimum: 1 }),
  }),

  // Schema:: get one project by name
  getProjectNameParam: t.Object({
    name: t.String({ minLength: 3 }),
  }),

  // Schema:: get one project by id
  getProjectIdParam: t.Object({
    id: t.String({ minLength: 3 }),
  }),

  // Schema:: create a project by name
  createProjectBody: t.Object({
    name: t.String({ minLength: 3 }),
  }),

  // Schema:: update the project name
  updateProjectName: t.Object({
    name: t.String({ minLength: 3 }),
  }),

  // Schema:: update the project
  updateProjectNameParams: t.Object({
    id: t.String({ minLength: 3 }),
  }),

  // Schema:: delete the prokect by id
  deleteProjectParams: t.Object({
    id: t.String(),
  }),
} as const;

export type ProjectModel = {
  [k in keyof typeof ProjectSchemas]: UnwrapSchema<(typeof ProjectSchemas)[k]>;
};
