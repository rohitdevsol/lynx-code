import { t, type UnwrapSchema } from "elysia";

export const ProjectSchemas = {
  getProjectsRequestBody: t.Object({
    page: t.Number({ minimum: 1 }),
    pageSize: t.Number({ minimum: 1 }).default(10),
  }),
} as const;

export type ProjectModel = {
  [k in keyof typeof ProjectSchemas]: UnwrapSchema<(typeof ProjectSchemas)[k]>;
};
