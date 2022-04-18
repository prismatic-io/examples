import { component } from "@prismatic-io/spectral";
import connections from "./connections";
import triggers from "./triggers";

import {
  postMessage,
  deleteMessage,
  deletePendingMessage,
  updateMessage,
  postEphemeralMessage,
  postSlackMessage,
  postBlockMessage,
  postWebhookBlockMessage,
} from "./actions/messages";
import {
  closeConversation,
  createConversation,
  renameConversation,
  leaveConversation,
  listConversations,
  listConversationMembers,
} from "./actions/conversations";
import { getUser, getUserById, listUsers } from "./actions/users";
import {
  createChannel,
  renameChannel,
  archiveChannel,
} from "./actions/channels";

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
    createChannel,
    renameChannel,
    archiveChannel,
    postSlackMessage,
    postBlockMessage,
    postWebhookBlockMessage,
  },
  triggers,
});
