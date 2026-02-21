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
}
