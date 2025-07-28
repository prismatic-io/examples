export interface SlackWebhookRequestBody {
  challenge?: string; // For Slack URL verification
}

export interface AgentConfiguration {
  systemPrompt: string;
  openAIKey: string;
}