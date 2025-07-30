import { webSearchTool, codeInterpreterTool } from "@openai/agents";

const hostedTools = () => [webSearchTool(), codeInterpreterTool()];

export default hostedTools;
