import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class AiService {
  
   //Generates initial project files from a user prompt using LangChain and OpenAI
  static async generateProjectFiles(prompt: string, template: string = "react") {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemPrompt = `You are an expert software engineer.
The user wants to scaffold a new ${template} project based on their description.
Your primary goal is to solve the user's problem by writing robust, production-ready, beautiful code.

### Guidelines
1. **Be concise:** Jump directly to code unless explanation is absolutely necessary.
2. **Architecture:** Keep files modular. Produce small, reusable functions/components.

### Artifact Construction
All generated code modifications and new files MUST be wrapped in special XML <boltArtifact> tags.
Inside the artifact, use <boltAction> tags to specify exact file operations.

Example Rules:
- \`id\`: unique string like "feature-xxx"
- \`type="file"\`: for writing to files
- \`filePath\`: exact absolute or relative path, e.g. "src/components/Button.tsx"

<boltArtifact id="scaffold-project" title="Scaffold New Project">
  <boltAction type="file" filePath="package.json">
{
  "name": "my-app",
  "version": "1.0.0"
}
  </boltAction>
  <boltAction type="file" filePath="src/App.jsx">
export default function App() { 
  return <div>Hi</div>; 
}
  </boltAction>
</boltArtifact>

IMPORTANT: Do not skip code, do not use placeholders like "// logic here". Output the full, complete code inside each <boltAction> block. Provide a comprehensive, production-ready starting point.`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Create a project with this description: ${prompt}`),
    ];

    try {
      const response = await model.invoke(messages);
      const content = response.content as string;
      
      const files = AiService.parseCodeBlocks(content);
      
      if (files.length === 0) {
        throw new Error("AI did not return any valid files.");
      }
      
      return files.map(f => ({ path: f.path, content: f.content }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error("Failed to generate project files.");
    }
  }

  static parseCodeBlocks(text: string): { path: string; content: string; type: "file" | "delete" }[] {
    const files: { path: string; content: string; type: "file" | "delete" }[] = [];
    
    // Support Bolt-like XML tags for artifacts, looking for ANY type.
    const fileActionRegex = /<boltAction\s+type="([^"]+)"\s+filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
    let match;
    while ((match = fileActionRegex.exec(text)) !== null) {
      const type = match[1]?.trim() as "file" | "delete";
      const path = match[2]?.trim();
      const content = match[3] || "";
      if (path && (type === "file" || type === "delete")) {
        files.push({ path, content: content.trim(), type });
      }
    }

    // Fallback: look for generic markdown code blocks if no bolt actions found
    if (files.length === 0) {
      const blockRegex = /```(?:[a-zA-Z0-9_-]+:)?([a-zA-Z0-9_\-\.\/]+)\s*\n([\s\S]*?)\n```/g;
      
      let blockMatch;
      while ((blockMatch = blockRegex.exec(text)) !== null) {
        const path = blockMatch[1]?.trim();
        const content = blockMatch[2] || "";
        if (path) {
          files.push({ path, content, type: "file" });
        }
      }
    }
    
    return files;
  }
}
