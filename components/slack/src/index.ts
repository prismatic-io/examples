import { component } from "@prismatic-io/spectral";
import connections from "./connections";
import triggers from "./triggers";
import dataSources from "./dataSources";

import {
  postMessage,
  deleteMessage,
  deletePendingMessage,
  updateMessage,
  postEphemeralMessage,
  postSlackMessage,
  postBlockMessage,
  postWebhookBlockMessage,
  listScheduledMessages,
  searchMessages,
} from "./actions/messages";
import {
  closeConversation,
  createConversation,
  renameConversation,
  leaveConversation,
  listConversations,
  listConversationMembers,
  archiveConversation,
  conversationExists,
  inviteUserToConversation,
  setConversationPurpose,
  setConversationTopic,
  getConversationsHistory,
  // searchConversation,
} from "./actions/conversations";
import {
  getUser,
  getUserById,
  listUsers,
  listUsersConversations,
} from "./actions/users";
import { listFiles, searchFiles, uploadFile } from "./actions/files";
import rawRequest from "./actions/rawRequest";
// import views from "./actions/views";
import { searchAll } from "./actions/searchAll";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";

export default component({
  key: "slack",
  documentationUrl: "https://prismatic.io/docs/components/slack/",
  public: true,
  display: {
    label: "Slack",
    description: "Send messages to Slack channels and users",
    iconPath: "icon.png",
    category: "Application Connectors",
  },
  connections,
  actions: {
    postMessage,
    deleteMessage,
    deletePendingMessage,
    updateMessage,
    postEphemeralMessage,
    closeConversation,
    createConversation,
    renameConversation,
    getUser,
    getUserById,
    leaveConversation,
    listConversations,
    listConversationMembers,
    listUsers,
    postSlackMessage,
    postBlockMessage,
    postWebhookBlockMessage,
    archiveConversation,
    conversationExists,
    listScheduledMessages,
    listFiles,
    inviteUserToConversation,
    setConversationPurpose,
    setConversationTopic,
    listUsersConversations,
    uploadFile,
    getConversationsHistory,
    rawRequest,
    // ...views,
    // searchConversation,
    searchAll,
    searchFiles,
    searchMessages,
  },
  triggers,
  dataSources,
  hooks: {
    error: handleErrors,
  },
});
