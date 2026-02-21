import { prisma } from "@repo/db";
import type { ProjectModel } from "./model";

export abstract class ProjectService {
  // Service:: to get all the projects
  static async getAllProjects(
    userId: string,
    { page, pageSize }: ProjectModel["getProjectsRequestQuery"],
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

  // Service:: to get one project
  static async getProjectByName(
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

  // Service:: to create project
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

  // Service:: to update the project via name
  static async updateProjectByName(
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

  // Service:: to delete a project via project id
  static async deleteProjectById(
    userId: string,
    params: ProjectModel["deleteProjectParams"],
  ) {
    await prisma.project.delete({
      where: {
        id: params.id,
        userId,
      },
    });
  }
}
