import { prisma } from "@repo/db";
import type { ProjectModel } from "./model";

export abstract class ProjectService {
  static async getProjects(
    userId: string,
    { page, pageSize }: ProjectModel["getProjectsRequestBody"],
  ) {
    const skip = (page - 1) * pageSize;

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  }

  static async getProject(
    userId: string,
    { slug }: ProjectModel["getProjectSlugParam"],
  ) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        slug,
        userId,
      },
    });

    return project;
  }
}
