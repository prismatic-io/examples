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
} from "./actions/messages";
import {
  closeConversation,
  createConversation,
  renameConversation,
  leaveConversation,
  listConversations,
  listConversationMembers,
} from "./actions/conversations";
import { getUser, listUsers } from "./actions/users";
import {
  createChannel,
  listChannels,
  renameChannel,
  archiveChannel,
} from "./actions/channels";

export default component({
  key: "slack",
  documentationUrl: "https://prismatic.io/docs/components/slack",
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
    leaveConversation,
    listConversations,
    listConversationMembers,
    listUsers,
    createChannel,
    listChannels,
    renameChannel,
    archiveChannel,
    postSlackMessage,
  },
  triggers,
});
