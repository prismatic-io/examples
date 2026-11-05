import { codeInterpreterTool, webSearchTool } from "@openai/agents";

const hostedTools = () => [webSearchTool(), codeInterpreterTool()];

export default hostedTools;
