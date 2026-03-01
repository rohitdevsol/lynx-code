import { Sandbox } from '@e2b/code-interpreter';

// Manage active sandboxes in memory to prevent spinning up duplicate VMs per user project
const activeSandboxes = new Map<string, Sandbox>();

export class SandboxManager {
  static async getSandbox(projectId: string): Promise<Sandbox> {
    if (activeSandboxes.has(projectId)) {
      const existing = activeSandboxes.get(projectId)!;
      try {
        // Check to catch timed out or disconnected sandboxes
        await existing.commands.run("echo 1", { timeoutMs: 3000 });
        return existing;
      } catch (e) {
        console.log(`[E2B] Sandbox for Project ${projectId} timed out or died. Recreating...`);
        activeSandboxes.delete(projectId);
      }
    }

    console.log(`[E2B] Provisioning new sandbox for Project ${projectId}...`);
    const sandbox = await Sandbox.create({
      apiKey: process.env.E2B_API_KEY,
      timeoutMs: 30 * 60 * 1000,
    });

    activeSandboxes.set(projectId, sandbox);
    return sandbox;
  }

  static async syncFileToSandbox(projectId: string, path: string, content: string) {
    const sandbox = await this.getSandbox(projectId);
    // Ensure parent directories exist
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (dir) {
      await sandbox.commands.run(`mkdir -p ${dir}`);
    }
    // Write the actual file content
    await sandbox.files.write(path, content);
  }

  static async deleteFile(projectId: string, path: string) {
    const sandbox = await this.getSandbox(projectId);
    await sandbox.commands.run(`rm -rf ${path}`);
  }

  static async killSandbox(projectId: string) {
    if (activeSandboxes.has(projectId)) {
      const sandbox = activeSandboxes.get(projectId)!;
      await sandbox.kill();
      activeSandboxes.delete(projectId);
    }
  }

  static async startDevServer(projectId: string, packageManager: 'npm' | 'bun' | 'yarn' = 'npm') {
    const sandbox = await this.getSandbox(projectId);
    
    // Check if it's Next.js or Vite to pass correct host flags
    let isNext = false;
    let isVite = false;
    try {
      const packageJsonStr = await sandbox.files.read("package.json");
      const packageJson = JSON.parse(packageJsonStr);
      isNext = !!packageJson.dependencies?.next;
      isVite = !!packageJson.devDependencies?.vite || !!packageJson.dependencies?.vite;
    } catch (e) {
      // Ignore here
    }

    if (isVite) {
      // Ensure Vite accepts E2B proxy hosts irrespective of AI modifications
      const injectAllowedHosts = async (file: string) => {
        try {
          let content = await sandbox.files.read(file);
          if (content && !content.includes("allowedHosts:")) {
            // injection: find `export default defineConfig` and shove the server config inside.
            content = content.replace(
              /export default defineConfig\(\s*\{/, 
              "export default defineConfig({\n  server: { allowedHosts: true },"
            );
            await sandbox.files.write(file, content);
          }
        } catch (e) {}
      };
      await injectAllowedHosts("vite.config.js");
      await injectAllowedHosts("vite.config.ts");
    }
    
    const devCommand = isNext 
      ? `${packageManager} run dev -- -H 0.0.0.0 -p 5173` 
      : `${packageManager} run dev -- --host 0.0.0.0 --port 5173`;

    // We start the dev server in the background
    // E2B Code Interpreter will give us a URL mapped to the port
    const process = await sandbox.commands.run(devCommand, {
      background: true
    });

    // Wait slightly for it to start up
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // V0/React typically uses 5173 (vite) or 3000 (next)
    // We enforce 5173 above
    const url = `https://${sandbox.getHost(5173)}`;
    return { url, process };
  }
}
