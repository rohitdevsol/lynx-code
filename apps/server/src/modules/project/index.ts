import Elysia, { t } from "elysia";
import { ProjectSchemas } from "./model";
import { betterAuthPlugin } from "@server/middlewares/auth";
import { ProjectService } from "./service";
import { prisma } from "@repo/db";
import { SandboxManager } from "@server/utils/sandbox";

export const projectsRouter = new Elysia()
  .use(betterAuthPlugin)
  .guard({ auth: true, detail: { tags: ["Project"] } }, (app) =>
    app
      .get(
        "/projects",
        async ({ user, query }) => {
          return await ProjectService.getAllProjects(user.id, query);
        },
        {
          query: ProjectSchemas.getProjectsRequestQuery,
        },
      )

      // Handler:: to get specific project vy project name(unique)
      // .get(
      //   "project/:name",
      //   async ({ params, user }) => {
      //     return await ProjectService.getProjectByName(user.id, params);
      //   },
      //   {
      //     params: ProjectSchemas.getProjectNameParam,
      //   },
      // )

      // Handler:: to create a project
      .post(
        "/project",
        async ({ user, body }) => {
          return await ProjectService.createProject(user.id, body);
        },
        {
          body: ProjectSchemas.createProjectBody,
        },
      )

      // Handler:: to update the project name via id
      .patch(
        "/project/:id",
        async ({ params, user, body }) => {
          return await ProjectService.updateProject(user.id, params, body);
        },
        {
          params: ProjectSchemas.updateProjectNameParams,
          body: ProjectSchemas.createProjectBody,
        },
      )

      // Handler:: to delete project by id
      .delete(
        "/project/:id",
        async ({ params, user }) => {
          return await ProjectService.deleteProjectById(user.id, params);
        },
        {
          params: ProjectSchemas.deleteProjectParams,
        },
      )

      // Handler: Mount Sandbox
      .post(
        "/project/:id/sandbox",
        async ({ params, user }) => {
          // 0. Fetch the project to know the template
          const project = await prisma.project.findUnique({
            where: { id: params.id }
          });

          // 1. Fetch file snapshots from DB
          const files = await prisma.fileSnapshot.findMany({
            where: { projectId: params.id },
          });

          // 2. Provision and Sync files to E2B Sandbox
          for (const file of files) {
            await SandboxManager.syncFileToSandbox(
              params.id,
              file.filePath,
              file.content,
            );
          }

          const hasPackageJson = files.some(
            (f) => f.filePath === "package.json",
          );
          
          const sandbox = await SandboxManager.getSandbox(params.id);

          if (!hasPackageJson && project?.template === "react") {
            // Inject a fallback Vite React configuration so the sandbox can start
            await sandbox.files.write("package.json", JSON.stringify({
              name: "vite-react-fallback",
              version: "0.0.0",
              scripts: { dev: "vite", build: "vite build" },
              dependencies: { react: "^18.2.0", "react-dom": "^18.2.0" },
              devDependencies: { vite: "^5.2.0" }
            }, null, 2));
            
            const hasIndexHtml = files.some(f => f.filePath === "index.html");
            if (!hasIndexHtml) {
              await sandbox.files.write("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);
            }
          }

          if (hasPackageJson || project?.template === "react") {
            const installCmd = `npm install --no-audit --no-fund --legacy-peer-deps`;
            console.log(`[Sandbox ${params.id}] Installing dependencies...`);
            const installRes = await sandbox.commands.run(installCmd);
            if (installRes.error) {
               console.warn(`[Sandbox ${params.id}] npm install warning:`, installRes.stderr);
            }
            
            console.log(`[Sandbox ${params.id}] Staring dev server...`);
            const devResult = await SandboxManager.startDevServer(
              params.id,
              "npm",
            );
            return { url: devResult.url };
          }

          return {
            warning:
              "No package.json found in project snapshots. Sandbox provisioned but dev server couldn't start",
            url: "",
          };
        },
        {
          params: t.Object({ id: t.String() }),
        },
      )

      // Handler: Execute command in sandbox
      .post(
        "/project/:id/sandbox/exec",
        async ({ params, body }) => {
          const sandbox = await SandboxManager.getSandbox(params.id);
          const result = await sandbox.commands.run(body.command);
          return { stdout: result.stdout, stderr: result.stderr };
        },
        {
          params: t.Object({ id: t.String() }),
          body: t.Object({ command: t.String() }),
        },
      )

      // Handler: Get Project Files
      .get(
        "/project/:id/files",
        async ({ params, user }) => {
          const files = await prisma.fileSnapshot.findMany({
            where: { projectId: params.id },
          });
          return files;
        },
        {
          params: t.Object({ id: t.String() }),
        },
      )

      // Handler: Get Project File
      .post(
        "/project/:id/files/sync",
        async ({ params, body, user }) => {
          // 1. Update DB
          const file = await prisma.fileSnapshot.upsert({
            where: {
              projectId_filePath: {
                projectId: params.id,
                filePath: body.filePath,
              },
            },
            update: { content: body.content },
            create: {
              projectId: params.id,
              filePath: body.filePath,
              content: body.content,
            },
          });

          // 2. Sync to E2B Sandbox
          await SandboxManager.syncFileToSandbox(
            params.id,
            body.filePath,
            body.content,
          );

          return file;
        },
        {
          params: t.Object({ id: t.String() }),
          body: t.Object({ filePath: t.String(), content: t.String() }),
        },
      )
      
      // Handler: Get Latest Chat Session History
      .get(
        "/project/:id/chat",
        async ({ params, user }) => {
          const session = await prisma.chatSession.findFirst({
            where: { projectId: params.id, userId: user.id },
            orderBy: { createdAt: "desc" },
            include: { messages: { orderBy: { createdAt: "asc" } } }
          });
          return session ? session.messages : [];
        },
        {
          params: t.Object({ id: t.String() }),
        }
      ),
  );
