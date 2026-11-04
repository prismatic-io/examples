export interface Party {
  id: string;
  emailAddress: string;
  name: string;
  affiliation: "Internal" | "External";
  speakerId?: string;
}

export interface Call {
  id: string;
  title: string;
  scheduled: string;
  started: string;
  duration: number;
  parties?: Party[];
  workspaceId?: string;
  url?: string;
  primaryUserId?: string;
}

export interface TranscriptSentence {
  text: string;
  start: number;
  end: number;
}

/** A contiguous block of speech by one speaker (Gong calls this a "monologue") */
export interface TranscriptMonologue {
  speakerId: string;
  topic?: string | null;
  sentences: TranscriptSentence[];
}

export interface CallTranscript {
  callId: string;
  transcript: TranscriptMonologue[];
}

export interface CallsResponse {
  requestId: string;
  records: {
    totalRecords: number;
    currentPageNumber: number;
    currentPageSize: number;
  };
  calls: Call[];
  cursor?: string;
}

export interface CallTranscriptsResponse {
  requestId: string;
  callTranscripts: CallTranscript[];
}

export interface CallExtensive {
  metaData: {
    id: string;
    url: string;
    title: string;
    scheduled: number;
    started: number;
    duration: number;
    primaryUserId: string;
    direction?: string;
    system?: string;
    scope?: string;
    media?: string;
    language?: string;
    workspaceId?: string;
  };
  parties: Party[];
  content?: unknown;
  interaction?: unknown;
  collaboration?: unknown;
  media?: unknown;
}

export interface CallsExtensiveResponse {
  requestId: string;
  records: {
    totalRecords: number;
    currentPageNumber: number;
    currentPageSize: number;
    cursor?: string;
  };
  calls: CallExtensive[];
}

export interface User {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  active: boolean;
  settings?: {
    webConferencesRecorded: boolean;
    preventWebConferenceRecording: boolean;
    telephonyCallsImported: boolean;
    emailsImported: boolean;
    preventEmailImport: boolean;
    nonRecordedMeetingsImported: boolean;
    gongConnectEnabled: boolean;
  };
}

export interface UsersResponse {
  requestId: string;
  records: {
    totalRecords: number;
    currentPageSize: number;
    currentPageNumber: number;
    cursor?: string;
  };
  users: User[];
}
