import { t, type UnwrapSchema } from "elysia";

const PROJECT_NAME_VALIDATION = {
  name: t.String({
    minLength: 4,
    error: "Invalid project slug",
  }),
};

const PROJECT_ID_VALIDATION = {
  id: t.String({ format: "uuid" }),
};

const COMMON_PROJECT_DETAILS = {
  description: t.Optional(t.String()),
  template: t.Optional(
    t.Union([
      t.Literal("react"),
      t.Literal("nextjs"),
      t.Literal("vue"),
      t.Literal("blank"),
    ]),
  ),
};
const PROJECT_UPDATE_BODY_VALIDATION = {
  name: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  ...COMMON_PROJECT_DETAILS,
};
const PROJECT_CREATE_BODY_VALIDATION = {
  name: t.String({ minLength: 1, maxLength: 255 }),
  ...COMMON_PROJECT_DETAILS,
};

const PAGINATION_VALIDATION = {
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  pageSize: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
  search: t.Optional(t.String()),
};

export const ProjectSchemas = {
  // Schema:: get all the projects
  getProjectsRequestQuery: t.Object(PAGINATION_VALIDATION),

  // Schema:: get one project by name
  getProjectNameParam: t.Object(PROJECT_NAME_VALIDATION),

  // Schema:: get one project by id
  getProjectIdParam: t.Object(PROJECT_ID_VALIDATION),

  // Schema:: create a project by name
  createProjectBody: t.Object(PROJECT_CREATE_BODY_VALIDATION),

  // Schema:: update the project name
  updateProjectName: t.Object(PROJECT_NAME_VALIDATION),

  updateProject: t.Object(PROJECT_UPDATE_BODY_VALIDATION),

  // Schema:: update the project
  updateProjectNameParams: t.Object(PROJECT_ID_VALIDATION),

  // Schema:: delete the prokect by id
  deleteProjectParams: t.Object(PROJECT_ID_VALIDATION),
} as const;

export type ProjectModel = {
  [k in keyof typeof ProjectSchemas]: UnwrapSchema<(typeof ProjectSchemas)[k]>;
};
