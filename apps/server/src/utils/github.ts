import { Octokit } from "@octokit/rest";
import { prisma } from "@repo/db";

export class GithubService {

  static async getOctokitForUser(userId: string): Promise<Octokit> {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        providerId: "github",
      },
    });

    if (!account || !account.accessToken) {
      throw new Error("No connected GitHub account found for this user.");
    }

    return new Octokit({ auth: account.accessToken });
  }

  static async getUserDetails(userId: string) {
    const octokit = await this.getOctokitForUser(userId);
    const { data } = await octokit.rest.users.getAuthenticated();
    return {
      name: data.name || data.login,
      login: data.login,
      avatarUrl: data.avatar_url,
    };
  }

  static async createRepository(userId: string, name: string, description: string) {
    const octokit = await this.getOctokitForUser(userId);

    const { data } = await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: true,
      auto_init: true,
    });

    return data;
  }

  static async commitFiles(
    userId: string,
    params: {
      owner: string;
      repo: string;
      branch?: string;
      message: string;
      files: Array<{ path: string; content: string }>;
    }
  ) {
    const octokit = await this.getOctokitForUser(userId);
    let branch = params.branch;
    
    // Resolve exact branch if not provided so it doesn't crash on 'master' default
    if (!branch) {
      const { data: repoInfo } = await octokit.rest.repos.get({
        owner: params.owner,
        repo: params.repo,
      });
      branch = repoInfo.default_branch || "main";
    }

    // 1. Get the current commit
    const { data: refData } = await octokit.rest.git.getRef({
      owner: params.owner,
      repo: params.repo,
      ref: `heads/${branch}`,
    });
    const commitSha = refData.object.sha;

    // 2. Get the commit tree
    const { data: commitData } = await octokit.rest.git.getCommit({
      owner: params.owner,
      repo: params.repo,
      commit_sha: commitSha,
    });
    const treeSha = commitData.tree.sha;

    // 3. Create blobs for the files
    const newTreeItems = await Promise.all(
      params.files.map(async (file) => {
        const { data: blobData } = await octokit.rest.git.createBlob({
          owner: params.owner,
          repo: params.repo,
          content: file.content,
          encoding: "utf-8",
        });

        return {
          path: file.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blobData.sha,
        };
      })
    );

    // 4. Create a new tree
    const { data: newTreeData } = await octokit.rest.git.createTree({
      owner: params.owner,
      repo: params.repo,
      base_tree: treeSha,
      tree: newTreeItems,
    });

    // 5. Create a new commit
    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner: params.owner,
      repo: params.repo,
      message: params.message,
      tree: newTreeData.sha,
      parents: [commitSha],
    });

    // 6. Update the reference
    await octokit.rest.git.updateRef({
      owner: params.owner,
      repo: params.repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });

    return newCommitData.sha;
  }
}
