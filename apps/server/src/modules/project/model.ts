import { t, type UnwrapSchema } from "elysia";

export const ProjectSchemas = {
  //get all the projects
  getProjectsRequestBody: t.Object({
    page: t.Number({ minimum: 1 }),
    pageSize: t.Number({ minimum: 1 }),
  }),

  //get one project by name
  getProjectNameParam: t.Object({
    name: t.String({ minLength: 3 }),
  }),

  // create a project by name
  createProjectBody: t.Object({
    name: t.String({ minLength: 3 }),
  }),

  // update the project name
  updateProjectName: t.Object({
    name: t.String({ minLength: 3 }),
  }),

  updateProjectNameParams: t.Object({
    id: t.String({ minLength: 3 }),
  }),
} as const;

export type ProjectModel = {
  [k in keyof typeof ProjectSchemas]: UnwrapSchema<(typeof ProjectSchemas)[k]>;
};
