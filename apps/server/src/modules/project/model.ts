import { t, type UnwrapSchema } from "elysia";

const PROJECT_NAME_VALIDATION = {
  name: t.String({
    minLength: 4,
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    error: "Invalid project slug",
  }),
};

const USER_ID_VALIDATION = {
  id: t.String({
    pattern: "^c[a-z0-9]{24}$",
    error: "Invalid ID format",
  }),
};

const PAGINATION_VALIDATION = {
  page: t.Number({ minimum: 1 }),
  pageSize: t.Number({ minimum: 1 }),
};

export const ProjectSchemas = {
  // Schema:: get all the projects
  getProjectsRequestBody: t.Object(PAGINATION_VALIDATION),

  // Schema:: get one project by name
  getProjectNameParam: t.Object(PROJECT_NAME_VALIDATION),

  // Schema:: get one project by id
  getProjectIdParam: t.Object(USER_ID_VALIDATION),

  // Schema:: create a project by name
  createProjectBody: t.Object(PROJECT_NAME_VALIDATION),

  // Schema:: update the project name
  updateProjectName: t.Object(PROJECT_NAME_VALIDATION),

  // Schema:: update the project
  updateProjectNameParams: t.Object(USER_ID_VALIDATION),

  // Schema:: delete the prokect by id
  deleteProjectParams: t.Object(USER_ID_VALIDATION),
} as const;

export type ProjectModel = {
  [k in keyof typeof ProjectSchemas]: UnwrapSchema<(typeof ProjectSchemas)[k]>;
};
