
export type ToolApproval = {
    callId: string;
    decision: 'approved' | 'rejected';
    reason?: string;
};

export type PendingApproval = {
    callId: string;
    toolName: string;
    arguments: any;
    agentName: string;
};

export type ApprovalResult = {
    needsApproval: boolean;
    response?: string;
    state?: string;
    pendingApprovals?: PendingApproval[];
    history: any[];
};