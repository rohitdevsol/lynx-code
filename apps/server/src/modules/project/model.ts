import { t, type UnwrapSchema } from "elysia";

export const ProjectSchemas = {
  //get all the projects
  getProjectsRequestBody: t.Object({
    page: t.Number({ minimum: 1 }),
    pageSize: t.Number({ minimum: 1 }).default(10),
  }),

  //get one project by slug
  getProjectSlugParam: t.Object({
    slug: t.String({ minLength: 1 }),
  }),
} as const;

export type ProjectModel = {
  [k in keyof typeof ProjectSchemas]: UnwrapSchema<(typeof ProjectSchemas)[k]>;
};
