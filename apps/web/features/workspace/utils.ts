export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  path: string;
};

export function buildFileTree(files: { filePath: string; content: string }[]): FileNode[] {
  const root: FileNode[] = [];

  for (const file of files) {
    const parts = file.filePath.split('/').filter(Boolean);
    let currentLevel = root;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath += (currentPath ? '/' : '') + part;
      
      const isFile = i === parts.length - 1;
      let existingNode = currentLevel.find(n => n.name === part);

      if (!existingNode) {
        const newNode: FileNode = {
          name: part||"",
          type: isFile ? "file" : "folder",
          path: currentPath,
        };
        if (isFile) {
          newNode.content = file.content;
        } else {
          newNode.children = [];
        }
        currentLevel.push(newNode);
        existingNode = newNode;
      }
      
      if (!isFile) {
        currentLevel = existingNode!.children!;
      }
    }
  }

  const sortTree = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const n of nodes) {
      if (n.children) {
        sortTree(n.children);
      }
    }
  };
  sortTree(root);

  return root;
}
