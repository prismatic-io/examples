export interface ChatResponse {
  response?: string;
  conversationId: string;
  lastResponseId: string;
  interruptions?: Interruption[];
  state?: string;
}

export interface Interruption {
  functionId: string;
  name: string;
  arguments: unknown;
  approved: boolean;
}

export interface ChatRequest {
  message?: string | null;
  conversationId: string;
  lastResponseId?: string;
  interruptions?: Interruption[];
  state?: string;
}

export interface ConversationState {
  lastResponseId?: string;
  state?: string;
  pendingInterruption?: {
    functionId: string;
    name: string;
    arguments: unknown;
  };
}