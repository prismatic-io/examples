import * as fs from "fs/promises";
import * as path from "path";
import { AgentState, StateStorage } from "./types";

export class FileStorage implements StateStorage {
  private lastSavedState: AgentState | null = null;

  constructor(private basePath = "./tmp/agent-state") {}

  async save(state: AgentState): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true });
    const filePath = path.join(this.basePath, `${state.conversationId}.json`);

    let executions: AgentState[] = [];
    try {
      const existingData = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(existingData);
      executions = parsed.executions || [];
    } catch {
      // File doesn't exist, start with empty array
    }

    executions.push(state);

    await fs.writeFile(filePath, JSON.stringify({ executions }, null, 2));

    this.lastSavedState = state;
    console.log(
      `[FileStorage] Saved execution #${executions.length} for conversation ${state.conversationId}`,
    );
  }

  getLastSavedState(): AgentState | null {
    return this.lastSavedState;
  }

  async load(
    conversationId: string,
    _previousExecutionId?: string,
  ): Promise<AgentState | null> {
    const filePath = path.join(this.basePath, `${conversationId}.json`);

    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);

      const executions: AgentState[] = parsed.executions || [];

      if (executions.length === 0) {
        console.log(
          `[FileStorage] No executions found for conversation ${conversationId}`,
        );
        return null;
      }

      const lastExecution = executions[executions.length - 1];
      console.log(
        `[FileStorage] Loaded execution #${executions.length} for conversation ${conversationId}`,
      );

      return lastExecution;
    } catch (error) {
      console.log(
        `[FileStorage] No state file found for conversation ${conversationId}`,
      );
      return null;
    }
  }
}
