import { prisma } from "@repo/db";
import type { ProjectModel } from "./model";

export abstract class ProjectService {
  // method to get all the projects
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

  // method to get one project
  static async getProject(
    userId: string,
    { name }: ProjectModel["getProjectNameParam"],
  ) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        name,
        userId,
      },
    });

    return project;
  }

  // create project
  static async createProject(
    userId: string,
    body: ProjectModel["createProjectBody"],
  ) {
    const project = await prisma.project.create({
      data: {
        name: body.name,
        userId,
      },
    });

    return project;
  }

  static async updateProjectName(
    userId: string,
    params: ProjectModel["updateProjectNameParams"],
    body: ProjectModel["updateProjectName"],
  ) {
    await prisma.project.update({
      where: {
        id: params.id,
        userId,
      },
      data: {
        name: body.name,
      },
    });
  }
}
